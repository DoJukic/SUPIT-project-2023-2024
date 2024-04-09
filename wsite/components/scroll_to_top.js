class ScrollToTop extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <header>
                <nav>
                    <a class="navElement centered" href="home.html"><div class="centered">Home</div></a>
                    <a class="navElement centered" href="news.html"><div class="centered">News</div></a>
                    <a class="navElement centered" href="contact_us.html"><div class="centered">Contact us</div></a>
                    <a class="navElement centered" href="about_us.html"><div class="centered">About us</div></a>
                    
                </nav>
            </header>
        `;
    }
}

customElements.define('scroll-to-top-component', ScrollToTop);