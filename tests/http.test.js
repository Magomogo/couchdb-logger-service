(function (undefined) {
    "use strict";

    var request = require('request'),
        fixture = require("./fixture.js");

    describe('HTTP access', function () {

        beforeEach(function (done) {
            fixture.install('tests-couchdb-logger-service', done);
        });

        it('does rewriting to index page', function (done) {

            request(fixture.location() + '/_design/main/_rewrite', function (err, response, body) {
/*

                console.log(err);
                console.log(body);
*/

                done();
            });

        });

    });

}());