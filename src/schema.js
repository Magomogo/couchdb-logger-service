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
        validate_doc_update: function (newDoc, oldDoc, userCtx, secObj) {

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
        },
        updates: {
            entry: function (doc, req) {
                if (!doc) {
                    var newDoc = JSON.parse(req.body);
                    newDoc._id = req.uuid;
                    newDoc.timestamp = (new Date()).toJSON();

                    return [newDoc, JSON.stringify({
                        ok: true,
                        id: newDoc._id
                    })];
                }
                throw ({forbidden: 'Log records update is prohibited'});
            }
        },
        lists: {
            html: function(head, req) {
                start({
                    'headers': {
                        'Content-Type': 'text/html'
                    }
                });
                send('<html><body><table>');
                send('<tr><th>Time</th><th>Channel</th><th>Message</th></tr>');
                var row;
                while((row = getRow())){
                    send(''.concat(
                        '<tr>',
                        '<td>' + row.value.timestamp + '</td>',
                        '<td>' + row.value.channel + '</td>',
                        '<td><pre>' + JSON.stringify(row.value) + '</pre></td>',
                        '</tr>'
                    ));
                }
                send('</table></body></html>');
            }
        }
    };

}());