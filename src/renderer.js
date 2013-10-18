(function (undefined) {
    "use strict";

    var templates = {},
        rowsPerPage = 20,
        $ = require("jquery-commonjs"),
        mustache = require("mustache"),
        moment = require("moment"),
        definePageNav = require("./definePageNav.js");

    function pageNavigationHelper () {
        return function (content, render) {
            definePageNav(this, rowsPerPage);
            return render(content);
        };
    }

    function dateTimeHelper (format, includeFromNow) {
        return function () {
            return function (content, render) {
                var date = moment(render(content));
                return date.format(format) + (includeFromNow ? ', ' + date.fromNow() : '');
            };
        };
    }

    function printJsonAsHtmlHelper () {
        function printLevel(json) {
            var html = '', key;

            if (typeof json.reduce === 'function') {

                html += '[' + json.reduce(function (res, i) {
                    return (res ? res + ', ' : '') + (typeof i === 'object' ? printLevel(i) : mustache.escape(i));
                }, '') + ']';

            } else {

                html += '<ul>';

                for (key in json) {
                    if (json.hasOwnProperty(key)) {
                        html += '<li><b>' + mustache.escape(key) + ':</b>';
                        html += (typeof json[key] === 'object' ?
                            printLevel(json[key]) : ' ' + mustache.escape(json[key])) + '</li>';
                    }
                }
                html += '</ul>';

                if (html === '<ul></ul>') {
                    html = '{}';
                }
            }

            return html;
        }

        return function () {
            var html = '', key;
            for (key in this) {
                if (this.hasOwnProperty(key) &&
                    (['_id', '_rev', 'timestamp', 'message', 'channel'].indexOf(key) === -1)) {

                    html += '<div><b>' + mustache.escape(key) + ':</b>' +
                        (typeof this[key] === 'object' ? printLevel(this[key]) : ' ' + mustache.escape(this[key])) +
                        '</div>';
                }
            }
            return html;
        };
    }

    function registerHelpers (view) {
        view.h_dateTimeList = dateTimeHelper("D.MM.YYYY HH:mm", 'fromNow');
        view.h_dateTimeRecord = dateTimeHelper("D MMM YYYY HH:mm:ss.SSS");
        view.h_pageNav = pageNavigationHelper;
        view.h_prettyJson = printJsonAsHtmlHelper;

        return view;
    }

    module.exports = {

        loadTemplates: function (done) {

            $.when(
                $.get('mustache/list.mustache', function (template) {
                    templates.list = mustache.compile(template);
                }),
                $.get('mustache/record.mustache', function (template) {
                    templates.record = mustache.compile(template);
                }),
                $.get('mustache/paginator.mustache', function (template) {
                    mustache.compilePartial('paginator', template);
                }),
                $.get('mustache/page-nav.mustache', function (template) {
                    mustache.compilePartial('nav', template);
                })
            ).then(done);

        },

        renderList: function (view) {
            return templates.list(registerHelpers(view));
        },

        renderRecord: function (record, currentPage) {
            return templates.record(registerHelpers({currentPage: currentPage, record: record}));
        }

    };

}());