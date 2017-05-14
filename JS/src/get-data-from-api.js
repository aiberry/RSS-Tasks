export default (query, callPush, callDisplay, whatPage, numberOfImg) => {
    // console.log('Sending query: '+ query)
    const req = new XMLHttpRequest();
    req.open('GET', query);
    req.onreadystatechange = () => {
        if (req.readyState === 4) {
            callPush(JSON.parse(req.responseText));
            // l('New data just pushed to buffer:');
            console.log(req.responseText);
            if (callDisplay !== undefined) {
                callDisplay(whatPage, numberOfImg);
            }
        }
    };
    req.send(null);
};
