(function (undefined) {
    "use strict";

    var cradle = require("cradle"),
        async = require("async"),
        config = require("../src/configuration.js");

    cradle.setup(config.couchdb);

    module.exports = {

        install: function (dbName, done) {
            var conn = new (cradle.Connection)(),
                db;

            this.db = db = conn.database(dbName);

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
                },
            ], done);
        },

        populate: function (done) {
            var fixture = this;

            async.series([
                function (callback) {
                    fixture.addLogEntry({message: 'First one', channel: 'test'}, callback);
                },
                function (callback) {
                    fixture.addLogEntry({message: 'Second one', channel: 'test'}, callback);
                },
                function (callback) {
                    fixture.addLogEntry({message: 'Third one', channel: 'test'}, callback);
                }
            ], done);
        },

        addLogEntry: function (entry, done) {
            this.db.query(
                {
                    method: 'POST',
                    path: '_design/main/_update/entry',
                    body: entry
                },
                done
            );
        },

        validLogEntry: {
            message: 'An event occured',
            channel: 'common',
            any: 'data'
        },

        db: undefined
    };
}());