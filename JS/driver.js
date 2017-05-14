/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var _queryURL = __webpack_require__(1);
	
	var _queryURL2 = _interopRequireDefault(_queryURL);
	
	var _getViewNumber = __webpack_require__(3);
	
	var _getViewNumber2 = _interopRequireDefault(_getViewNumber);
	
	var _getDataFromApi = __webpack_require__(4);
	
	var _getDataFromApi2 = _interopRequireDefault(_getDataFromApi);
	
	var _YTSimpleClass = __webpack_require__(5);
	
	var _YTSimpleClass2 = _interopRequireDefault(_YTSimpleClass);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var NEXT_TOKEN = '';
	var nowPage = void 0;
	var bufer = [];
	var leftest = void 0;
	var startX = void 0;
	var endX = void 0;
	var numberOfDisplayed = void 0;
	
	var YT = new _YTSimpleClass2.default();
	
	document.getElementById('js-youtube-search-form').addEventListener('submit', function (event) {
	    event.preventDefault();
	    nowPage = 1;
	    var userEntry = document.querySelector('#search-entry').value;
	
	    var pushToBufer = function pushToBufer(data) {
	        NEXT_TOKEN = data.nextPageToken;
	        if (data.items.length !== 0) {
	            data.items.forEach(function (item) {
	                var currentItem = {
	                    number: bufer.length + 1,
	                    header: item.snippet.title,
	                    link: 'https://www.youtube.com/watch?v=' + item.id.videoId,
	                    prevImg: item.snippet.thumbnails.high.url,
	                    author: item.snippet.channelTitle,
	                    published: new Date(item.snippet.publishedAt),
	                    id: item.id.videoId,
	                    descr: item.snippet.description
	                };
	                bufer.push(currentItem);
	            });
	        }
	    };
	    var displayPage = function displayPage(pageNum, numberOfItems, left) {
	        var firstItemOnPage = void 0;
	        var lastItemOnPage = void 0;
	        if (pageNum === undefined) {
	            firstItemOnPage = left;
	            lastItemOnPage = left + numberOfItems - 1;
	        } else if (bufer[(pageNum - 1) * numberOfItems] === undefined) {
	            firstItemOnPage = 0;
	            lastItemOnPage = firstItemOnPage + numberOfItems - 1;
	            document.getElementById('tooltip-animation').innerHTML = 'NOW IS 1\'th';
	        } else {
	            firstItemOnPage = (pageNum - 1) * numberOfItems;
	            lastItemOnPage = firstItemOnPage + numberOfItems - 1;
	            document.getElementById('tooltip-animation').innerHTML = 'NOW IS ' + pageNum + '\'th';
	        }
	        leftest = firstItemOnPage;
	
	        if (pageNum === 1) {
	            document.getElementById('no-results').setAttribute('hidden', true);
	            document.getElementById('search-results').removeAttribute('hidden');
	        }
	
	        var col = 0;
	        for (var i = firstItemOnPage; i <= lastItemOnPage; i += 1) {
	            document.getElementById('col-' + col).style['background-image'] = 'url("' + bufer[i].prevImg + '")';
	            var thisHeader = bufer[i].header.substring(0, 40);
	            if (thisHeader.length < bufer[i].header) thisHeader += '...';
	            thisHeader = bufer[i].number + '. ' + thisHeader;
	            thisHeader = '<a href="' + bufer[i].link + '" class="link-to-YT">' + thisHeader + '</a>';
	            document.getElementById('headerImg-' + col).innerHTML = thisHeader;
	
	            // drawing author
	            var thisAuthor = bufer[i].author.substring(0, 18);
	            if (thisAuthor !== bufer[i].author) thisAuthor += '...';
	            document.getElementById('pAuthor-' + col).innerHTML = '<i class="fa fa-user-circle-o" aria-hidden="true"></i> ' + thisAuthor;
	            // drawing date of publication
	            var thisDay = bufer[i].published.getDay();
	            if (thisDay.length !== 2) thisDay = '0' + thisDay;
	            var thisMonth = bufer[i].published.getMonth();
	            if (thisMonth.length !== 2) thisMonth = '0' + thisMonth;
	            document.getElementById('pPublished-' + col).innerHTML = '<i class="fa fa-download" aria-hidden="true"></i> ' + thisDay + ' - ' + thisMonth + ' - ' + bufer[i].published.getFullYear();
	            // drawing views number
	            (0, _getViewNumber2.default)(bufer[i].id, col);
	
	            // drawing paragraf "about"
	            var thisAbout = bufer[i].descr.substring(0, 100);
	            if (thisAbout !== bufer[i].descr) thisAbout += '...';
	            document.getElementById('pAbout-' + col).innerHTML = thisAbout;
	            col += 1;
	        }
	    };
	    var fillBuferIfNeed = function fillBuferIfNeed(page, rolls, userquery) {
	        if (bufer.length < (page + 5) * rolls) {
	            (0, _getDataFromApi2.default)((0, _queryURL2.default)(userquery, NEXT_TOKEN), pushToBufer);
	        }
	    };
	    var activeLinkIs = function activeLinkIs() {
	        var link = void 0;
	        if (document.getElementById('page-link-1').classList.contains('active')) {
	            link = 1;
	        } else if (document.getElementById('page-link-2').classList.contains('active')) {
	            link = 2;
	        } else if (document.getElementById('page-link-3').classList.contains('active')) {
	            link = 3;
	        } else if (document.getElementById('page-link-4').classList.contains('active')) {
	            link = 4;
	        } else if (document.getElementById('page-link-5').classList.contains('active')) {
	            link = 5;
	        }
	        return link;
	    };
	    var nextHandler = function nextHandler() {
	        // make btn-prev active
	        document.getElementById('btn-previous').classList.remove('disabled');
	        // change page markers and 'nowPage'
	        if (nowPage < 3) {
	            document.getElementById('page-link-' + nowPage).classList.remove('active');
	            nowPage += 1;
	            document.getElementById('page-link-' + nowPage).classList.add('active');
	        } else {
	            nowPage += 1;
	            document.getElementById('page-link-1').innerHTML = '<a href="#">' + (nowPage - 2) + '</a>';
	            document.getElementById('page-link-2').innerHTML = '<a href="#">' + (nowPage - 1) + '</a>';
	            document.getElementById('page-link-3').innerHTML = '<a href="#">' + nowPage + '</a>';
	            document.getElementById('page-link-4').innerHTML = '<a href="#">' + (nowPage + 1) + '</a>';
	            document.getElementById('page-link-5').innerHTML = '<a href="#">' + (nowPage + 2) + '</a>';
	        }
	        // displaying next page
	        displayPage(nowPage, YT.rollsOnPage());
	        fillBuferIfNeed(nowPage, YT.rollsOnPage(), userEntry);
	    };
	    var prevHandler = function prevHandler() {
	        if (nowPage <= 3) {
	            nowPage -= 1;
	            document.getElementById('page-link-' + nowPage).classList.add('active');
	            document.getElementById('page-link-' + (nowPage + 1)).classList.remove('active');
	        } else {
	            nowPage -= 1;
	            document.getElementById('page-link-1').innerHTML = '<a href="#">' + (nowPage - 2) + '</a>';
	            document.getElementById('page-link-2').innerHTML = '<a href="#">' + (nowPage - 1) + '</a>';
	            document.getElementById('page-link-3').innerHTML = '<a href="#">' + nowPage + '</a>';
	            document.getElementById('page-link-4').innerHTML = '<a href="#">' + (nowPage + 1) + '</a>';
	            document.getElementById('page-link-5').innerHTML = '<a href="#">' + (nowPage + 2) + '</a>';
	        }
	        displayPage(nowPage, YT.rollsOnPage());
	        if (bufer[(nowPage - 1) * YT.rollsOnPage() - 1] === undefined) {
	            document.getElementById('btn-previous').classList.add('disabled');
	        }
	    };
	
	    document.getElementById('spy-label').style.display = 'none';
	    numberOfDisplayed = YT.rollsOnPage();
	    YT.drawImageTags(numberOfDisplayed);
	    document.getElementById('navPages').innerHTML = '<ul class="pagination" id="pagination">\n            <li id="btn-previous" class="disabled">\n                <a href="#" aria-label="Previous">\n                    <span aria-hidden="true">&laquo;</span>\n                </a>\n            </li>\n            <li id="page-link-1" class="active">\n                <a href="#">1</a></li><li id="page-link-2">\n                <a href="#">2</a></li><li id="page-link-3">\n                <a href="#">3</a></li><li id="page-link-4">\n                <a href="#">4</a></li><li id="page-link-5">\n                <a href="#">5</a></li><li  id="btn-next">\n                <a href="#" aria-label="Next">\n                    <span aria-hidden="true">&raquo;</span>\n                </a>\n            </li>\n        </ul>';
	    (0, _getDataFromApi2.default)((0, _queryURL2.default)(userEntry, 'submit'), pushToBufer, displayPage, nowPage, YT.rollsOnPage());
	    fillBuferIfNeed(nowPage, YT.rollsOnPage, userEntry);
	    // btn-next handler
	    document.getElementById('btn-next').addEventListener('click', nextHandler);
	    // btn-prev handler
	    document.getElementById('btn-previous').addEventListener('click', prevHandler);
	    // mousedown handler
	    document.getElementById('row').addEventListener('mousedown', function (evt) {
	        startX = evt.screenX;
	    });
	    // mouseup handler
	    document.getElementById('row').addEventListener('mouseup', function (evt) {
	        endX = evt.screenX;
	        if (endX > startX + 15 && nowPage !== 1) {
	            prevHandler();
	        }
	        if (endX < startX - 15) {
	            nextHandler();
	        }
	    });
	    // touchstart handler
	    document.getElementById('row').addEventListener('touchstart', function (evt) {
	        startX = evt.touches[0].screenX;
	    });
	    // touchmove handler
	    document.getElementById('row').addEventListener('touchmove', function (evt) {
	        endX = evt.touches[0].screenX;
	    });
	    // touchend handler
	    document.getElementById('row').addEventListener('touchend', function () {
	        if (endX > startX + 70 && nowPage !== 1) {
	            prevHandler();
	        }
	        if (endX < startX - 15) {
	            nextHandler();
	        }
	    });
	    // page-link-1 handler
	    document.getElementById('page-link-1').addEventListener('click', function () {
	        var active = activeLinkIs();
	        if (active === 2) prevHandler();
	        if (active === 3) {
	            prevHandler();prevHandler();
	        }
	        if (active === 4) {
	            prevHandler();prevHandler();prevHandler();
	        }
	        if (active === 5) {
	            prevHandler();prevHandler();prevHandler();prevHandler();
	        }
	    });
	    // page-link-2 handler
	    document.getElementById('page-link-2').addEventListener('click', function () {
	        var active = activeLinkIs();
	        if (active === 1) nextHandler();
	        if (active === 3) prevHandler();
	        if (active === 4) {
	            prevHandler();prevHandler();
	        }
	        if (active === 5) {
	            prevHandler();prevHandler();prevHandler();
	        }
	    });
	    // page-link-3 handler
	    document.getElementById('page-link-3').addEventListener('click', function () {
	        var active = activeLinkIs();
	        if (active === 1) {
	            nextHandler();nextHandler();
	        }
	        if (active === 2) nextHandler();
	        if (active === 4) {
	            prevHandler();
	        }
	        if (active === 5) {
	            prevHandler();prevHandler();
	        }
	    });
	    // page-link-4 handler
	    document.getElementById('page-link-4').addEventListener('click', function () {
	        var active = activeLinkIs();
	        if (active === 1) {
	            nextHandler();nextHandler();nextHandler();
	        }
	        if (active === 2) {
	            nextHandler();nextHandler();
	        }
	        if (active === 3) {
	            nextHandler();
	        }
	        if (active === 5) {
	            prevHandler();
	        }
	    });
	    // page-link-5 handler
	    document.getElementById('page-link-5').addEventListener('click', function () {
	        var active = activeLinkIs();
	        if (active === 1) {
	            nextHandler();nextHandler();nextHandler();nextHandler();
	        }
	        if (active === 2) {
	            nextHandler();nextHandler();nextHandler();
	        }
	        if (active === 3) {
	            nextHandler();nextHandler();
	        }
	        if (active === 4) {
	            nextHandler();
	        }
	    });
	    // tooltip showing
	    document.getElementById('pagination').addEventListener('mouseenter', function () {
	        document.getElementById('tooltip-animation').classList.add('animated-tooltip');
	    });
	    // tooltip hiding
	    document.getElementById('pagination').addEventListener('mouseleave', function () {
	        document.getElementById('tooltip-animation').classList.remove('animated-tooltip');
	    });
	    // window resize handler
	    window.addEventListener('resize', function () {
	        if (numberOfDisplayed !== YT.rollsOnPage()) {
	            numberOfDisplayed = YT.rollsOnPage();
	            YT.drawImageTags(numberOfDisplayed);
	            displayPage(undefined, numberOfDisplayed, leftest);
	            nowPage = Math.floor(leftest / numberOfDisplayed) + 1;
	            if (nowPage <= 3) {
	                document.getElementById('page-link-' + activeLinkIs()).classList.remove('active');
	                document.getElementById('page-link-' + nowPage).classList.add('active');
	            } else {
	                document.getElementById('page-link-' + activeLinkIs()).classList.remove('active');
	                document.getElementById('page-link-3').classList.add('active');
	                document.getElementById('page-link-1').innerHTML = '<a href="#">' + (nowPage - 2) + '</a>';
	                document.getElementById('page-link-2').innerHTML = '<a href="#">' + (nowPage - 1) + '</a>';
	                document.getElementById('page-link-3').innerHTML = '<a href="#">' + nowPage + '</a>';
	                document.getElementById('page-link-4').innerHTML = '<a href="#">' + (nowPage + 1) + '</a>';
	                document.getElementById('page-link-5').innerHTML = '<a href="#">' + (nowPage + 2) + '</a>';
	            }
	        }
	    });
	});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _YT_parametres = __webpack_require__(2);
	
	exports.default = function (searchTerm, task) {
	    var url = _YT_parametres.YT_SEARCH_URL + '?part=snippet&key=' + _YT_parametres.YT_API_KEY[1] + '&q=' + searchTerm + '&maxResults=15&type=video';
	    if (task) url += '&pageToken=' + task;
	    return url;
	};

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var key = {
	    1: 'AIzaSyAOlN6_KVX0PqPLsaA6raMgHhyA8DeX5Hw',
	    2: 'AIzaSyDFNcossL1cLuUP5CvkLoLhHGKQ5kafuSA'
	};
	
	var YT_API_KEY = exports.YT_API_KEY = key;
	var YT_VIEW_URL = exports.YT_VIEW_URL = 'https://www.googleapis.com/youtube/v3/videos/';
	var YT_SEARCH_URL = exports.YT_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search/';

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _YT_parametres = __webpack_require__(2);
	
	exports.default = function (id, call) {
	    var req2 = new XMLHttpRequest();
	    req2.open('GET', _YT_parametres.YT_VIEW_URL + '?part=statistics&key=' + _YT_parametres.YT_API_KEY[2] + '&id=' + id);
	    req2.onreadystatechange = function () {
	        if (req2.readyState === 4) {
	            document.getElementById('pViews-' + call).innerHTML = '<i class="fa fa-eye" aria-hidden="true"></i>  ' + JSON.parse(req2.responseText).items[0].statistics.viewCount;
	        }
	    };
	    req2.send(null);
	};

