class PushNotifs extends HTMLElement {
    constructor() {
        super();
    }

    static ready(){return(Boolean(PushNotifs.singleton))}

    static singleton = null;

    totalHeight = 0;

    static pushNotifSuccessData = 
    html`
        <push-notification class="defaultMarginHalf roundedBorderHalf"
            style="margin-top: 0rem; border-top-left-radius: 0rem; border-bottom-left-radius: 0rem;">

            <push-notification-success class="centered">
                <div class="ui-icon ui-white ui-icon-check"></div>
            </push-notification-success>
            
            <push-notification-content class="defaultPaddingHalf">
    `

    static pushNotifInfoData = 
    html`
        <push-notification class="defaultMarginHalf roundedBorderHalf"
            style="margin-top: 0rem; border-top-left-radius: 0rem; border-bottom-left-radius: 0rem;">

            <push-notification-info class="centered">
                <div class="ui-icon ui-white ui-icon-info"></div>
            </push-notification-info>
            
            <push-notification-content class="defaultPaddingHalf">
    `

    static pushNotifFailData = 
    html`
        <push-notification class="defaultMarginHalf roundedBorderHalf"
            style="margin-top: 0rem; border-top-left-radius: 0rem; border-bottom-left-radius: 0rem;">

            <push-notification-fail class="centered">
                <div class="ui-icon ui-white ui-icon-alert"></div>
            </push-notification-fail>
            
            <push-notification-content class="defaultPaddingHalf">
    `

    static pushNotifEndData =
    html`
            </push-notification-content>
        </push-notification>
    `

    connectedCallback() {
        if(PushNotifs.singleton != null){
            console.warn("Multiple push notification components detected, this is not supported and will likely break something.");
        }
        PushNotifs.singleton = this;

        PushNotifs.pushNotificationSuccess("TEST DIVTEST DIV");
        PushNotifs.pushNotificationFail("404 no maidens found");
        PushNotifs.pushNotificationInfo("ALL UNITS BE ADVISED");

        // https://stackoverflow.com/questions/6065169/requestanimationframe-with-this-keyword (thanks, James World!)
        requestAnimationFrame(() => this.animateNotifs());
    }

    static pushNotificationSuccess(htmlInput){
        var _this = PushNotifs.singleton;

        _this.innerHTML += PushNotifs.pushNotifSuccessData + htmlInput + PushNotifs.pushNotifEndData;

        _this.notifAdded();
    }

    static pushNotificationFail(htmlInput){
        var _this = PushNotifs.singleton;

        _this.innerHTML += PushNotifs.pushNotifFailData + htmlInput + PushNotifs.pushNotifEndData;

        _this.notifAdded();
    }

    static pushNotificationInfo(htmlInput){
        var _this = PushNotifs.singleton;

        _this.innerHTML += PushNotifs.pushNotifInfoData + htmlInput + PushNotifs.pushNotifEndData;

        _this.notifAdded();
    }

    notifAdded(){
        var target = this.children[this.children.length - 1];
        var height = $(target).outerHeight(true);
        
        this.style.top = `${Number(this.style.top.split("px")[0]) + height}px`;

        this.addEventListener("animationend", (event) => {this.remove();});

        return; // Not sure why none of the thigns below work, so I'm doing this with css classes and event listeners instead.

        target.animate([
            {
                opacity: 1
            },
            {
                opacity: 0
            }
        ],
        6000
        );

        return;

        $(target).css("opacity", "1");
        $(target).animate({
            opacity: 0
            }, 6000, function(){
                target.remove();
                console.log(target); // It prints the correct element but it just doesn't do anything??
            }
        );
    }

    animateNotifs(){
        var topValue = Number(this.style.top.split("px")[0]);

        if(topValue > 0){
            topValue -= 0.05 * topValue;
            this.style.top = `${(topValue >= 1) ? topValue : 0}px`;
        }

        requestAnimationFrame(() => this.animateNotifs()); // It's probably fine
    }
}

customElements.define('push-notifications-component', PushNotifs);

if(!Boolean(PushNotifs.singleton)){
    // Should be at the start either way so its top isn't lower on the site than it should be
    document.body.innerHTML = "<push-notifications-component></push-notifications-component>" + document.body.innerHTML;
}