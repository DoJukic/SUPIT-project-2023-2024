class Footer extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML =
        html`
            <footer class="centered">
                &copy; Algebra something something
            </footer>
        `;
    }
}

customElements.define('footer-component', Footer);