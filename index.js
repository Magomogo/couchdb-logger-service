(function (window) {
    "use strict";

    var rowsPerPage = 20,
        $ = require("jquery-commonjs"),
        Router = require("director").Router,
        renderer = require("./src/renderer.js"),
        definePageNav = require('./src/definePageNav.js');

    function getTotalPagesPromise () {
        return $.Deferred(function (dfd) {
            $.getJSON('all/0/0', function (view) {
                dfd.resolve(definePageNav(view, rowsPerPage).totalPages);
            });
        }).promise();
    }

    function navigate(pageName, param) {
        var actions = {
            page: function (navParams) {

                $.getJSON('all/' + navParams.num * rowsPerPage + '/' + rowsPerPage, function (data) {
                    $('#view').html(renderer.renderList(data, navParams.num, navParams.highlightId));
                });

                return 'Page ' + (navParams.num + 1);
            },
            record: function (navParams) {

                $.ajax({
                    url: 'record/' + navParams.id,
                    type: "GET",
                    dataType: "json",
                    success: function (data) {
                        $('#view').html(renderer.renderRecord(data, navParams.currentPage));
                    },
                    error: function (xhr) {
                        $('#view').html('<h1>' + xhr.status + ' - ' + xhr.statusText + '</h1>');
                    }
                });

                return 'Record ' + navParams.id;
            }
        };

        window.document.title = actions[pageName](param);
    }

    window.logger = {

        init: function () {
            var router = new Router({
                '/list/:page': function (pageNum) {
                    navigate('page', {num: parseInt(pageNum, 10)});
                },
                '/list/:page/:highlightId': function (pageNum, highlightId) {
                    navigate('page', {num: parseInt(pageNum, 10), highlightId: highlightId});
                },
                '/record/:page/:id': function (pageNum, id) {
                    navigate('record', {id: id, currentPage: pageNum});
                }
            });

            $.when(
                getTotalPagesPromise(),
                renderer.loadTemplates()
            ).then(function (resp) {
                router.init('list/' + resp);
            });
        }
    };

}(window));

logger.init();