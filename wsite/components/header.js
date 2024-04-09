class Header extends HTMLElement {
    constructor() {
        super();
    }

    // We can use lit-html to see html formatting in strings like this one
    connectedCallback() {
        this.innerHTML = 
            html`
            <header>
                <nav-element class="navElement selectableNavElement defaultMarginHalf defaultPaddingHalf"
                    onclick="location.href = '../wsite/home.html';"
                    tabindex="0">

                    <div>Home</div>
                </nav-element>

                <nav-element class="navElement selectableNavElement defaultMarginHalf defaultPaddingHalf"
                    onclick="location.href = '../wsite/news.html';"
                    tabindex="0">

                    <div>News</div>
                </nav-element>
                
                <nav-element class="navElement selectableNavElement defaultMarginHalf defaultPaddingHalf"
                    onclick="location.href = '../wsite/about_us.html';"
                    tabindex="0">

                    <div>About us</div>
                </nav-element>

                <nav-element class="navElement selectableNavElement defaultMarginHalf defaultPaddingHalf"
                    onclick="location.href = '../wsite/contact_us.html';"
                    tabindex="0">

                    <div>Contact us</div>
                </nav-element>
            </header>
            `;
    }
}

customElements.define('header-component', Header);