(function (undefined) {
    "use strict";

    var assert = require("referee").assert,
        validationFn = require('../src/schema.js').validate_doc_update;

    describe ('validation', function () {
        it('disallows documents without [message] key', function () {
            assert.exception(
                function () {
                    validationFn({});
                }
            );
        });
    });

}());