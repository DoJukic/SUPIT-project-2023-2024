class ScrollToTop extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML =
            html`
            <div class="row" style="justify-content: flex-end; align-items: flex-end;">
            
                <img id="scrollToTopImage" class="observerRotateOnNavbar" src="../res/img/scroll_to_top.png"
                    style="width: 40px; height: 40px; pointer-events: auto; opacity: 0.5; cursor: pointer;">
                <stt-space-maker style="display:block; width:30px;"></stt-space-maker>
            </div>
            <stt-space-maker style="display:block; height:20px;"></stt-space-maker>
        `;
    }
}

customElements.define('scroll-to-top-component', ScrollToTop);