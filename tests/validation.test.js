(function (undefined) {
    "use strict";

    var _ = require("underscore"),
        assert = require("assert"),
        fixture = require("./fixture.js"),
        validationFn = require('../src/validate_doc_update.js');

    describe ('validation', function () {
        it('accepts valid log record', function () {
            validationFn(fixture.validLogEntry);
        });

        it('disallows documents without [message] key', function () {
            var record = _.omit(fixture.validLogEntry, 'message');

            assert.throws(
                function () {
                    validationFn(record);
                }
            );
        });

        it('disallows documents without [channel] key', function () {
            var record = _.omit(fixture.validLogEntry, 'channel');

            assert.throws(
                function () {
                    validationFn(record);
                }
            );
        });

        it('disallows documents without [timestamp] key', function () {
            var record = _.omit(fixture.validLogEntry, 'timestamp');

            assert.throws(
                function () {
                    validationFn(record);
                }
            );
        });
    });

}());