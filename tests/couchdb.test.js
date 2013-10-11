(function (undefined) {
    "use strict";

    var _ = require('underscore'),
        http = require("http"),
        assert = require("assert"),
        cradle = require("cradle"),
        async = require("async"),
        fixture = require("./fixture.js");

    describe('Actual couchDb tests', function () {

        beforeEach(function (done) {
            fixture.install('tests-couchdb-logger-service', done);
        });

        it('prevents from creating invalid log entry', function (done) {
            fixture.db.save({invalid: 'log entry'}, function (err) {
                assert.equal('forbidden', err.error);
                done();
            });
        });

        it('creates log entry', function (done) {
            fixture.db.save(
                _.extend(fixture.validLogEntry, {timestamp: '2013-10-10T03:50:00.299Z'}),
                function (err, res) {
                    assert(!err);
                    done();
                }
            );
        });

        it('uses update handler to set log timestamp', function (done) {
            fixture.addLogEntry(
                fixture.validLogEntry,
                function (err, res) {
                    fixture.db.get(res.id, function (err, doc) {
                        assert(new Date(doc.timestamp).toString() !== 'Invalid Date',
                            'Invalid timestamp: ' + doc.timestamp);
                        done();
                    });
                }
            );
        });

        it('doesnt allow to update log records', function (done) {
            var firstWayToUpdateADocument = function (id, callback) {
                    fixture.db.get(id, function (err, doc) {
                        doc.message = 'Updated message';
                        fixture.db.save(id, doc, callback);
                    });
                },
                secondWayToUpdateADocument = function (id, callback) {
                    fixture.db.query(
                        {
                            method: 'PUT',
                            path: '_design/main/_update/entry/' + id,
                            body: fixture.validLogEntry
                        },
                        callback
                    );
                };

            fixture.addLogEntry(
                fixture.validLogEntry,
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
            fixture.populate(function () {
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
            });
        });
    });

}());