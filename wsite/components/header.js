class Header extends HTMLElement {
    constructor() {
        super();
    }

    static collapsibleImgXPath = "../res/img/navbar/X-symbol-white.png";

    static collapsibleImgMenuPath = "../res/img/navbar/icons8.com-hamburger-menu-50-white.png";

    // We can use lit-html to see html formatting in strings like this one (hence the "html" in front of the string)
    // Note: We are using backticks, not double or single quotes - this is important for multiline strings
    static normalHeaderData = 
    html`
        <header class="javascriptNormalHeaderTarget defaultGapHalf sneBorderBottom">
            <flex-column class="defaultGapHalf centered defaultPaddingHalf sneBorderRight"
                style="flex-grow:0; min-width:7em; margin-right: 0em;"
                onclick="location.href = '../wsite/home.html';">

                <img src= "../res/img/navbar/FB_Algebra-logo-mini.png"
                    style="max-width: 6em; max-height: 6em; margin-bottom: -1em; margin-top: -1em;">

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

                <flex-row class="defaultGapHalf centered javascriptHeaderChapterTarget"
                    style="font-size: small;">

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
            

            <flex-column style="flex-grow:0;">
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
            </flex-column>
        </header>
    `;

    static burgerHeaderData =
    html`
        <header class="javascriptBurgerHeaderTarget"
            style="flex-direction: column;">

            <flex-row class="sneBorderBottom">
                <flex-column onclick="location.href = '../wsite/home.html';">
                    <img class="javascriptHeaderBurgerImgTarget"
                        src= "../res/img/navbar/FB_Algebra-logo-mini.png"
                        style="max-width: 6em; max-height: 6em; margin-top: -0.25em;">
                </flex-column>

                <flex-column class="navElementVisual"
                    style="flex-grow:1;">

                    <flex-row class="javascriptHeaderTextTarget sneBorderLeft sneBorderRight centered"
                        style="width: 100%;">

                        ALGEBRA UNIVERSITY
                    </flex-row>
                </flex-column>
                
                <flex-column class="javascriptHeaderCollapsibleTrigger centered defaultPadding">
                    <img class="javascriptHeaderImageTarget"
                        src="../res/img/navbar/icons8.com-hamburger-menu-50-white.png"
                        style="max-height: 3em;">
                </flex-column>
            </flex-row>

            <flex-column class="javascriptHeaderCollapsibleTarget"
                style="display: none;">
                
                <flex-row style="flex-wrap: wrap;">
                    <flex-row style="flex-wrap: wrap; flex-basis: 20em;">
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
                    </flex-row>

                    <flex-row style="flex-wrap: wrap; flex-basis: 20em;">
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

                    <flex-row style="flex-wrap: wrap; flex-basis: 20em;">
                        <nav-element class="navElementVisual selectableNavElementAlt defaultPadding"
                            onclick="location.href = '../wsite/about_us.html';"
                            tabindex="0">

                            <div class="ui-icon ui-white ui-icon-unlocked"></div>
                            Log In
                        </nav-element>
                        
                        <nav-element class="navElementVisual selectableNavElementAlt defaultPadding"
                            onclick="location.href = '../wsite/contact_us.html';"
                            tabindex="0">

                            <div class="ui-icon ui-white ui-icon-person"></div>
                            Register
                        </nav-element>
                    </flex-row>
                </flex-row>
                
                <flex-column class="defaultMarginHalf defaultGap"
                    style="font-size: small;">

                    <flex-row class="defaultGap"
                        style="flex-wrap: wrap;">

                        <flex-row class="defaultGap"
                            style="flex-wrap: wrap; flex-basis: 20em;">

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
                    </flex-row>
                </flex-column>
            </flex-column>
        </header>
    `;

    // Simple way to check if our usual header is too wide and swap it with a hamburger.
    static headerCheckOverflow(header_component){
        var normalHeader = header_component.getElementsByClassName("javascriptNormalHeaderTarget")[0];
        var burgerHeader = header_component.getElementsByClassName("javascriptBurgerHeaderTarget")[0];
        
        // Testing shows negligble performance impact when doing this.
        $(normalHeader).css("display", "flex");
        $(burgerHeader).css("display", "none");

        if (!isOverflownRow(normalHeader)) {
            // I don't actually know why this works I was just poking it a bit tbh. If something looks weird it's probably this.
            Header.collapsibleSet(header_component, 0);
            return;
        }

        var burgerText = burgerHeader.getElementsByClassName("javascriptHeaderTextTarget")[0];
        
        $(normalHeader).css("display", "none");
        $(burgerHeader).css("display", "flex");
        $(burgerText).css("display", "flex");

        if (!isOverflownRow(burgerHeader)){
            return;
        }

        $(burgerText).css("display", "none");
    }

    // ********** TODO: IT IS ALL BORKED. UNBORK IT. **********

    static collapsibleToggle(header_component){
        if (getBooleanAttribute(header_component, "headerCollapsibleIsBusy")) {
            // Button spamming can mess with things otherwise, and we don't really want that
            return;
        }

        if (getBooleanAttribute(header_component, "headerCollapsibleIsHidden")) {
            Header.collapsibleSet(header_component, 1);
        }else{
            Header.collapsibleSet(header_component, 0);
        }
    }

    static collapsibleSet(header_component, newState){
        setBooleanAttribute(header_component, "headerCollapsibleIsBusy", true);

        var collapsible = header_component.getElementsByClassName("javascriptHeaderCollapsibleTarget")[0];

        if (newState) {
            $(header_component.getElementsByClassName("javascriptHeaderImageTarget")[0]).attr("src", Header.collapsibleImgXPath);
            $(collapsible).slideDown(500, function() { 
                setBooleanAttribute(header_component, "headerCollapsibleIsBusy", false);
            });
        }else{
            $(header_component.getElementsByClassName("javascriptHeaderImageTarget")[0]).attr("src", Header.collapsibleImgMenuPath);
            $(collapsible).slideUp(500, function() { 
                setBooleanAttribute(header_component, "headerCollapsibleIsBusy", false);
            });
        }

        setBooleanAttribute(header_component, "headerCollapsibleIsHidden", !newState);
    }

    // This is the individual entry point - when the component loads into the DOM, this callback is triggered
    connectedCallback() {
        this.innerHTML = (Header.normalHeaderData + Header.burgerHeaderData);

        setBooleanAttribute(this, "headerCollapsibleIsHidden", 1);
        
        // "this" evaluates to something else when in a .on and similar callback functions
        // In this case a "this" would be the window, and not the element, so we simply specify another var
        var me_myself = this;
        $(window).on('resize', function(){
            Header.headerCheckOverflow(me_myself)
        });
        Header.headerCheckOverflow(me_myself)
        
        var burgerCollapsibleTriggers = this.getElementsByClassName("javascriptHeaderCollapsibleTrigger");
        $(burgerCollapsibleTriggers).each(function(){
            $(this).on('click', function(){
                Header.collapsibleToggle(me_myself)
            });
        });

        // TODO: fetch chapters
        $(document).ready(function () {
                
        });
    }
}

customElements.define('header-component', Header);