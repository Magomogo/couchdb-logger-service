(function (window) {
    "use strict";

    var rowsPerPage = 20,
        currentPage = 0,
        $ = require("jquery-commonjs"),
        Router = require("director").Router,
        renderer = require("./src/renderer.js");

    function navigate(pageName, param) {
        var actions = {
            page: function (num) {
                currentPage = num;

                $.getJSON('all/' + num * rowsPerPage + '/' + rowsPerPage, function (data) {
                    $('#view').html(renderer.renderList(data));
                });

                return 'Page ' + (num + 1);
            },
            record: function (id) {

                $.ajax({
                    url: 'record/' + id,
                    type: "GET",
                    dataType: "json",
                    success: function (data) {
                        $('#view').html(renderer.renderRecord(data, currentPage));
                    },
                    error: function (xhr) {
                        $('#view').html('<h1>' + xhr.status + ' - ' + xhr.statusText + '</h1>');
                    }
                });

                return 'Record ' + id;
            }
        };

        window.document.title = actions[pageName](param);
    }

    window.logger = {

        init: function () {
            var router = new Router({
                '/list/:page': function (pageNum) {
                    navigate('page', parseInt(pageNum, 10));
                },
                '/record/:id': function (id) {
                    navigate('record', id);
                }
            });

            renderer.loadTemplates(function () {
                router.init('list/0');
            });
        }
    };

}(window));

logger.init();