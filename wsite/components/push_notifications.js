class PushNotifs extends HTMLElement {
    constructor() {
        super();
    }

    static exists(){return(Boolean(PushNotifs.singleton))}

    static singleton = null;

    connectedCallback() {
        if(PushNotifs.singleton != null){
            console.warn("Multiple push notification components detected, this is not supported and will likely break something.");
        }
        PushNotifs.singleton = this;
    }
}

customElements.define('push-notifications-component', PushNotifs);

if(!Boolean(PushNotifs.singleton)){
    // Should be at the start either way so its top isn't lower on the site than it should be
    document.body.innerHTML = "<push-notifications-component></push-notifications-component>" + document.body.innerHTML;
}