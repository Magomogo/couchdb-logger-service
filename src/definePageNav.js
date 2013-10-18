(function (undefined) {
    "use strict";

    module.exports = function (view, rowsPerPage) {
        var pageNum,
            nav = [],
            numLinksAroundActive = 2,
            i = function (v) {return parseInt(v, 10);},
            currPageNum = i(view.offset / rowsPerPage),
            totalPages = i(Math.max(0, view.total_rows - 1) / rowsPerPage),
            startPageNum = Math.max(
                0,
                Math.min(currPageNum - numLinksAroundActive, totalPages - numLinksAroundActive * 2)
            );

        for (pageNum = startPageNum;
             pageNum <= Math.min(totalPages, startPageNum + numLinksAroundActive * 2);
             pageNum++) {

            nav.push({
                title: pageNum + 1,
                num: pageNum,
                active: pageNum === currPageNum
            });
        }

        view.isFirst = view.offset < rowsPerPage;
        view.prev = currPageNum - 1;
        view.nav = nav;
        view.next = currPageNum + 1;
        view.isLast = currPageNum === totalPages;
        return view;
    }

}());