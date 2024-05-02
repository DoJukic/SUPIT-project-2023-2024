class PushNotifs extends HTMLElement {
    constructor() {
        super();
    }

    static ready(){return(Boolean(PushNotifs.singleton))}

    static singleton = null;

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

        // https://stackoverflow.com/questions/6065169/requestanimationframe-with-this-keyword (thanks, James World!)
        requestAnimationFrame(() => this.animateNotifs());
    }

    static pushNotificationSuccess(title, content){
        var _this = PushNotifs.singleton;
        
        _this.insertAdjacentHTML("beforeend",
            PushNotifs.pushNotifSuccessData +
            "<text style='color: green; font-weight: bold;'>" + title + "</text>" + "<br/><br-half></br-half>" + "<text>" + content + "</text>"
            + PushNotifs.pushNotifEndData);

        _this.notifAdded();
    }

    static pushNotificationFail(title, content){
        var _this = PushNotifs.singleton;
        
        _this.insertAdjacentHTML("beforeend",
            PushNotifs.pushNotifFailData +
            "<text style='color: red; font-weight: bold;'>" + title + "</text>" + "<br/><br-half></br-half>" + "<text>" + content + "</text>"
            + PushNotifs.pushNotifEndData);

        _this.notifAdded();
    }

    static pushNotificationInfo(title, content){
        var _this = PushNotifs.singleton;
        
        _this.insertAdjacentHTML("beforeend",
            PushNotifs.pushNotifInfoData +
            "<text style='color: blueviolet; font-weight: bold;'>" + title + "</text>" + "<br/><br-half></br-half>" + "<text>" + content + "</text>"
            + PushNotifs.pushNotifEndData);

        _this.notifAdded();
    }

    notifAdded(){
        var target = this.children[this.children.length - 1];
        var height = $(target).outerHeight(true);
        
        this.style.top = `${Number(this.style.top.split("px")[0]) + height}px`;

        // Not sure why none of the animation() methods want to work right.
        // UPDATE: I was adding to innerHTML directly, which broke the references.
        
        $(target).delay(4000).animate({
            opacity: 0
            }, 500, function(){
                target.remove();
            }
        );
    }

    animateNotifs(){
        var topValue = Number(this.style.top.split("px")[0]);

        if(topValue > 0){
            topValue -= 0.05 * topValue; // Ease out, basically
            this.style.top = `${(topValue >= 1) ? topValue : 0}px`;
        }

        requestAnimationFrame(() => this.animateNotifs()); // It's probably fine
    }
}

customElements.define('push-notifications-component', PushNotifs);

if(!Boolean(PushNotifs.singleton)){
    var tgt = document.createElement("push-notifications-component");
    document.body.prepend(tgt);
}