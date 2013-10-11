(function (undefined) {
    "use strict";

    module.exports = function (newDoc, oldDoc, userCtx, secObj) {

        if (oldDoc) {
            throw ({forbidden: 'Log records update is prohibited'});
        }

        function assertDefined(field, doc) {
            if (!doc[field]) {
                throw ({forbidden: 'Log record should have "' + field + '" key'});
            }
        }

        assertDefined('message', newDoc);
        assertDefined('channel', newDoc);
        assertDefined('timestamp', newDoc);
    };

}());