class LocalSemesterContainer extends HTMLElement {
    constructor() {
        super();
    }

    bgAlternator = 0;
    currentFilter = "";
    useAltComponent = false;

    connectedCallback() {
    }

    initialize(semesterNum, useAltComponent = false){
        this.useAltComponent = useAltComponent;

        ML.setIntAttribute(this, "semester-number", semesterNum)

        this.innerHTML =
        `
            <flex-row class="centered">
                <medium-title>
                    Semester ${semesterNum}
                </medium-title>
            </flex-row>
            <div class="jsRowHolderTarget defaultMargin themeBorder"
                style="border-top-width: 2px; border-left-width: 2px;">
            </div>
        `
    }

    addRow(data){
        var background;
        if (this.bgAlternator % 2 == 0){
            background = "themeFrontBG";
        }
        else{
            background = "themeBackBG";
        }
        this.bgAlternator += 1;
        
        var tgt = document.createElement("local-data-row-component");
        tgt.initialize(data, background, this.useAltComponent);
        this.getElementsByClassName("jsRowHolderTarget")[0].append(tgt);

        tgt.setFilter(this.currentFilter);
        this.checkState();
        tgt.subscribeToStateChange(() => {this.checkState()});

        return tgt;
    }

    getSemesterNum(){
        return ML.getIntAttribute(this, "semester-number")
    }

    hide(){
        $(this).css("display", "none");
    }
    show(){
        $(this).css("display", "block");
    }

    hideAll(){
        $(this.getElementsByClassName("jsRowHolderTarget")[0].children).each(function(){
            this.hide();
        });
        this.hide();
    }

    filter(fitlerString){
        $(this.getElementsByClassName("jsRowHolderTarget")[0].children).each(function(){
            this.setFilter(fitlerString);
        });

        this.checkState();
    }

    checkState(){
        // If nothing is being displayed we hide the semester as well.
        let meMyself = this;
        let hideSelf = true;
        $(this.getElementsByClassName("jsRowHolderTarget")[0].children).each(function(){
            if (hideSelf && !this.isHidden())
            {
                meMyself.show();
                hideSelf = false;
            }
        });

        if (hideSelf){
            meMyself.hide();
        }
    }
}

customElements.define('local-semester-container-component', LocalSemesterContainer);

class LocalDataRowContainer extends HTMLElement {
    constructor() {
        super();
    }

    filter = "";
    isShowable = true;

    stateChangeSubscriberFuncs = [];

    initialize(data, background, useAltComponent = false){
        let component = useAltComponent ? "alt-flex-row-eq-wrap-component" : "flex-row-eq-wrap-component"
        
        this.innerHTML =
        `
            <${component} class="${background} glowOnHover glowOnFocus
                themeBorderChildren noTopAndLeftBorderForChildren growChildren centeredChildren"
                data-min-element-size-px="200" data-element-gap-px="0"
                tabindex="0">

                <div class="centeredText">${data.course}</div>
                <div>${data.ects}</div>
                <div>${data.lectures}</div>
                <div>${data.exercises}</div>
                <div>${data.hours}</div>
                <div>${data.type}</div>
            </${component}>
        `
    }

    subscribeToStateChange(func){
        this.stateChangeSubscriberFuncs.push(func);
    }
    notifyStateChanged(){
        $(this.stateChangeSubscriberFuncs).each(function(){
          this();
        });
    }

    isHidden(){
        return ($(this).css("display") == "none");
    }

    setFilter(filter){
        this.filter = filter;
        this.checkFilter();
    }
    checkFilter(){
        if (this.isShowable && this.children[0].children[0].innerText.indexOf(this.filter) > -1)
            $(this).css("display", "block");
        else
            $(this).css("display", "none");
    }

    // These two funcs should be the only ones called externally
    hide(){
        this.isShowable = false;
        $(this).css("display", "none");
        this.notifyStateChanged();
    }
    show(){
        this.isShowable = true;
        this.checkFilter();
        this.notifyStateChanged();
    }
}

customElements.define('local-data-row-component', LocalDataRowContainer);

class alternateEqualFlexWrap extends equalFlexWrap {
    balanceDisplay() {
        super.balanceDisplay();
        if (this.childrenAmountPerRow <= 1){
            let first = true;

            $(this.children).each(function() {
                if (first){
                    first = false;
                }else{
                    $(this).css("display", "none")
                }
            });
        }else{
            $(this.children).each(function() {
                $(this).css("display", "flex")
            });
        }
    }
}

customElements.define('alt-flex-row-eq-wrap-component', alternateEqualFlexWrap);
