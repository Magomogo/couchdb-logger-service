(function (window, $, m) {
    "use strict";

    var templates = {}, rowsPerPage = 20, currentPage = 0;

    function loadTemplates(done) {

        $.when(
            $.get('mustache/list.mustache', function (template) {
                templates.list = m.compile(template);
            }),
            $.get('mustache/record.mustache', function (template) {
                templates.record = m.compile(template);
            }),
            $.get('mustache/paginator.mustache', function (template) {
                m.compilePartial('paginator', template);
            }),
            $.get('mustache/page-nav.mustache', function (template) {
                m.compilePartial('nav', template);
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

    function drawPage(num) {
        $.getJSON('all/' + num * rowsPerPage + '/' + rowsPerPage, function (data) {
            data.pageNav = calculatePageNav(data);
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
                        }
                    }
                ));
            })
        }

    }

}(window, jQuery, Mustache));