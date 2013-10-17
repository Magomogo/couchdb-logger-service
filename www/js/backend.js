(function (window, $, mustache, moment) {
    "use strict";

    var templates = {}, rowsPerPage = 20, currentPage = 0;

    function loadTemplates(done) {

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

    }

    function calculatePageNav(data) {

        var pageNum, nav = [], navLinksLimit = 5;

        for (pageNum = Math.max(0, parseInt(data.offset / rowsPerPage) - 2);
             pageNum < parseInt(data.total_rows / rowsPerPage) && navLinksLimit--;
             pageNum++) {

            nav.push({title: pageNum + 1, num: pageNum, active: pageNum === parseInt(data.offset / rowsPerPage)});
        }

        return {
            isFirst: data.offset < rowsPerPage,
            prev: parseInt(data.offset / rowsPerPage) - 1,
            nav: nav,
            next: parseInt(data.offset / rowsPerPage) + 1,
            isLast: data.offset >= data.total_rows - rowsPerPage
        }
    }

    function dateTimeHelper(format, includeFromNow) {
        return function () {
            return function (content, render) {
                var date = moment(render(content));
                return date.format(format) + (includeFromNow ? ', ' + date.fromNow() : '');
            }
        }
    }

    function drawPage(num) {
        $.getJSON('all/' + num * rowsPerPage + '/' + rowsPerPage, function (data) {
            data.pageNav = calculatePageNav(data);
            data.datetime = dateTimeHelper("D.MM.YYYY HH:mm", 'fromNow');
            $('#view').html(templates.list(data));
        })
    }

    function printJsonAsHtml(json) {
        var html = '<dl>', key;
        for (key in json) {
            if (json.hasOwnProperty(key) && (['_id', '_rev', 'timestamp', 'message', 'channel'].indexOf(key) === -1)) {
                if (typeof json[key] == 'object') {
                    html += printJsonAsHtml(json[key]);
                } else {
                    html += '<dt>' + key + '</dt>'
                    html += '<dd>' + json[key] + '</dd>'
                }
            }
        }
        return html + '</dl>';
    }

    window.logger = {

        init: function () {
            loadTemplates(function () {
                drawPage(0);
            });
        },

        navigateToPage: function (num) {
            currentPage = num;
            drawPage(num);
        },

        showDocument: function (id) {
            $.getJSON('record/' + id, function (data) {

                $('#view').html(templates.record(
                    {
                        currentPage: currentPage,
                        record: data,
                        prettyPrint: function () {
                            return printJsonAsHtml(this);
                        },
                        datetime: dateTimeHelper("D MMM YYYY HH:mm:ss.SSS")
                    }
                ));
            })
        }

    }

}(window, jQuery, Mustache, moment));