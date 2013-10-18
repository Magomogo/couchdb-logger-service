(function (undefined) {
    "use strict";

    var assert = require ("assert"),
        fn = require("./../src/definePageNav.js");

    describe('Page navigation calculator', function () {

        describe('edge conditions', function () {

            it('shows disabled link to first page when data is empty', function () {
                var view = fn({"total_rows":0,"offset":0}, 10);
                assert(view.isFirst);
                assert(view.isLast);
                assert.equal(1, view.nav.length);
            });

            it('shows disabled link to first page when data length is same as rows per page amount', function () {
                var view = fn({"total_rows":10,"offset":0}, 10);
                assert(view.isFirst);
                assert(view.isLast);
                assert.equal(1, view.nav.length);
            });

            it('shows link to second page when data length is one bigger than rows per page amount', function () {
                var view = fn({"total_rows":11,"offset":0}, 10);
                assert(view.isFirst);
                assert(!view.isLast);
                assert.equal(2, view.nav.length);
            });

            it('second link is active when offset equals rows per page amount', function () {
                var view = fn({"total_rows":11,"offset":10}, 10);
                assert(!view.isFirst);
                assert(view.isLast);
                assert.equal(2, view.nav.length);
                assert(view.nav[1].active);
            });

        });

        describe('usability', function () {
            it('shows 5 page links for long data', function () {
                var view = fn({"total_rows":30333,"offset":0}, 10);
                assert.equal(5, view.nav.length);
            });

            it('shows first and second pages even current page is third', function () {
                var view = fn({"total_rows":30333,"offset":20}, 10);
                assert.equal(1, view.nav[0].title);
                assert.equal(2, view.nav[1].title);
                assert.equal(3, view.nav[2].title);
                assert(view.nav[2].active);

            });

            it('moves to second page starting from fourth page', function () {
                var view = fn({"total_rows":30333,"offset":30}, 10);
                assert.equal(2, view.nav[0].title);
                assert.equal(3, view.nav[1].title);
                assert.equal(4, view.nav[2].title);
                assert(view.nav[2].active);

            });

            it('wont shorten pages list at the last pages', function () {
                var view = fn({"total_rows":200,"offset":190}, 10);
                assert.equal(5, view.nav.length);
                assert(view.isLast);
            });
        });
    });

}());