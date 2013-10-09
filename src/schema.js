(function (undefined) {
    "use strict";

    module.exports = {
        views: {},
        validate_doc_update: function (newDoc, oldDoc, userCtx, secObj) {
            throw ({forbidden: 'Log record should have "message" key'});
        }
    };

}());