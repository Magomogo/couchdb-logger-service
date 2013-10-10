(function (undefined) {
    "use strict";

    var assert = require("assert"),
        validationFn = require('../src/schema.js').validate_doc_update;

    describe ('validation', function () {
        it('accepts valid log record', function () {
            validationFn(require('./validLogEntry.js'));
        });

        it('disallows documents without [message] key', function () {
            assert.throws(
                function () {
                    validationFn({});
                }
            );
        });

        it('disallows documents without [channel] key', function () {
            assert.throws(
                function () {
                    validationFn({message: 'some'});
                }
            );
        });
    });

}());