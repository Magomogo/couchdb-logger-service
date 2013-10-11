(function (undefined) {
    "use strict";

    var _ = require('underscore'),
        http = require("http"),
        assert = require("assert"),
        cradle = require("cradle"),
        async = require("async"),
        conn = new (cradle.Connection)();

    describe('Actual couchDb tests', function () {

        var db,
            writeLogEntry = function(entry, callback) {
                db.query(
                    {
                        method: 'POST',
                        path: '_design/main/_update/entry',
                        body: entry
                    },
                    callback
                );
            };

        beforeEach(function (done) {
            db = conn.database('tests-couchdb-logger-service');

            async.series([
                function (callback) {
                    db.destroy();
                    callback();
                },
                function (callback) {
                    db.create(callback);
                },
                function (callback) {
                    db.save('_design/main', require('../src/schema.js'), callback);
                }
            ], done);
        });

        it('prevents from creating invalid log entry', function (done) {
            db.save({invalid: 'log entry'}, function (err, res) {
                assert.equal('forbidden', err.error);
                done();
            });
        });

        it('creates log entry', function (done) {
            db.save(
                _.extend(require('./validLogEntry.js'), {timestamp: '2013-10-10T03:50:00.299Z'}),
                function (err, res) {
                    assert(!err);
                    done();
                }
            );
        });

        it('uses update handler to set log timestamp', function (done) {
            writeLogEntry(
                require('./validLogEntry.js'),
                function (err, res) {
                    db.get(res.id, function (err, doc) {
                        assert(new Date(doc.timestamp).toString() !== 'Invalid Date',
                            'Invalid timestamp: ' + doc.timestamp);
                        done();
                    });
                }
            );
        });

        it('doesnt allow to update log records', function (done) {
            var firstWayToUpdateADocument = function (id, callback) {
                    db.get(id, function (err, doc) {
                        doc.message = 'Updated message';
                        db.save(id, doc, callback);
                    });
                },
                secondWayToUpdateADocument = function (id, callback) {
                    db.query(
                        {
                            method: 'PUT',
                            path: '_design/main/_update/entry/' + id,
                            body: require('./validLogEntry.js')
                        },
                        callback
                    );
                };

            writeLogEntry(
                require('./validLogEntry.js'),
                function (err, res) {

                    async.series([
                        function (callback) {
                            firstWayToUpdateADocument(res.id, function (err) {
                                assert.equal('forbidden', err.error);
                                callback();
                            });
                        },
                        function (callback) {
                            secondWayToUpdateADocument(res.id, function (err) {
                                assert.equal('render_error', err.error);
                                callback();
                            });
                        }
                    ], done);
                }
            );
        });

        it('lists log records as HTML', function (done) {
            async.series([
                    function (callback) {
                        writeLogEntry({message: 'First one', channel: 'test'}, callback);
                    },
                    function (callback) {
                        setTimeout(callback, 100);
                    },
                    function (callback) {
                        writeLogEntry({message: 'Second one', channel: 'test'}, callback);
                    }
                ],
                function () {
                    var body = '';

                    http.get(
                        "http://127.0.0.1:5984/tests-couchdb-logger-service/_design/main/_list/html/all",
                        function (res) {
                            res.on('data', function (chunk) {
                                body = body + chunk;
                            })
                            .on('end', function () {
                                assert(body.indexOf('<html>') === 0);
                                done();
                            });
                        }
                    );
                }
            );
        });
    });

}());