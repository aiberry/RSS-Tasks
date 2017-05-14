import makeQueryURL from '../components/queryURL';
import getViewNumber from '../components/get-view-number';
import getDataFromApi from '../components/get-data-from-api';
import YTWorker from '../components/YT-simple-class';

let NEXT_TOKEN = '';
let nowPage;
let bufer = [];
let leftest;
let startX;
let endX;
let numberOfDisplayed;



const YT = new YTWorker();

document.getElementById('js-youtube-search-form').addEventListener('submit', (event) => {
    event.preventDefault();
    nowPage = 1;
    const userEntry = document.querySelector('#search-entry').value;

    const pushToBufer = (data) => {
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
            });
        }
    };
    const displayPage = (pageNum, numberOfItems, left) => {
        let firstItemOnPage;
        let lastItemOnPage;
        if (pageNum === undefined) {
            firstItemOnPage = left;
            lastItemOnPage = (left + numberOfItems) - 1;
        } else
        if (bufer[(pageNum - 1) * numberOfItems] === undefined) {
            firstItemOnPage = 0;
            lastItemOnPage = (firstItemOnPage + numberOfItems) - 1;
            document.getElementById('tooltip-animation').innerHTML = 'NOW IS 1\'th';
        } else {
            firstItemOnPage = (pageNum - 1) * numberOfItems;
            lastItemOnPage = (firstItemOnPage + numberOfItems) - 1;
            document.getElementById('tooltip-animation').innerHTML = `NOW IS ${pageNum}'th`;
        }
        leftest = firstItemOnPage;

        if (pageNum === 1) {
            document.getElementById('no-results').setAttribute('hidden', true);
            document.getElementById('search-results').removeAttribute('hidden');
        }

        let col = 0;
        for (let i = firstItemOnPage; i <= lastItemOnPage; i += 1) {
            document.getElementById(`col-${col}`).style['background-image'] = `url("${bufer[i].prevImg}")`;
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
    const fillBuferIfNeed = (page, rolls, userquery) => {
        if (bufer.length < (page + 5) * rolls) {
            getDataFromApi(makeQueryURL(userquery, NEXT_TOKEN), pushToBufer);
        }
    };
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
    const nextHandler = () => {
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
        displayPage(nowPage, YT.rollsOnPage());
        fillBuferIfNeed(nowPage, YT.rollsOnPage(), userEntry);
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
        displayPage(nowPage, YT.rollsOnPage());
        if (bufer[((nowPage - 1) * YT.rollsOnPage()) - 1] === undefined) {
            document.getElementById('btn-previous').classList.add('disabled');
        }
    };

    document.getElementById('spy-label').style.display = 'none';
    numberOfDisplayed = YT.rollsOnPage();
    YT.drawImageTags(numberOfDisplayed);
    document.getElementById('navPages').innerHTML =
        `<ul class="pagination" id="pagination">
            <li id="btn-previous" class="disabled">
                <a href="#" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>
            <li id="page-link-1" class="active">
                <a href="#">1</a></li><li id="page-link-2">
                <a href="#">2</a></li><li id="page-link-3">
                <a href="#">3</a></li><li id="page-link-4">
                <a href="#">4</a></li><li id="page-link-5">
                <a href="#">5</a></li><li  id="btn-next">
                <a href="#" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                </a>
            </li>
        </ul>`;
    getDataFromApi(makeQueryURL(userEntry, 'submit'), pushToBufer, displayPage, nowPage, YT.rollsOnPage());
    fillBuferIfNeed(nowPage, YT.rollsOnPage, userEntry);
    // btn-next handler
    document.getElementById('btn-next').addEventListener('click', nextHandler);
    // btn-prev handler
    document.getElementById('btn-previous').addEventListener('click', prevHandler);
    // mousedown handler
    document.getElementById('row').addEventListener('mousedown', (evt) => {
        startX = evt.screenX;
    });
    // mouseup handler
    document.getElementById('row').addEventListener('mouseup', (evt) => {
        endX = evt.screenX;
        if (endX > startX + 15 && nowPage !== 1) {
            prevHandler();
        }
        if (endX < startX - 15) {
            nextHandler();
        }
    });
    // touchstart handler
    document.getElementById('row').addEventListener('touchstart', (evt) => {
        startX = evt.touches[0].screenX;
    });
    // touchmove handler
    document.getElementById('row').addEventListener('touchmove', (evt) => { endX = evt.touches[0].screenX; });
    // touchend handler
    document.getElementById('row').addEventListener('touchend', () => {
        if (endX > startX + 70 && nowPage !== 1) {
            prevHandler();
        }
        if (endX < startX - 15) {
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
        document.getElementById('tooltip-animation').classList.add('animated-tooltip');
    });
    // tooltip hiding
    document.getElementById('pagination').addEventListener('mouseleave', () => {
        document.getElementById('tooltip-animation').classList.remove('animated-tooltip');
    });
    // window resize handler
    window.addEventListener('resize', () => {
        if (numberOfDisplayed !== YT.rollsOnPage()) {
            numberOfDisplayed = YT.rollsOnPage();
            YT.drawImageTags(numberOfDisplayed);
            displayPage(undefined, numberOfDisplayed, leftest);
            nowPage = Math.floor(leftest / numberOfDisplayed) + 1;
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
