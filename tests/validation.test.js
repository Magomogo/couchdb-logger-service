(function (undefined) {
    "use strict";

    var assert = require("assert"),
        validationFn = require('../src/schema.js').validate_doc_update;

    describe ('validation', function () {
        it('disallows documents without [message] key', function () {
            assert.throws(
                function () {
                    validationFn({});
                }
            );
        });
    });

}());