/***/ }),
/* 4 */
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	exports.default = function (query, callPush, callDisplay, whatPage, numberOfImg) {
	    var req = new XMLHttpRequest();
	    req.open('GET', query);
	    req.onreadystatechange = function () {
	        if (req.readyState === 4) {
	            callPush(JSON.parse(req.responseText));
	            if (callDisplay !== undefined) {
	                callDisplay(whatPage, numberOfImg);
	            }
	        }
	    };
	    req.send(null);
	};

/***/ }),
/* 5 */
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var _class = function () {
	    function _class() {
	        _classCallCheck(this, _class);
	
	        document.querySelector('body').innerHTML = '<div class="container-1">\n                <h1 class="main-header">YouTube Spy</h1>\n                <section id="form-entry">\n                    <form id="js-youtube-search-form">\n                        <label class="entry-label" for="search-entry" id="spy-label" hidden><b>SPY MESSAGE....</b></label>\n                        <input type="text" name="search-entry" id="search-entry" class="search-input" placeholder="e.g., qwerty" required>\n                        <button type="submit" class="search-button">Search</button>\n                    </form>\n                </section>\n                <section id="search-results" class="search-results" hidden>\n                    <!--search-results-->\n                    <div class="row-1" id="row">\n                    </div>\n                    <div class="tooltip hidden-xs" id="tooltip-animation">\n                    </div>\n                    <!--pagination-->  \n                    <nav aria-label="Page navigation" id="navPages">\n                    </nav>\n                </section>\n                <section id="no-results" hidden>\n                    <p>Sorry, no results were found for your query.</p>\n                </section>\n            </div>';
	    }
	
	    _createClass(_class, [{
	        key: 'drawImageTags',
	        value: function drawImageTags(rolls) {
	            var inner = '';
	            for (var i = 0; i <= rolls - 1; i += 1) {
	                inner += '<div class="col col-' + i + ' result" id="col-' + i + '">\n                            <h2 id="headerImg-' + i + '" class=\'result-header\'></h2>\n                            <p id="pAbout-' + i + '" class=\'paragraf-about\'></p>\n                            <p id="pAuthor-' + i + '" class=\'paragraf-author\'></p>\n                            <p id="pPublished-' + i + '" class=\'paragraf-published\'></p>\n                            <p id="pViews-' + i + '" class=\'paragraf-views\'></p>\n                        </div>';
	            }
	            document.querySelector('#row').innerHTML = inner;
	        }
	    }, {
	        key: 'rollsOnPage',
	        value: function rollsOnPage() {
	            var width = document.querySelector('#form-entry').offsetWidth;
	            var imageWidth = 200;
	            return Math.floor(width / imageWidth);
	        }
	    }]);

	    return _class;
	}();

	exports.default = _class;

/***/ })
/******/ ]);
//# sourceMappingURL=driver.js.map