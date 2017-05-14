export default (query, callPush, callDisplay, whatPage, numberOfImg) => {
    const req = new XMLHttpRequest();
    req.open('GET', query);
    req.onreadystatechange = () => {
        if (req.readyState === 4) {
            callPush(JSON.parse(req.responseText));
            if (callDisplay !== undefined) {
                callDisplay(whatPage, numberOfImg);
            }
        }
    };
    req.send(null);
};
