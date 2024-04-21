class Header extends HTMLElement {
    constructor() {
        super();

        this.collapsibleIsHidden = true;
        this.collapsibleIsBusy = false;

        this.modalLock = false;
    }

    static collapsibleImgXPath = "../res/img/navbar/X-symbol-white.png";
    static collapsibleImgMenuPath = "../res/img/navbar/icons8.com-hamburger-menu-50-white.png";

    // We can use lit-html to see html formatting in strings like this one (hence the "html" in front of the string)
    // Note: We are using backticks, not double or single quotes - this is important for multiline strings
    static normalHeaderData = 
    html`
        <header class="jsNormalHeaderTarget defaultGapHalf sneBorderBottom">
            <flex-column class="defaultGapHalf centered defaultPaddingHalf sneBorderRight"
                style="flex-grow:0; margin-right: 0em;"
                onclick="location.href = '../wsite/home.html';">

                <img src= "../res/img/navbar/FB_Algebra-logo-mini.png"
                    style="max-width: 5em; max-height: 5em; margin-top: -0.25em;">
            </flex-column>

            <flex-row class="defaultGapHalf defaultPadding centered">
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

            <flex-column style="flex-grow:0;">
                <flex-row>
                    <nav-element class="jsLogInShowTrigger navElementVisual selectableNavElementAlt defaultPaddingHalf"
                        tabindex="0">
                        
                        <flex-row class="jsLogInHideOnBusyTarget centered">
                            <div class="ui-icon ui-white ui-icon-unlocked"></div>
                            <div>Log In</div>
                        </flex-row>
                        <simple-loader class="jsLogInShowOnBusyTarget"></simple-loader>
                    </nav-element>
                </flex-row>

                <flex-row>
                    <nav-element class="jsRegisterShowTrigger navElementVisual selectableNavElementAlt defaultPaddingHalf"
                        tabindex="0">

                        <flex-row class="jsRegisterHideOnBusyTarget centered">
                            <div class="ui-icon ui-white ui-icon-person"></div>
                            <div>Register</div>
                        </flex-row>
                        <simple-loader class="jsRegisterShowOnBusyTarget"></simple-loader>
                    </nav-element>
                </flex-row>
            </flex-column>
        </header>
    `;

    static burgerHeaderData =
    html`
        <header class="jsBurgerHeaderTarget"
            style="flex-direction: column;">

            <flex-row class="sneBorderBottom">
                <flex-column onclick="location.href = '../wsite/home.html';">
                    <img class="jsHeaderBurgerImgTarget"
                        src= "../res/img/navbar/FB_Algebra-logo-mini.png"
                        style="max-width: 5em; max-height: 5em;">
                </flex-column>

                <flex-column class="navElementVisual"
                    style="flex-grow:1;">

                    <flex-row class="jsHeaderCollapsibleTrigger jsHeaderTextTarget sneBorderLeft sneBorderRight centered"
                        style="width: 100%;">

                        ALGEBRA UNIVERSITY
                    </flex-row>
                </flex-column>
                
                <flex-column class="jsHeaderCollapsibleTrigger centered defaultPadding">
                    <img class="jsHeaderImageTarget"
                        src="../res/img/navbar/icons8.com-hamburger-menu-50-white.png"
                        style="max-height: 3em;">
                </flex-column>
            </flex-row>

            <flex-column class="jsHeaderCollapsibleTarget"
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
                        <nav-element class="jsLogInShowTrigger navElementVisual selectableNavElementAlt defaultPadding"
                            tabindex="0">
                            
                            <flex-row class="jsLogInHideOnBusyTarget centered">
                                <div class="ui-icon ui-white ui-icon-unlocked"></div>
                                <div>Log In</div>
                            </flex-row>
                            <simple-loader class="jsLogInShowOnBusyTarget"></simple-loader>
                        </nav-element>
                        
                        <nav-element class="jsRegisterShowTrigger navElementVisual selectableNavElementAlt defaultPadding"
                            tabindex="0">

                            <flex-row class="jsRegisterHideOnBusyTarget centered">
                                <div class="ui-icon ui-white ui-icon-person"></div>
                                <div>Register</div>
                            </flex-row>
                            <simple-loader class="jsRegisterShowOnBusyTarget"></simple-loader>
                        </nav-element>
                    </flex-row>
                </flex-row>
            </flex-column>
        </header>
    `;

    static logInModalData =
    html`
        <custom-modal class="jsLogInModalTarget">
            <flex-column class="defaultMarginDouble defaultPaddingDouble centered algebraBG roundedBorder whiteBorder"
                style="padding-top:0em; max-width: 30rem;">

                <h1 style="text-align: center; margin: 1rem 0 0 0;">
                    Welcome back,
                </h1>
                <p style="text-align: center; margin: 0 0 2rem 0;">
                    please input your credentials below.
                </p>

                <form style="width:100%; height:100%;"
                    action="javascript:tryLogIn($('#loginFormUsername').value, $('#loginFormPassword').value)">

                    <flex-column class="defaultGap centered">
                        <input class="roundedBorderHalf" style="width: 100%;" type="text" placeholder="Username" required>
                        <input class="roundedBorderHalf" style="width: 100%;" type="password" placeholder="Password" required>
                        
                        <button class="ui-button ui-widget ui-corner-all" type="submit"
                            style="min-height: 1.5em !important; width: 90%;">

                            <flex-row class="jsRegisterHideOnBusyTarget centered">
                                Log In
                            </flex-row>
                            <simple-loader class="jsRegisterShowOnBusyTarget"></simple-loader>
                        </button>
                    </flex-column>
                </form>
            </flex-column>
        </custom-modal>
    `;

    static registerModalData =
    html`
        <custom-modal class="jsRegisterModalTarget">
            <flex-column class="defaultMarginDouble defaultPaddingDouble centered algebraBG roundedBorder whiteBorder"
                    style="padding-top:0em; max-width: 30rem;">

                    <h1 style="text-align: center; margin: 1em 0 0 0;">
                        Welcome,
                    </h1>
                    <p style="text-align: center; margin: 0 0 2em 0;">
                        please input your credentials below.
                    </p>

                    <form style="width:100%; height:100%;"
                        action="javascript:tryLogIn($('#loginFormUsername').value, $('#loginFormPassword').value)">

                        <flex-column class="defaultGap centered">
                            <input class="roundedBorderHalf" style="width: 100%;" type="text" placeholder="Username" required>
                            <input class="roundedBorderHalf" style="width: 100%;" type="password" placeholder="Password" required>
                            
                            <button class="ui-button ui-widget ui-corner-all" type="submit"
                                style="min-height: 1.5em !important; width: 90%;">

                                <flex-row class="jsRegisterHideOnBusyTarget centered">
                                    Register
                                </flex-row>
                                <simple-loader class="jsRegisterShowOnBusyTarget"></simple-loader>
                            </button>
                        </flex-column>
                    </form>
                </flex-column>
        </custom-modal>
    `;

    // Simple way to check if our usual header is too wide and swap it with a hamburger.
    checkOverflow(){
        var normalHeader = this.getElementsByClassName("jsNormalHeaderTarget")[0];
        var burgerHeader = this.getElementsByClassName("jsBurgerHeaderTarget")[0];
        
        // Testing shows negligble performance impact when doing this.
        $(normalHeader).css("display", "flex");
        $(burgerHeader).css("display", "none");

        if (!isOverflownRow(normalHeader)) {
            this.collapsibleSet(0);
            return;
        }

        var burgerText = burgerHeader.getElementsByClassName("jsHeaderTextTarget")[0];
        
        $(normalHeader).css("display", "none");
        $(burgerHeader).css("display", "flex");
        $(burgerText).css("display", "flex");

        if (!isOverflownRow(burgerHeader)){
            return;
        }

        $(burgerText).css("display", "none");
    }

    collapsibleToggle(){
        if (this.collapsibleIsBusy) {
            // Button spamming can mess with things otherwise, and we don't really want that
            return;
        }

        if (this.collapsibleIsHidden) {
            this.collapsibleSet(1);
        }else{
            this.collapsibleSet(0);
        }
    }

    collapsibleSet(newState){
        this.collapsibleIsBusy = true;

        var collapsible = this.getElementsByClassName("jsHeaderCollapsibleTarget")[0];
        var _this = this;

        if (newState) {
            $(this.getElementsByClassName("jsHeaderImageTarget")[0]).attr("src", Header.collapsibleImgXPath);
            $(collapsible).slideDown(500, function() { 
                _this.collapsibleIsBusy = false;
            });
        }else{
            $(this.getElementsByClassName("jsHeaderImageTarget")[0]).attr("src", Header.collapsibleImgMenuPath);
            $(collapsible).slideUp(500, function() { 
                _this.collapsibleIsBusy = false;
            });
        }

        this.collapsibleIsHidden = !newState;
    }

    showModal(custom_modal){
        if (this.modalLock) {
            return;
        }
        this.modalLock = true;

        $(custom_modal).css("display", "flex");
        $(custom_modal).animate({
            opacity: 1
            }, 500
        );
        
        custom_modal.getElementsByTagName("input")[0].focus();
    }

    hideModal(custom_modal){
        this.modalLock = false;

        $(custom_modal).animate({
            opacity: 0
            }, 250, function(){
            $(this).css('display', 'none');
        });
    }

    logInModalBusyTrigger(isBusy){
        $(this.getElementsByClassName("jsLogInHideOnBusyTarget")).each(function(){
            $(this).css("display", isBusy ? "none" : "flex");
        });
        $(this.getElementsByClassName("jsLogInShowOnBusyTarget")).each(function(){
            $(this).css("display", isBusy ? "flex" : "none");
        });
    }

    registerModalBusyTrigger(isBusy){
        $(this.getElementsByClassName("jsRegisterHideOnBusyTarget")).each(function(){
            $(this).css("display", isBusy ? "none" : "flex");
        });
        $(this.getElementsByClassName("jsRegisterShowOnBusyTarget")).each(function(){
            $(this).css("display", isBusy ? "flex" : "none");
        });
    }

    // This is the individual entry point - when the component loads into the DOM, this callback is triggered
    connectedCallback() {
        this.innerHTML = (Header.logInModalData + Header.registerModalData + Header.normalHeaderData + Header.burgerHeaderData);
        
        // "this" evaluates to something else when in .on and similar callback functions
        // In this case a "this" would be the window, and not the element, so we simply specify another var
        var _this = this;
        $(window).on('resize', function(){
            _this.checkOverflow();
        });
        // Must be deferred, does not work exactly right otherwise because the width gets misreported at startup at certain sizes
        requestAnimationFrame(function(){
            _this.checkOverflow();
        });
        
        var burgerCollapsibleTriggers = _this.getElementsByClassName("jsHeaderCollapsibleTrigger");
        $(burgerCollapsibleTriggers).each(function(){
            $(this).on('click', function(){
                _this.collapsibleToggle();
            });
        });

        // Using IDs in components feels like bad practice to me, so I am just doing this instead.
        var logInModal = _this.getElementsByClassName("jsLogInModalTarget")[0];
        var registerModal = _this.getElementsByClassName("jsRegisterModalTarget")[0];

        $(logInModal).on("click", function(e){
            if (e.target != this) {
                return;
            }
            _this.hideModal(this);
        });
        $(registerModal).on("click", function(e){
            if (e.target != this) {
                return;
            }
            _this.hideModal(this);
        });

        _this.logInModalBusyTrigger(false);
        _this.registerModalBusyTrigger(false);
        
        $(_this.getElementsByClassName("jsLogInShowTrigger")).each(function(){
            $(this).on("click", function(){
                _this.showModal(logInModal);
            });
        });
        $(_this.getElementsByClassName("jsRegisterShowTrigger")).each(function(){
            $(this).on("click", function(){
                _this.showModal(registerModal);
            });
        });
    }
}

customElements.define('header-component', Header);