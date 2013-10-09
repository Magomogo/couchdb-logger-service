(function (undefined) {
    "use strict";

    var assert = require("assert");

    describe('Schema', function () {
        var schema = require('../src/schema.js');

        it('defines validation function', function () {
            assert(schema.validate_doc_update);
        });
    });
}());