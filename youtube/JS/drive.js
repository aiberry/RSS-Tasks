import makeQueryURL from './src/queryURL';
import getViewNumber from './src/get-view-number';
import rollsOnPage from './src/rolls-on-page';
import drawImageTags from './src/draw-image-tags';
import getDataFromApi from './src/get-data-from-api';
import BodyFill from './src/body-render';

const l = console.log;
let NEXT_TOKEN = '';
let nowPage;
let bufer;
let leftest;
const pushToBufer = (data) => {
    // l(data)
    NEXT_TOKEN = data.nextPageToken;
    if (data.items.length !== 0) {
        data.items.forEach((item) => {
            const currentItem = {
                number: bufer.length + 1,
                header: item.snippet.title,
                link: `https://www.youtube.com/watch?v=${item.id.videoId}`,
                prevImg: item.snippet.thumbnails.high.url,
                author: item.snippet.channelTitle,
                published: new Date(item.snippet.publishedAt),
                id: item.id.videoId,
                descr: item.snippet.description,
            };
            bufer.push(currentItem);
            // console.log('Bufer added.')
            // l(currentItem)
        });
    }
};

const displayPage = (pageNum, numberOfItems, left) => {
    let firstItemOnPage;
    let lastItemOnPage;
    if (pageNum === undefined) {
        // l('case1');
        firstItemOnPage = left;
        lastItemOnPage = (left + numberOfItems) - 1;
    } else
    if (bufer[(pageNum - 1) * numberOfItems] === undefined) {
        firstItemOnPage = 0;
        // l('case2');
        lastItemOnPage = (firstItemOnPage + numberOfItems) - 1;
        document.getElementById('tooltip-animation').innerHTML = 'NOW IS 1\'th';
    } else {
        // l('case3');
        firstItemOnPage = (pageNum - 1) * numberOfItems;
        lastItemOnPage = (firstItemOnPage + numberOfItems) - 1;
        document.getElementById('tooltip-animation').innerHTML = `NOW IS ${pageNum}'th`;
    }
    // l('First image item number = ' + firstItemOnPage);
    // l('Last image item number = ' + lastItemOnPage);
    leftest = firstItemOnPage;

    if (pageNum === 1) {
        document.getElementById('no-results').setAttribute('hidden', true);
        document.getElementById('search-results').removeAttribute('hidden');
    }

    let col = 0;
    for (let i = firstItemOnPage; i <= lastItemOnPage; i += 1) {
        document.getElementById(`col-${col}`).style['background-image'] = `url("${bufer[i].prevImg}")`;
        // l("prevImg of i = " + i + 'is: ' + bufer[i].prevImg)
        let thisHeader = bufer[i].header.substring(0, 40);
        if (thisHeader.length < bufer[i].header) thisHeader += '...';
        thisHeader = `${bufer[i].number}. ${thisHeader}`;
        thisHeader = `<a href="${bufer[i].link}" class="link-to-YT">${thisHeader}</a>`;
        document.getElementById(`headerImg-${col}`).innerHTML = thisHeader;

        // drawing author
        let thisAuthor = bufer[i].author.substring(0, 18);
        if (thisAuthor !== bufer[i].author) thisAuthor += '...';
        document.getElementById(`pAuthor-${col}`).innerHTML = `<i class="fa fa-user-circle-o" aria-hidden="true"></i> ${thisAuthor}`;
        // drawing date of publication
        let thisDay = bufer[i].published.getDay();
        if (thisDay.length !== 2) thisDay = `0${thisDay}`;
        let thisMonth = bufer[i].published.getMonth();
        if (thisMonth.length !== 2) thisMonth = `0${thisMonth}`;
        document.getElementById(`pPublished-${col}`).innerHTML = `<i class="fa fa-download" aria-hidden="true"></i> ${thisDay} - ${thisMonth} - ${bufer[i].published.getFullYear()}`;
        // drawing views number
        getViewNumber(bufer[i].id, col);

        // drawing paragraf "about"
        let thisAbout = bufer[i].descr.substring(0, 100);
        if (thisAbout !== bufer[i].descr) thisAbout += '...';
        document.getElementById(`pAbout-${col}`).innerHTML = thisAbout;
        col += 1;
    }
};

const fillBuferIfNeed = (page, rolls, userEntry) => {
    if (bufer.length < (page + 5) * rolls) {
        l('Inisilized filling of the bufer');
        getDataFromApi(makeQueryURL(userEntry, NEXT_TOKEN), pushToBufer);
    }
};

