class Header extends HTMLElement {
    constructor() {
        super();
    }

    // We can use lit-html to see html formatting in strings like this one
    connectedCallback() {
        this.innerHTML = 
            html`
            <header class="defaultGapHalf">
                <flex-row class="defaultGapHalf centered defaultMarginHalf"
                    style="flex-grow:0; min-width:7em; margin-right: 0em;">

                    <img src= "../res/img/navbar/FB_Algebra-logo-mini.png"
                        style="max-width: 6em; max-height: 6em !important; position: absolute;">

                    <div class="navElementVisual defaultPaddingHalf"
                        style="max-height: 100%; padding-left: 0em; z-index: 10; margin-top: 10px; margin-left: 10px; font-size: large;">

                        ALGEBRA
                        UNIVERSITY
                     </div>
                </flex-row>

                <flex-column class="defaultGapHalf defaultMarginHalf"
                    style="flex-grow:1;">

                    <flex-row class="centered defaultGapHalf">

                        <nav-element class="navElementVisual selectableNavElement defaultPaddingHalf centered"
                            onclick="location.href = '../wsite/home.html';"
                            tabindex="0">

                            <div class="ui-icon ui-white ui-icon-home"
                                style="margin-top: 0px;"></div></div>
                            Home
                        </nav-element>

                        <nav-element class="navElementVisual selectableNavElement defaultPaddingHalf centered"
                            onclick="location.href = '../wsite/news.html';"
                            tabindex="0">

                            <div class="ui-icon ui-white ui-icon-note"
                                style="margin-top: -2px;"></div></div>
                            News
                        </nav-element>

                        <nav-element class="navElementVisual selectableNavElement defaultPaddingHalf"
                            onclick="location.href = '../wsite/about_us.html';"
                            tabindex="0">

                            <div class="ui-icon ui-white ui-icon-search"
                                style="margin-top: 0px;"></div>
                            About us
                        </nav-element>

                        <nav-element class="navElementVisual selectableNavElement defaultPaddingHalf"
                            onclick="location.href = '../wsite/contact_us.html';"
                            tabindex="0">

                            <div class="ui-icon ui-white ui-icon-transferthick-e-w"
                                style="margin-top: 0px; transform: rotate(90deg);"></div>
                            Contact us
                        </nav-element>
                    </flex-row>
                    

                    <flex-row class="defaultGapHalf" style="font-size: small;">

                        <nav-element class="navElementVisual selectableNavElement defaultPaddingHalf"
                            onclick="location.href = '../wsite/home.html';"
                            tabindex="0">

                            CHAPTER1
                        </nav-element>

                        <nav-element class="navElementVisual selectableNavElement defaultPaddingHalf"
                            onclick="location.href = '../wsite/news.html';"
                            tabindex="0">

                            CHAPTER2
                        </nav-element>

                        <nav-element class="navElementVisual selectableNavElement defaultPaddingHalf"
                            onclick="location.href = '../wsite/about_us.html';"
                            tabindex="0">

                            CHAPTER3
                        </nav-element>
                    </flex-row>
                </flex-column>
                

                <flex-column style="align-items: center; flex-grow:0;">
                    <flex-row>
                        <nav-element class="navElementVisual selectableNavElement defaultPaddingHalf"
                            onclick="location.href = '../wsite/home.html';"
                            tabindex="0">

                            <div class="ui-icon ui-white ui-icon-unlocked"
                                style="margin-top: 0px;"></div>
                            Log In
                        </nav-element>
                    </flex-row>

                    <flex-row>
                        <nav-element class="navElementVisual selectableNavElement defaultPaddingHalf"
                            onclick="location.href = '../wsite/home.html';"
                            tabindex="0">

                            <div class="ui-icon ui-white ui-icon-key"
                                style="margin-top: 0px;"></div>
                            Register
                        </nav-element>
                    </flex-row>

                </flex-row>
                    
                
            </header>
            `;
    }
}

customElements.define('header-component', Header);