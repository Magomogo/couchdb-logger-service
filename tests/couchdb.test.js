(function (undefined) {
    "use strict";

    var assert = require("assert"),
        cradle = require("cradle"),
        async = require("async"),
        conn = new (cradle.Connection)();

    describe('Actual couchDb tests', function () {

        var db;

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
            db.save(require('./validLogEntry.js'), function (err, res) {
                assert(!err);
                done();
            });
        });
    });

}());