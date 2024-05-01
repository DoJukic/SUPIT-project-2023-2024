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
                TEST0
            </push-notification-content>
        </push-notification>
    `

    static pushNotifInfoData = 
    html`
        <push-notification class="defaultMarginHalf roundedBorderHalf"
            style="margin-top: 0rem; border-top-left-radius: 0rem; border-bottom-left-radius: 0rem;">

            <push-notification-info class="centered">
                <div class="ui-icon ui-white ui-icon-info"></div>
            </push-notification-info>
            
            <push-notification-content class="defaultPaddingHalf">
                TEST1
            </push-notification-content>
        </push-notification>
    `

    static pushNotifFailData = 
    html`
        <push-notification class="defaultMarginHalf roundedBorderHalf"
            style="margin-top: 0rem; border-top-left-radius: 0rem; border-bottom-left-radius: 0rem;">

            <push-notification-fail class="centered">
                <div class="ui-icon ui-white ui-icon-alert"></div>
            </push-notification-fail>
            
            <push-notification-content class="defaultPaddingHalf">
                TEST2
            </push-notification-content>
        </push-notification>
    `

    connectedCallback() {
        if(PushNotifs.singleton != null){
            console.warn("Multiple push notification components detected, this is not supported and will likely break something.");
        }
        PushNotifs.singleton = this;

        this.innerHTML = PushNotifs.pushNotifSuccessData + PushNotifs.pushNotifInfoData + PushNotifs.pushNotifFailData;

        var calculus = 0;

        Array.from(this.children).forEach(element => {
            console.log($(element).outerHeight(true));
            calculus += $(element).outerHeight(true);
        });

        console.log(calculus);
        // https://stackoverflow.com/questions/6065169/requestanimationframe-with-this-keyword (thanks, James World!)
        requestAnimationFrame(() => this.animate());
        this.style.top = "400px";
    }

    static pushNotificationSuccess(htmlInput){
        var _this = PushNotifs.singleton;

        _this.innerHTML += pushNotifSuccessData;

        _this.notifAdded();
    }

    static pushNotificationError(htmlInput){
        var _this = PushNotifs.singleton;
    }

    static pushNotificationInfo(htmlInput){
        var _this = PushNotifs.singleton;
    }

    notifAdded(){
        var target = this.children[this.children.length - 1];
        var height = $(target).outerHeight(true);

        this.style.top = `${Number(this.style.top.split("px")[0]) + height}px`;
    }

    animate(){
        var topValue = Number(this.style.top.split("px")[0]);

        if(topValue > 0){
            topValue -= 0.05 * topValue;
            this.style.top = `${(topValue >= 1) ? topValue : 0}px`;
        }

        requestAnimationFrame(() => this.animate()); // It's probably fine
    }
}

customElements.define('push-notifications-component', PushNotifs);

if(!Boolean(PushNotifs.singleton)){
    // Should be at the start either way so its top isn't lower on the site than it should be
    document.body.innerHTML = "<push-notifications-component></push-notifications-component>" + document.body.innerHTML;
}