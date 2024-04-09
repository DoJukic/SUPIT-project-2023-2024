class Header extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <a class="navElement centered" href="home.html"><div>Home</div></a>
            <a class="navElement centered" href="news.html"><div>News</div></a>
            <a class="navElement centered" href="contact_us.html"><div>Contact us</div></a>
            <a class="navElement centered" href="about_us.html"><div">About us</div></a>
        `;
    }
}

customElements.define('header-component', Header);