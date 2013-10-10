(function (undefined) {
    "use strict";

    var _ = require('underscore'),
        assert = require("assert");

    describe('Schema', function () {
        var schema = require('../src/schema.js');

        it('defines validation function', function () {
            assert(_.isFunction(schema.validate_doc_update));
        });
    });
}());