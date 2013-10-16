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
        rewrites: [
            {
                "from": "",
                "to": "index.html",
                "method": "GET",
                "query": {}
            },
            {
                "from": "all",
                "to": "_view/all",
                "method": "GET",
                "query": {
                    skip: "0",
                    limit: "20",
                    descending: "true"
                }
            },
            {
                "from": "all/:channel",
                "to": "_view/channel/",
                "method": "GET",
                "query": {
                    skip: "0",
                    limit: "20",
                    startkey: [":channel",{}],
                    endkey: [":channel"],
                    descending: "true"
                }
            },
            {
                "from": "all/:skip/:limit",
                "to": "_view/all",
                "method": "GET",
                "query": {
                    descending: "true"
                }
            },
            {
                "from": "new",
                "to": "_update/entry",
                "method": "POST",
                "query": {}
            }
        ]
    };

}());