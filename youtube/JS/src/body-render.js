export default class {
    constructor() {
        document.querySelector('body').innerHTML =
            `<div class="container-1">
                <h1 class="main-header">YouTube Spy</h1>
                <section id="form-entry">
                    <form id="js-youtube-search-form">
                        <label class="entry-label" for="search-entry" id="spy-label" hidden><b>SPY MESSAGE....</b></label>
                        <input type="text" name="search-entry" id="search-entry" class="search-input" placeholder="e.g., qwerty" required>
                        <button type="submit" class="search-button">Search</button>
                    </form>
                </section>
                <section id="search-results" class="search-results" hidden>
                    <!--search-results-->
                    <div class="row-1" id="row">
                    </div>
                    <div class="tooltip" id="tooltip-animation">
                    </div>
                    <!--pagination-->  
                    <nav aria-label="Page navigation" id="navPages">
                    </nav>
                </section>
                <section id="no-results" hidden>
                    <p>Sorry, no results were found for your query.</p>
                </section>
            </div>`;
    }
}
