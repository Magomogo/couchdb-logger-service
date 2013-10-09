(function (undefined) {
    "use strict";

    var assert = require("referee").assert;

    describe('Schema', function () {
        var schema = require('../src/schema.js');

        it('defines validation function', function () {
            assert.defined(schema.validate_doc_update);
        });
    });
}());