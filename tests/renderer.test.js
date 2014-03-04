(function (undefined) {
    'use strict';

    var sinon = require('sinon'),
        assert = require('chai').assert,
        renderer = require('../src/renderer.js'),
        fs = require("fs"),
        cheerio = require('cheerio');

    describe('renderer', function () {

        it('loads templates', function () {
            var jQuery = { get: sinon.spy(), when: function () {} };
            renderer.loadTemplates(jQuery);

            jQuery.get.calledWith('mustache/list.mustache');
            jQuery.get.calledWith('mustache/record.mustache');
            jQuery.get.calledWith('mustache/paginator.mustache');
            jQuery.get.calledWith('mustache/page-nav.mustache');

        });

        describe('rendered templates', function () {

            var view = function (data) {
                return {total_rows: 1000, offset: 0, rows: data};
            };

            beforeEach(function () {
                var jQuery = { get: sinon.stub(), when: function () {} };

                [
                    'mustache/list.mustache',
                    'mustache/record.mustache',
                    'mustache/paginator.mustache',
                    'mustache/page-nav.mustache'
                ].forEach(function (template) {
                    jQuery.get.withArgs(template)
                        .yields(fs.readFileSync(__dirname + '/../www/' + template).toString());
                });

                renderer.loadTemplates(jQuery);
            });

            it('renders list of records', function () {
                var $ = cheerio.load(renderer.renderList(view([{}, {}, {}]), 1));
                assert.equal(3, $('tbody > tr').length);
            });

            it('link to records has page number included', function () {
                var $ = cheerio.load(renderer.renderList(view([{}]), 123));
                assert.include($('tbody > tr').attr('onclick'), '#/record/123/');
            });

            it('a row can be highlighted', function () {
                var $ = cheerio.load(renderer.renderList(view([{id: 'some-hash-AS7'}]), 123, 'some-hash-AS7'));
                assert.include($('tbody > tr').attr('style'), 'background-color:');
            });
        });

    });

}());