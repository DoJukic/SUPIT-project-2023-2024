class Footer extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <footer class="centered">
                &copy; Algebra something something
            </footer>
        `;
    }
}

customElements.define('footer-component', Footer);