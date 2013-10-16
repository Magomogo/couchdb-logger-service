(function (window, $, m) {
    "use strict";

    var templates = {};

    function loadTemplates(done) {

        $.when(
            $.get('mustache/list.mustache', function (template) {
                templates.list = m.compile(template);
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
        return {
            isFirst: true,
            nav: [
                {title: "1", active: true},
                {title: "2", active: false},
                {title: "3", active: false},
                {title: "4", active: false},
                {title: "5", active: false}
            ],
            isLast: false
        }
    }

    window.logger = {

        init: function () {
            loadTemplates(function () {

                $.getJSON('all', function (data) {
                    data.pageNav = calculatePageNav(data);
                    $('#view').html(templates.list(data));
                })

            });
        }

    }

}(window, jQuery, Mustache));