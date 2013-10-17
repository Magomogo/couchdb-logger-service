(function (window) {
    "use strict";

    var rowsPerPage = 20,
        currentPage = 0,
        $ = require("jquery-commonjs"),
        history = require("html5-history"),
        renderer = require("./src/renderer.js");

    history.Adapter.bind(window, 'statechange', function () {
        var state = history.getState();

        if (state.data.page) {
            navigate(state.data.page, state.data.param, 'do not store history change');
        }
    });

    function navigate(pageName, param, doNotStoreHistoryChange) {
        var actions = {
            page: function (num) {
                currentPage = num;

                $.getJSON('all/' + num * rowsPerPage + '/' + rowsPerPage, function (data) {
                    $('#view').html(renderer.renderList(data));
                });

                return 'Page ' + (num + 1);
            },
            record: function (id) {

                $.getJSON('record/' + id, function (data) {
                    $('#view').html(renderer.renderRecord(data, currentPage));
                });

                return 'Record ' + id;
            }
        }, pageTitle;

        pageTitle = actions[pageName](param);

        if (!doNotStoreHistoryChange) {
            history.pushState({page: pageName, param: param}, pageTitle, '');
        }

    }

    window.logger = {

        init: function () {
            renderer.loadTemplates(function () {
                navigate('page', 0, 'do not store history change');
                history.replaceState({page: 'page', param: 0}, 'Page 1', '');
            });
        },

        navigate: navigate
    };

}(window));

logger.init();