class equalFlexWrap extends HTMLElement {
    constructor() {
        super();
    }

    static overflowResizeObserver = null;
    static rowAttribute = "is-logical-row";

    connectedCallback() {
        equalFlexWrap.overflowResizeObserver.observe(this);
        this.balanceDisplay();
    }

    balanceDisplay() {
        $(this).children().each(function(){
            if(ML.getBooleanAttribute(this, equalFlexWrap.rowAttribute)){
                console.log("AAAAAAAAAAAAAAAAAAAA")
            }else{
                console.log("BBBBBBBBBBBBBB")
            }
        })
    }
}

equalFlexWrap.overflowResizeObserver =  new ResizeObserver((entries) => {
    entries.forEach((entry) => {
        entry.target.balanceDisplay();
    });
});

customElements.define('flex-row-eq-wrap-component', equalFlexWrap);