const searchSubmit = () => {
    l('SSrun');
    document.getElementById('js-youtube-search-form').addEventListener('submit', (event) => {
        event.preventDefault();
        document.getElementById('spy-label').style['display'] = "none";
        bufer = [];
        l('SSsubm');
        let numberOfDisplayed = rollsOnPage();
        l('SSsubm2');
        const userEntry = document.querySelector('#search-entry').value;
        l('SSsubm3');
        drawImageTags(numberOfDisplayed);
        l('SSsubm4');
        nowPage = 1;
        l('SSsubm5');

        document.getElementById('navPages').innerHTML = '<ul class="pagination" id="pagination"><li id="btn-previous" class="disabled"><a href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li><li id="page-link-1" class="active"><a href="#">1</a></li><li id="page-link-2"><a href="#">2</a></li><li id="page-link-3"><a href="#">3</a></li><li id="page-link-4"><a href="#">4</a></li><li id="page-link-5"><a href="#">5</a></li><li  id="btn-next"><a href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li></ul>';
        getDataFromApi(makeQueryURL(userEntry, 'submit'), pushToBufer, displayPage, nowPage, rollsOnPage());
        fillBuferIfNeed(nowPage, rollsOnPage, userEntry);

        const nextHandler = () => {
            l('function nextHandler activated');
            // make btn-prev active
            document.getElementById('btn-previous').classList.remove('disabled');
            // change page markers and 'nowPage'
            if (nowPage < 3) {
                document.getElementById(`page-link-${nowPage}`).classList.remove('active');
                nowPage += 1;
                document.getElementById(`page-link-${nowPage}`).classList.add('active');
            } else {
                nowPage += 1;
                document.getElementById('page-link-1').innerHTML = `<a href="#">${nowPage - 2}</a>`;
                document.getElementById('page-link-2').innerHTML = `<a href="#">${nowPage - 1}</a>`;
                document.getElementById('page-link-3').innerHTML = `<a href="#">${nowPage}</a>`;
                document.getElementById('page-link-4').innerHTML = `<a href="#">${nowPage + 1}</a>`;
                document.getElementById('page-link-5').innerHTML = `<a href="#">${nowPage + 2}</a>`;
            }

            // displaying next page
            displayPage(nowPage, rollsOnPage());
            fillBuferIfNeed(nowPage, rollsOnPage(), userEntry);
        };

        const prevHandler = () => {
            if (nowPage <= 3) {
                nowPage -= 1;
                document.getElementById(`page-link-${nowPage}`).classList.add('active');
                document.getElementById(`page-link-${nowPage + 1}`).classList.remove('active');
            } else {
                nowPage -= 1;
                document.getElementById('page-link-1').innerHTML = `<a href="#">${nowPage - 2}</a>`;
                document.getElementById('page-link-2').innerHTML = `<a href="#">${nowPage - 1}</a>`;
                document.getElementById('page-link-3').innerHTML = `<a href="#">${nowPage}</a>`;
                document.getElementById('page-link-4').innerHTML = `<a href="#">${nowPage + 1}</a>`;
                document.getElementById('page-link-5').innerHTML = `<a href="#">${nowPage + 2}</a>`;
            }
            displayPage(nowPage, rollsOnPage());
            if (bufer[((nowPage - 1) * rollsOnPage()) - 1] === undefined) {
                document.getElementById('btn-previous').classList.add('disabled');
            }
        };

        // btn-next handler
        document.getElementById('btn-next').addEventListener('click', nextHandler);
        // btn-prev handler
        document.getElementById('btn-previous').addEventListener('click', prevHandler);

        const activeLinkIs = () => {
            let link;
            if (document.getElementById('page-link-1').classList.contains('active')) {
                link = 1;
            } else
            if (document.getElementById('page-link-2').classList.contains('active')) {
                link = 2;
            } else
            if (document.getElementById('page-link-3').classList.contains('active')) {
                link = 3;
            } else
            if (document.getElementById('page-link-4').classList.contains('active')) {
                link = 4;
            } else
            if (document.getElementById('page-link-5').classList.contains('active')) {
                link = 5;
            }
            return link;
        };
        let startX;
        let endX;
        // mousedown handler
        document.getElementById('row').addEventListener('mousedown', (evt) => {
            startX = evt.screenX;
            l(`sreenX on mousedown = ${startX}`);
        });
        // mouseup handler
        document.getElementById('row').addEventListener('mouseup', (evt) => {
            endX = evt.screenX;
            l(`screenX on mouseup = ${endX}`);
            if (endX > startX + 15 && nowPage !== 1) {
                l('Activated mouse-swipe prev handler');
                prevHandler();
            }
            if (endX < startX - 15) {
                l('Activated mouse-swipe next handler');
                nextHandler();
            }
        });
        // touchstart handler
        document.getElementById('row').addEventListener('touchstart', (evt) => {
            startX = evt.touches[0].screenX;
            l(`sreenX on touchstart = ${startX}`);
        });
        //  touchmove handler
        document.getElementById('row').addEventListener('touchmove', (evt) => {
            endX = evt.touches[0].screenX;
        });
        // touchend handler
        document.getElementById('row').addEventListener('touchend', () => {
            l(`sreenX on touchend = ${endX}`);
            if (endX > startX + 15 && nowPage !== 1) {
                l('Activated touch-swipe prev handler');
                prevHandler();
            }
            if (endX < startX - 15) {
                l('Activated touch-swipe next handler');
                nextHandler();
            }
        });
        // page-link-1 handler
        document.getElementById('page-link-1').addEventListener('click', () => {
            const active = activeLinkIs();
            if (active === 2) prevHandler();
            if (active === 3) { prevHandler(); prevHandler(); }
            if (active === 4) { prevHandler(); prevHandler(); prevHandler(); }
            if (active === 5) { prevHandler(); prevHandler(); prevHandler(); prevHandler(); }
        });
        // page-link-2 handler
        document.getElementById('page-link-2').addEventListener('click', () => {
            const active = activeLinkIs();
            if (active === 1) nextHandler();
            if (active === 3) prevHandler();
            if (active === 4) { prevHandler(); prevHandler(); }
            if (active === 5) { prevHandler(); prevHandler(); prevHandler(); }
        });
        // page-link-3 handler
        document.getElementById('page-link-3').addEventListener('click', () => {
            const active = activeLinkIs();
            if (active === 1) { nextHandler(); nextHandler(); }
            if (active === 2) nextHandler();
            if (active === 4) { prevHandler(); }
            if (active === 5) { prevHandler(); prevHandler(); }
        });
        // page-link-4 handler
        document.getElementById('page-link-4').addEventListener('click', () => {
            const active = activeLinkIs();
            if (active === 1) { nextHandler(); nextHandler(); nextHandler(); }
            if (active === 2) { nextHandler(); nextHandler(); }
            if (active === 3) { nextHandler(); }
            if (active === 5) { prevHandler(); }
        });
        // page-link-5 handler
        document.getElementById('page-link-5').addEventListener('click', () => {
            const active = activeLinkIs();
            if (active === 1) { nextHandler(); nextHandler(); nextHandler(); nextHandler(); }
            if (active === 2) { nextHandler(); nextHandler(); nextHandler(); }
            if (active === 3) { nextHandler(); nextHandler(); }
            if (active === 4) { nextHandler(); }
        });
        // tooltip showing
        document.getElementById('pagination').addEventListener('mouseenter', () => {
            setTimeout(() => {
                document.getElementById('tooltip-animation').classList.add('animated-tooltip');
            }, 200);
        });
        // tooltip hiding
        document.getElementById('pagination').addEventListener('mouseleave', () => {
            document.getElementById('tooltip-animation').classList.remove('animated-tooltip');
        });

        // window resize handler
        window.addEventListener('resize', () => {
            // l('Window resized');
            if (numberOfDisplayed !== rollsOnPage()) {
                // l('Activated resize handler');
                // l('Nuber of the leftest = ' + leftest);
                numberOfDisplayed = rollsOnPage();
                // l('\'numberOfDisplayed\' recalculated: ' + numberOfDisplayed);
                drawImageTags(numberOfDisplayed);
                // l('Tags redrawn');
                displayPage(undefined, numberOfDisplayed, leftest);
                // l('Displlaying finished.');
                // l('Started recalculating of nowPage.');
                nowPage = Math.floor(leftest / numberOfDisplayed) + 1;
                // l("nowPage recalculated: " + nowPage);
                if (nowPage <= 3) {
                    document.getElementById(`page-link-${activeLinkIs()}`).classList.remove('active');
                    document.getElementById(`page-link-${nowPage}`).classList.add('active');
                } else {
                    document.getElementById(`page-link-${activeLinkIs()}`).classList.remove('active');
                    document.getElementById('page-link-3').classList.add('active');
                    document.getElementById('page-link-1').innerHTML = `<a href="#">${nowPage - 2}</a>`;
                    document.getElementById('page-link-2').innerHTML = `<a href="#">${nowPage - 1}</a>`;
                    document.getElementById('page-link-3').innerHTML = `<a href="#">${nowPage}</a>`;
                    document.getElementById('page-link-4').innerHTML = `<a href="#">${nowPage + 1}</a>`;
                    document.getElementById('page-link-5').innerHTML = `<a href="#">${nowPage + 2}</a>`;
                }
            }
        });
    });
};


new BodyFill();

searchSubmit();

