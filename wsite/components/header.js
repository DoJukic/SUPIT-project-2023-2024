// KISS
try{
    if(!Modal.ready() || !PushNotifs.ready()){
        console.warn("Prerequisite scripts report bad init!");
    }
}catch(ex){
    console.warn("Prerequisite scripts may be missing, please include before component.");
    console.warn(ex);
}

class Header extends HTMLElement {
    constructor() {
        super();
    }

    collapsibleIsHidden = true;
    collapsibleIsBusy = false;
    modalLock = false;

    static collapsibleImgXPath = "../res/img/navbar/X-symbol-white.png";
    static collapsibleImgMenuPath = "../res/img/navbar/icons8.com-hamburger-menu-50-white.png";

    static logInModal = null;
    static registerModal = null;

    // Since I'm using IDs for simplicity, making multiple headers will generate duplicates. This would not work correctly so we should prevent it.
    static singleton = null;

    // We can use lit-html to see html formatting in strings like this one (hence the "html" in front of the string)
    // Note: We are using backticks, not double or single quotes - this is important for multiline strings
    static normalHeaderData = 
    html`
        <header id="jsNormalHeaderTarget"
            class="defaultGapHalf sneBorderBottom">

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
        <header id="jsBurgerHeaderTarget"
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

    // These would ideally be their own component, but since these are the only modals on the site it would likely just take more time than it would save
    // I ate my words so hard that I'm keeping the above comment as a memento
    static logInModalData =
    html`
        <modal-component id="jsLogInModalTarget">
            <h1 style="text-align: center; margin: 1rem 0 0 0;">
                Welcome back,
            </h1>
            <p style="text-align: center; margin: 0 0 1rem 0;">
                please input your credentials below.
            </p>

