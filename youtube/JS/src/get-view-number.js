import { YT_VIEW_URL, YT_API_KEY } from './YT_parametres';

export default (id, call) => {
    // l('getViewNumber runed');
    const req2 = new XMLHttpRequest();
    req2.open('GET', `${YT_VIEW_URL}?part=statistics&key=${YT_API_KEY[2]}&id=${id}`);
    req2.onreadystatechange = () => {
        if (req2.readyState === 4) {
            document.getElementById(`pViews-${call}`).innerHTML = `<i class="fa fa-eye" aria-hidden="true"></i>  ${JSON.parse(req2.responseText).items[0].statistics.viewCount}`;
        }
    };
    req2.send(null);
};
