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
                db.destroy();
                callback();
            },
            function (callback) {
                db.create(callback);
            },
            function (callback) {
                app.install(config.dbname, callback);
            }
        ]);

}());
