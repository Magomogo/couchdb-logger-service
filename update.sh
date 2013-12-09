#!/usr/bin/env node

(function (undefined) {
    'use strict';

    var cradle = require("cradle"),
        async = require("async"),
        config = require("./src/configuration.js"),
        app = require("./src/application.js"),
        conn = new (cradle.Connection)(),
        db = conn.database(config.dbname);

        async.series([
            function (callback) {
                db.get('_design/main', function (err, doc) {
                    if (err) {
                        db.create(callback);
                    } else {
                        db.remove('_design/main', doc._rev, callback);
                    }
                });
            },
            function (callback) {
                app.install(config.dbname, callback);
            }
        ]);

}());