            <form style="width:100%; height:100%;"
                onsubmit="try{Header.singleton.tryLogIn(this,
                                                        this.getElementsByClassName('jsLogInUsernameTarget')[0].value,
                                                        this.getElementsByClassName('jsLogInPasswordTarget')[0].value);}
                        catch(ex){console.error(ex)}
                        finally{return false}; // return false to stop page refresh
                ">

                <flex-column class="defaultGap centered">
                    <flex-column class="defaultGapHalf centered"
                        style="width: 100%;">

                        <input class="jsLogInUsernameTarget roundedBorderHalf" style="width: 100%;" type="text" placeholder="Username" required>
                        <input class="jsLogInPasswordTarget roundedBorderHalf" style="width: 100%;" type="password" placeholder="Password" required>
                    </flex-column>
                    
                    <button class="ui-button ui-widget ui-corner-all" type="submit"
                        style="min-height: 1.5rem !important; width: 103%;">

                        <flex-row class="jsLogInHideOnBusyTarget centered">
                            Log In
                        </flex-row>
                        <flex-row class="jsLogInShowOnBusyTarget centered">
                            <simple-loader-m></simple-loader-m>
                        </flex-row>
                    </button>
                </flex-column>
            </form>
        </modal-component>
    `;

    static registerModalData =
    html`
        <modal-component id="jsRegisterModalTarget">
            <h1 style="text-align: center; margin: 1rem 0 0 0;">
                Welcome,
            </h1>
            <p style="text-align: center; margin: 0 0 1rem 0;">
                please input your credentials below.
            </p>

            <form style="width:100%; height:100%;"
                onsubmit="try{Header.singleton.tryRegister(this,
                                                            this.getElementsByClassName('jsRegisterUsernameTarget')[0].value,
                                                            this.getElementsByClassName('jsRegisterPasswordTarget')[0].value,
                                                            this.getElementsByClassName('jsRegisterPasswordCheckTarget')[0].value);}
                        catch(ex){console.error(ex)}
                        finally{return false};
                ">

                <flex-column class="defaultGap centered">
                    <flex-column class="defaultGapHalf centered"
                        style="width: 100%;">

                        <input class="jsRegisterUsernameTarget roundedBorderHalf" style="width: 100%;" type="text" placeholder="Username" required>
                        <input class="jsRegisterPasswordTarget roundedBorderHalf" style="width: 100%; margin-bottom: 0em;" type="password" placeholder="Password" required>
                        <input class="jsRegisterPasswordCheckTarget roundedBorderHalf" style="width: 100%;" type="password" placeholder="Confirm Password" required>
                    </flex-column>
                    
                    <button class="ui-button ui-widget ui-corner-all" type="submit"
                        style="min-height: 1.5rem !important; width: 103%;">

                        <flex-row class="jsRegisterHideOnBusyTarget centered">
                            Register
                        </flex-row>
                        <flex-row class="jsRegisterShowOnBusyTarget centered">
                            <simple-loader-m></simple-loader-m>
                        </flex-row>
                    </button>
                </flex-column>
            </form>
        </modal-component>
    `;

    // This is the individual entry point - when the component loads into the DOM, this callback is triggered
    connectedCallback() {
        if(Header.singleton != null){
            console.warn("Multiple header components detected, this is not supported and will likely break something.");
        }
        // "this" evaluates to something else when in .on and similar callback functions, so the singleton var fulfils a dual purpose
        Header.singleton = this;

        this.innerHTML = (Header.logInModalData + Header.registerModalData + Header.normalHeaderData + Header.burgerHeaderData);
        
        $(window).on('resize', function(){
            Header.singleton.checkOverflow();
        });
        // Must be deferred (only once), does not work exactly right otherwise because the width gets misreported at startup and that breaks the UI sometimes
        requestAnimationFrame(function(){
            Header.singleton.checkOverflow();
        });
        
        var burgerCollapsibleTriggers = Header.singleton.getElementsByClassName("jsHeaderCollapsibleTrigger");
        $(burgerCollapsibleTriggers).each(function(){
            $(this).on('click', function(){
                Header.singleton.collapsibleToggle();
            });
        });

        Header.singleton.initModals();
    }

    initModals(){
        Header.logInModal = document.getElementById("jsLogInModalTarget");
        Header.registerModal = document.getElementById("jsRegisterModalTarget");

        Header.logInModal.data_busyCounter = 1;
        Header.registerModal.data_busyCounter = 1;

        Header.singleton.logInModalBusyTrigger(false);
        Header.singleton.registerModalBusyTrigger(false);
        
        $(Header.singleton.getElementsByClassName("jsLogInShowTrigger")).each(function(){
            $(this).on("click", function(){
                Header.logInModal.showModal();
            });
        });
        $(Header.singleton.getElementsByClassName("jsRegisterShowTrigger")).each(function(){
            $(this).on("click", function(){
                Header.registerModal.showModal();
            });
        });
    }

    // Simple way to check if our usual header is too wide and swap it with a hamburger.
    checkOverflow(){
        var normalHeader = document.getElementById("jsNormalHeaderTarget");
        var burgerHeader = document.getElementById("jsBurgerHeaderTarget");
        
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

        if (newState) {
            $(this.getElementsByClassName("jsHeaderImageTarget")[0]).attr("src", Header.collapsibleImgXPath);
            $(collapsible).slideDown(500, function() { 
                Header.singleton.collapsibleIsBusy = false;
            });
        }else{
            $(this.getElementsByClassName("jsHeaderImageTarget")[0]).attr("src", Header.collapsibleImgMenuPath);
            $(collapsible).slideUp(500, function() { 
                Header.singleton.collapsibleIsBusy = false;
            });
        }

        this.collapsibleIsHidden = !newState;
    }

    // We must handle spam-clicking gracefully, only allow the busy value to be false if the busy counter is 0.
    static checkModalBusyValue(customModal, isBusy){
        if(isBusy){
            customModal.data_busyCounter += 1;
        }else{
            customModal.data_busyCounter -= 1;
            if(customModal.data_busyCounter != 0){
                isBusy = true;
            }
            if(customModal.data_busyCounter < 0){
                console.error("Busy counter value less than 0!");
            }
        }

        return isBusy;
    }

    logInModalBusyTrigger(isBusy){
        isBusy = Header.checkModalBusyValue(Header.logInModal, isBusy);

        $(Header.singleton.getElementsByClassName("jsLogInHideOnBusyTarget")).each(function(){
            $(this).css("display", isBusy ? "none" : "flex");
        });
        $(Header.singleton.getElementsByClassName("jsLogInShowOnBusyTarget")).each(function(){
            $(this).css("display", isBusy ? "flex" : "none");
        });
    }

    registerModalBusyTrigger(isBusy){
        isBusy = Header.checkModalBusyValue(Header.registerModal, isBusy);

        $(Header.singleton.getElementsByClassName("jsRegisterHideOnBusyTarget")).each(function(){
            $(this).css("display", isBusy ? "none" : "flex");
        });
        $(Header.singleton.getElementsByClassName("jsRegisterShowOnBusyTarget")).each(function(){
            $(this).css("display", isBusy ? "flex" : "none");
        });
    }

    tryLogIn(form, username, password){
        this.logInModalBusyTrigger(true);

        $.ajax({
            url: "https://www.fulek.com/data/api/user/login",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({ "username": username, "password": password })
        })
            .done(function(data, textStatus, jqXHR){
                console.log("DONE");
                console.log(data.isSuccess);
                console.log(data.statusCode);
                if(data.isSuccess){
                    console.log(data.data.token);
                }else{
                    $(data.errorMessages).each(function(){
                        console.log(this);
                    });
                }
            })
            .fail(function(jqXHR, textStatus, errorThrown){
                console.log("ERROR");
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            })
            .always(function(data_OR_jqXHR, textStatus, jqXHR_OR_errorThrown){
                console.log("ALWAYS");
                console.log(data_OR_jqXHR);
                console.log(textStatus);
                console.log(jqXHR_OR_errorThrown);

                Header.singleton.logInModalBusyTrigger(false);
        });

        console.log("GOODBYE");
        
        Header.logInModal.hideModal();
    }

    tryRegister(form, username, password, passwordCheck){
        this.registerModalBusyTrigger(true);

        $.ajax({
            url: "https://www.fulek.com/data/api/user/register",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({ "username": username, "password": password })
        })
            .done(function(data, textStatus, jqXHR){
                console.log("DONE");
                console.log(data.isSuccess);
                console.log(data.statusCode);
                if(data.isSuccess){

                }else{
                    $(data.errorMessages).each(function(){
                        console.log(this);
                    });
                }
            })
            .fail(function(jqXHR, textStatus, errorThrown){
                console.log("ERROR");
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            })
            .always(function(data_OR_jqXHR, textStatus, jqXHR_OR_errorThrown){
                Header.singleton.registerModalBusyTrigger(false);
        });

        console.log("GOODBYE");
        
        Header.registerModal.hideModal();
    }
}

customElements.define('header-component', Header);