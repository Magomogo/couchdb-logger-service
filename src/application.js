(function (undefined) {
    "use strict";

    var config = require("./configuration.js"),
        fs = require("fs"),
        _ = require("underscore"),
        request = require("request"),
        mime = require("mime"),
        contentRoot = fs.realpathSync(__dirname + '/../www');

    function contentId(dir, file) {
        return (fs.realpathSync(dir) + '/').replace(contentRoot + '/', '') + file;
    }

    function serializeFuncs(object) {
        var serialized = _.extend({}, object);

        for (var key in object) {
            if (object.hasOwnProperty(key) && !_.isArray(object[key])) {
                if (_.isFunction(object[key])) {
                    serialized[key] = object[key].toString();
                } else if (_.isObject(object[key])) {
                    serialized[key] = serializeFuncs(object[key]);
                }
            }
        }
        return serialized;
    }

    function readAttachments (dir, done) {

        fs.readdir(dir, function (err, files) {
            if (err) {
                done(err);
            } else {

                var attachments = {},
                    pending = files.length;

                files.forEach(function (file) {
                    fs.stat(dir + '/' + file, function(err, stat) {
                        if (!err && stat) {

                            if (stat.isDirectory()) {

                                readAttachments(dir + '/' + file, function (err, a) {
                                    attachments = _.extend(attachments, a);

                                    if (!--pending) {
                                        done(null, attachments);
                                    }
                                });

                            } else {

                                attachments[contentId(dir, file)] = {
                                    follows: true,
                                    content_type: mime.lookup(dir + '/' + file),
                                    length: stat.size
                                };

                                if (!--pending) {
                                    done(null, attachments);
                                }
                            }
                        }
                    });
                });
            }
        });
    }

    function writeSchema (dbName, schema, done) {
        var key,
            parts = [
                {
                    'content-type': 'application/json',
                    body: JSON.stringify(serializeFuncs(schema))
                }
            ];

        for (key in schema._attachments) {
            if (schema._attachments.hasOwnProperty(key)) {
                parts.push({ body: fs.readFileSync(contentRoot + '/' + key)});
            }
        }

        request(
            {
                method: 'PUT',
                uri: config.couchdbLocation() + '/' + dbName + '/_design/main',
                multipart: parts
            },
            done
        );

    }

    module.exports = {
        install: function (dbName, done) {
            var schema = require("./schema.js");

            readAttachments(contentRoot, function (err, attachments) {
                if (err) {
                    done(err);
                } else {
                    writeSchema(dbName, _.extend({}, schema, {_attachments: attachments}), done);
                }
            });
        }
    };

}());