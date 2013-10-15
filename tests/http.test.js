(function (undefined) {
    "use strict";

    var assert = require("assert"),
        request = require('request'),
        fixture = require("./fixture.js");

    describe('HTTP access', function () {

        beforeEach(function (done) {
            fixture.install('tests-couchdb-logger-service', done);
        });

        it('does rewriting to index page', function (done) {

            request(fixture.location() + '/_design/main/_rewrite', function (err, response, body) {
                assert(body === 'Hello, world!');
                done();
            });

        });

    });

}());