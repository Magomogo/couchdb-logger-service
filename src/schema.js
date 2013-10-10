(function (undefined) {
    "use strict";

    module.exports = {
        views: {},
        validate_doc_update: function (newDoc, oldDoc, userCtx, secObj) {

            function assertDefined(field, doc) {
                if (!doc[field]) {
                    throw ({forbidden: 'Log record should have "' + field + '" key'});
                }
            }

            assertDefined('message', newDoc);
            assertDefined('channel', newDoc);
            assertDefined('timestamp', newDoc);
        }
    };

}());