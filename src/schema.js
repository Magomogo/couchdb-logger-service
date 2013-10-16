(function (undefined) {
    "use strict";

    module.exports = {
        views: {
            all: {
                map: function (doc) {
                    emit(doc.timestamp, doc);
                }
            },
            channel: {
                map: function (doc) {
                    emit([doc.channel, doc.timestamp], doc);
                }
            }
        },
        validate_doc_update: require('./validate_doc_update.js'),
        updates: {
            entry: function (doc, req) {
                if (!doc) {
                    var newDoc;

                    try {
                        newDoc = JSON.parse(req.body);
                    } catch (e) {
                        throw ('Invalid JSON given in body of request');
                    }

                    newDoc._id = req.uuid;
                    newDoc.timestamp = (new Date()).toJSON();

                    return [newDoc, JSON.stringify({
                        ok: true,
                        id: newDoc._id
                    })];
                }
                throw ('Log records update is prohibited');
            }
        },
        rewrites: require("./rewrites")
    };

}());