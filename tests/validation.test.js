(function (undefined) {
    "use strict";

    var _ = require("underscore"),
        assert = require("assert"),
        validationFn = require('../src/validate_doc_update.js');

    describe ('validation', function () {
        it('accepts valid log record', function () {
            validationFn(require('./validLogEntry.js'));
        });

        it('disallows documents without [message] key', function () {
            var record = _.omit(require('./validLogEntry.js'), 'message');

            assert.throws(
                function () {
                    validationFn(record);
                }
            );
        });

        it('disallows documents without [channel] key', function () {
            var record = _.omit(require('./validLogEntry.js'), 'channel');

            assert.throws(
                function () {
                    validationFn(record);
                }
            );
        });

        it('disallows documents without [timestamp] key', function () {
            var record = _.omit(require('./validLogEntry.js'), 'timestamp');

            assert.throws(
                function () {
                    validationFn(record);
                }
            );
        });
    });

}());