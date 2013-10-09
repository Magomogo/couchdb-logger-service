(function (undefined) {
    "use strict";

    var assert = require("referee").assert,
        sinon = require("sinon");

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
}());