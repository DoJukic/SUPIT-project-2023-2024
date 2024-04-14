class Header extends HTMLElement {
    constructor() {
        super();
    }

    // We can use lit-html to see html formatting in strings like this one (hence the "html" in front of the string)
    static normalHeaderData = 
    html`
        <header class="defaultGapHalf">
            <flex-column class="defaultGapHalf centered defaultPaddingHalf"
                style="flex-grow:0; min-width:7em; margin-right: 0em; border-right: 1px solid rgba(255, 255, 255, 0.5);"
                onclick="location.href = '../wsite/home.html';">

                <img src= "../res/img/navbar/FB_Algebra-logo-mini.png"
                    style="max-width: 6em; max-height: 6em !important; margin-bottom: -1em; margin-top: -1em;">

                <div class="navElementVisual" style="max-width:6em;">
                    ALGEBRA UNIVERSITY
                </div>
            </flex-column>
            
            <flex-column class="defaultGapHalf defaultMarginHalf"
                style="flex-grow:1;">

                <flex-row class="defaultGapHalf">

                    <nav-element class="navElementVisual selectableNavElementAlt defaultPadding centered"
                        onclick="location.href = '../wsite/home.html';"
                        tabindex="0">

                        <div class="ui-icon ui-white ui-icon-home"></div>
                        Home
                    </nav-element>

                    <nav-element class="navElementVisual selectableNavElementAlt defaultPadding centered"
                        onclick="location.href = '../wsite/news.html';"
                        tabindex="0">

                        <div class="ui-icon ui-white ui-icon-note"
                            style="margin-top: -2px;"></div>
                        News
                    </nav-element>

                    <nav-element class="navElementVisual selectableNavElementAlt defaultPadding"
                        onclick="location.href = '../wsite/about_us.html';"
                        tabindex="0">

                        <div class="ui-icon ui-white ui-icon-search"></div>
                        About us
                    </nav-element>

                    <nav-element class="navElementVisual selectableNavElementAlt defaultPadding"
                        onclick="location.href = '../wsite/contact_us.html';"
                        tabindex="0">

                        <div class="ui-icon ui-white ui-icon-transferthick-e-w"
                            style="transform: rotate(90deg);"></div>
                        Contact us
                    </nav-element>
                </flex-row>
                

                <flex-row class="defaultGapHalf centered" style="font-size: small;">

                    <nav-element class="navElementVisual selectableNavElement defaultPadding"
                        onclick="location.href = '../wsite/home.html';"
                        tabindex="0">

                        CHAPTER1
                    </nav-element>

                    <nav-element class="navElementVisual selectableNavElement defaultPadding"
                        onclick="location.href = '../wsite/news.html';"
                        tabindex="0">

                        CHAPTER2
                    </nav-element>

                    <nav-element class="navElementVisual selectableNavElement defaultPadding"
                        onclick="location.href = '../wsite/about_us.html';"
                        tabindex="0">

                        CHAPTER3
                    </nav-element>
                </flex-row>
            </flex-column>
            

            <flex-column style="align-items: center; flex-grow:0;">
                <flex-row>
                    <nav-element class="navElementVisual selectableNavElementAlt defaultPaddingHalf"
                        onclick="location.href = '../wsite/home.html';"
                        tabindex="0">

                        <div class="ui-icon ui-white ui-icon-unlocked"></div>
                        Log In
                    </nav-element>
                </flex-row>

                <flex-row>
                    <nav-element class="navElementVisual selectableNavElementAlt defaultPaddingHalf"
                        onclick="location.href = '../wsite/home.html';"
                        tabindex="0">

                        <div class="ui-icon ui-white ui-icon-person"></div>
                        Register
                    </nav-element>
                </flex-row>
            </flex-row>
        </header>
    `;

    // NOTE: We are using backticks, not double or single quotes - this is important for multiline strings
    static burgerHeaderData =
    html`
        <header class="defaultGapHalf">
            <flex-column class="centered defaultMarginHalf">

                <img id="navBarCollapsibleImg" src="../res/img/navbar/icons8.com-hamburger-menu-50-white.png" style="max-height: 3em;">
            </flex-column>
            
            <flex-column style="flex-grow:1;"></flex-column>

            <flex-column class="navElementVisual centered javascriptHeaderTextTarget">
                ALGEBRA UNIVERSITY
            </flex-column>

            <flex-column>
                <img src= "../res/img/navbar/FB_Algebra-logo-mini.png"
                    style="max-width: 6em; max-height: 6em !important; margin-bottom: -0.5em; margin-top: -0.5em;">
            </flex-column>
        </header>
    `;

    // Simple way to check if our usual header is too wide and swap it with a hamburger. As they say, there is truth in simplicity.
    static headerCheckOverflow(header_component){
        var normalHeader = header_component.children[0]
        var burgerHeader = header_component.children[1]
        
        // Testing shows negligble performance impact when rapidly resizing page for several minutes.
        $(normalHeader).css("display", "flex");
        $(burgerHeader).css("display", "none");

        if (!isOverflownRow(normalHeader)) {
            console.log("NO OVERFLOW");
            return;
        }

        var burgerText = burgerHeader.getElementsByClassName("javascriptHeaderTextTarget")[0];
        
        $(normalHeader).css("display", "none");
        $(burgerHeader).css("display", "flex");
        $(burgerText).css("display", "flex");
        

        if (!isOverflownRow(burgerHeader)){
            console.log("NORMAL OVERFLOW");
            return;
        }

        console.log("EXTREME OVERFLOW");
        $(burgerText).css("display", "none");
    }

    // This is the individual entry point - when the component loads into the DOM, this callback is triggered
    connectedCallback() {
        this.innerHTML = (Header.normalHeaderData + Header.burgerHeaderData);
        
        var me_myself = this;
        $(window).on('resize', function(){
            Header.headerCheckOverflow(me_myself)
        });
        Header.headerCheckOverflow(me_myself)

        // TODO: fetch chapters
        $(document).ready(function () {
                
        });
    }
}

customElements.define('header-component', Header);