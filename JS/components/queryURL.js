
import { YT_SEARCH_URL, YT_API_KEY } from './YT_parametres';

export default (searchTerm, task) => {
    let url = `${YT_SEARCH_URL}?part=snippet&key=${YT_API_KEY[1]}&q=${searchTerm}&maxResults=15&type=video`;
    if (task) url += `&pageToken=${task}`;
    return url;
};

