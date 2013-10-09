(function (undefined) {
    "use strict";

    var assert = require("referee").assert,
        sinon = require("sinon"),
        cradle = require("cradle");

    describe('Mocha', function () {
        it('asserts works', function () {
            assert.isTrue(true);
        });
        it('spyes works', function () {
            var callable = sinon.spy();

            callable();
            callable();

            assert(callable.calledTwice);
        });
    });

    describe('CouchDb', function() {
        it('is available', function () {
            var c = new(cradle.Connection)();
            c.database('_users').get('', function (err, doc) {
                assert.same('_users', doc.db_name);
                assert.isNull(err);
            });
        });
    });
}());