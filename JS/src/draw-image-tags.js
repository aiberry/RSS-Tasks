// it draws necessary number of tags for rolls
export default (rolls) => {
    // console.log('Drawing image tags:');
    let inner = '';
    for (let i = 0; i <= rolls - 1; i += 1) {
        console.log(i);
        inner += `<div class="col col-${i} result" id="col-${i}">
                        <h2 id="headerImg-${i}" class='result-header'></h2>
                        <p id="pAbout-${i}" class='paragraf-about'></p>
                        <p id="pAuthor-${i}" class='paragraf-author'></p>
                        <p id="pPublished-${i}" class='paragraf-published'></p>
                        <p id="pViews-${i}" class='paragraf-views'></p>
                    </div>`;
    }
    document.querySelector('#row').innerHTML = inner;
    // l('Tags filled. innerHTML = ' + inner);
};
