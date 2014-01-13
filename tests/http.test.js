(function (undefined) {
    "use strict";

    var async = require("async"),
        assert = require("assert"),
        request = require('request'),
        fixture = require("./fixture.js");

    describe('HTTP access', function () {

        beforeEach(function (done) {
            fixture.install('tests-couchdb-logger-service', function (err) {
                try {
                    assert(!err);
                    fixture.populate(done);
                } catch (e) {
                    console.log(err);
                    done(e);
                }
            });
        });

        it('does rewriting to index page', function (done) {
            request(fixture.location() + '/_design/main/_rewrite/', function (err, response, body) {
                try {
                    assert(!err);
                    assert.strictEqual(0, body.indexOf('<!DOCTYPE html>'), body);
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

        it('provides limited list of events sorted by timestamp', function (done) {
            request(fixture.location() + '/_design/main/_rewrite/all/0/2', function (err, response, body) {
                try {
                    assert(!err);
                    assert.equal(2, JSON.parse(body).rows.length);
                    done();
                } catch (e) {
                    done(e);
                }
            });

        });

        it('provides list of first events sorted by timestamp', function (done) {
            request(fixture.location() + '/_design/main/_rewrite/all', function (err, response, body) {

                try {
                    assert(!err);
                    assert.equal(3, JSON.parse(body).rows.length);
                    done();
                } catch (e) {
                    done(e);
                }

            });

        });

        it('provides list of first events of a channel', function (done) {

            async.series([
                function (callback) {
                    fixture.addLogEntry({message: 'New message', channel: 'http.test'}, callback);
                },
                function (callback) {
                    request(fixture.location() + '/_design/main/_rewrite/all/http.test', function (err, response, body) {

                        try {
                            assert(!err);
                            assert.equal(1, JSON.parse(body).rows.length);
                            callback();
                        } catch (e) {
                            callback(e);
                        }

                    });
                }
            ], done);

        });

        it('has an entry for registering new events', function (done) {

            request({
                    method: 'POST',
                    uri: fixture.location() + '/_design/main/_rewrite/new',
                    body: JSON.stringify(fixture.validLogEntry)
                },
                function (err, response, body) {
                    try {
                        assert(!err);
                        assert.strictEqual(true, JSON.parse(body).ok);
                        done();
                    } catch (e) {
                        done(e);
                    }
                }
            );

        });

        it('gives a document by its ID', function (done) {
            request(fixture.location() + '/_all_docs', function (err, response, body) {
                var docId = JSON.parse(body).rows.filter(
                        function (row) { return row.id[0] !== '_'; }
                    )[0].id;

                request(
                    fixture.location() + '/_design/main/_rewrite/record/' + docId,

                    function (err, response, body) {
                        try {
                            assert(!err);

                            assert.deepEqual(
                                ['_id', '_rev', 'message', 'channel', 'timestamp'],
                                Object.keys(JSON.parse(body)),
                                body
                            );

                            done();
                        }
                        catch (e) {
                            done(e);
                        }
                    }
                );
            });
        });
    });
}());
