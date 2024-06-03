class equalFlexWrap extends HTMLElement {
    constructor() {
        super();
    }

    static overflowResizeObserver = null;

    minElementSizePx = 200;
    elementGapPx = 20;

    connectedCallback() {
        let temp = ML.getIntAttribute(this, "min-element-size-px");
        if(Boolean(temp)){
            this.minElementSizePx = temp;
        }

        temp = ML.getIntAttribute(this, "element-gap-px");
        if(Boolean(temp)){
            this.elementGapPx = temp;
        }
        
        /* We'll want to avoid destroying everything in style while changing things in this case */
        this.style.setProperty("--splitter-gap", `${this.elementGapPx}px`);
        this.style.gap = `${this.elementGapPx}px`;

        equalFlexWrap.overflowResizeObserver.observe(this);
        this.balanceDisplay();
    }

    balanceDisplay() {
        let elementSizePx = 0;
        let childrenAmountPerRow = this.children.length

        let availableWidth = $(this).width();

        let neededSize = childrenAmountPerRow * this.minElementSizePx;
        let diff = neededSize / availableWidth;

        while(diff > 1){
            diff = diff / 2;
            childrenAmountPerRow = childrenAmountPerRow / 2;
        }
        
        childrenAmountPerRow = Math.ceil(childrenAmountPerRow / 2) ;
        elementSizePx = availableWidth / childrenAmountPerRow - 5;
        
        this.style.setProperty("--splitter-basis", `${elementSizePx}px`);
        this.style.setProperty("--splitter-elems-per-line", `${childrenAmountPerRow}`);
    }
}

equalFlexWrap.overflowResizeObserver =  new ResizeObserver((entries) => {
    entries.forEach((entry) => {
        entry.target.balanceDisplay();
    });
});

customElements.define('flex-row-eq-wrap-component', equalFlexWrap);