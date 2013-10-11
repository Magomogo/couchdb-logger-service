(function (undefined) {
    "use strict";

    // allow self-signed certificates
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    var _ = require("underscore"),
        fs = require("fs");

    var config = JSON.parse(fs.readFileSync(__dirname + '/../config.dist.json'));

    if (fs.existsSync(__dirname + '/../config.json')) {
        _.extend(config, JSON.parse(fs.readFileSync(__dirname + '/../config.json')));
    }

    module.exports = config;

}());