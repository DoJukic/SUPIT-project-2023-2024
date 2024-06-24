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
            <flex-row class="centered defaultMargin noTopOrBotMargin noSideMargin defaultPaddingHalf themeFrontBG themeBorder onlyBotBorder jsCollapsibleTrigger"
                style="user-select: none;">

                <medium-title>
                    Semester ${semesterNum}
                </medium-title>

                <div style="width: 10px;"></div>

                <div class="glowOnFocus"
                    style="width: 1em; height: 1em;"
                    tabindex=0>

                    <div class="ui-icon ui-theme ui-icon-caret-1-w rotate90LeftOnTrigger rotate90LeftOnTriggerTriggered jsCollapsibleIconTarget"></div>
                </div>
            </flex-row>
            <div class="jsCollapsibleTarget"
                style="width: 100%; overflow: hidden;">

                <div class="defaultPadding onlyTopPadding"></div>
                
                <div class="jsRowHolderTarget defaultMarginDouble noTopMargin themeBorder"
                    style="border-top-width: 2px; border-left-width: 2px;">
                </div>

                <div class="themeBorder onlyBotBorder"></div>
            </div>
            <collapsible-logic-component></collapsible-logic-component>
        `
    }

    addRow(data){
        var tgt = document.createElement("local-data-row-component");
        tgt.initialize(data, this.useAltComponent);
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

    assignBackgrounds(){
        this.bgAlternator = 0;

        let meMyself = this;
        
        $(this.getElementsByClassName("jsRowHolderTarget")[0].children).each(function(){
            if ($(this).css("display") == "none"){
                return;
            }

            let background = "";

            if (meMyself.bgAlternator % 2 == 0){
                background = "themeFrontBG";
            }
            else{
                background = "themeBG";
            }
            meMyself.bgAlternator += 1;

            this.classList = background;
        });
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
            return;
        }

        this.assignBackgrounds();
    }
    
    getTotals(){
        let result = {
            totalAmount: 0,
            totalEcts: 0,
            totalLectures: 0,
            totalExercises: 0,
            totalHours: 0,
        }

        $(this.getElementsByClassName("jsRowHolderTarget")[0].children).each(function(){
            if ($(this).css("display") == "none")
                return;

            let rowResult = this.getValues();

            result.totalAmount += 1;
            result.totalEcts += rowResult.ects;
            result.totalLectures += rowResult.lectures;
            result.totalExercises += rowResult.exercises;
            result.totalHours += rowResult.hours;
        });

        return result;
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

    initialize(data, useAltComponent = false){
        let componentType = useAltComponent ? "alt-flex-row-eq-wrap-component" : "flex-row-eq-wrap-component"
        
        this.innerHTML =
        `
            <${componentType} class="glowOnHover glowOnFocus
                themeBorderChildren noTopAndLeftBorderForChildren growChildren centeredChildren"
                data-min-element-size-px="200" data-element-gap-px="0"
                tabindex="0">

                <div class="courseName centeredText">${data.course}</div>
                <div class="ectsAmount">${data.ects}</div>
                <div class="lecturesAmount">${data.lectures}</div>
                <div class="exercisesAmount">${data.exercises}</div>
                <div class="hoursAmount">${data.hours}</div>
                <div class="typeName">${data.type}</div>
            </${componentType}>
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
        if (this.isShowable && this.children[0].children[0].innerText.toLowerCase().indexOf(this.filter.toLowerCase()) > -1)
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

    getValues(){
        let result = {
            ects: (Number)(this.getElementsByClassName("ectsAmount")[0].innerText),
            lectures: (Number)(this.getElementsByClassName("lecturesAmount")[0].innerText),
            exercises: (Number)(this.getElementsByClassName("exercisesAmount")[0].innerText),
            hours: (Number)(this.getElementsByClassName("hoursAmount")[0].innerText),
        }

        return result;
    }
}

customElements.define('local-data-row-component', LocalDataRowContainer);

class alternateEqualFlexWrap extends equalFlexWrap {
    // Override
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

class collapsibleLogicController extends equalFlexWrap {
    constructor() {
        super();
    }

    triggerClass = "jsCollapsibleTrigger";
    targetClass = "jsCollapsibleTarget";
    iconClass = "jsCollapsibleIconTarget";

    iconTransformClass = "rotate90LeftOnTriggerTriggered"; // defined in curriculum.html

    trigger = null;
    target = null;
    icon = null;

    animationLocked = false;

    connectedCallback() {
        this.trigger = this.parentElement.getElementsByClassName(this.triggerClass)[0];
        this.target = this.parentElement.getElementsByClassName(this.targetClass)[0];
        this.icon = this.parentElement.getElementsByClassName(this.iconClass)[0];

        $(this.trigger).css("cursor", "pointer");

        let meMyself = this;

        $(meMyself.icon).removeClass(meMyself.iconTransformClass);
        $(meMyself.target).css("max-height", "0px");
        // if inert is true, we will not tab through child elements
        meMyself.target.setAttribute("inert", "true")

        ML.attachSmartClickListener(meMyself.trigger, function(){
            if ($(meMyself.target).css("max-height") == "0px"){
                if (meMyself.startAnimReveal(400)){
                    $(meMyself.icon).addClass(meMyself.iconTransformClass);
                    meMyself.target.removeAttribute("inert");
                }
            }else{
                if (meMyself.startAnimHide(300)){
                    $(meMyself.icon).removeClass(meMyself.iconTransformClass);
                    // if inert is true, we will not tab through child elements
                    meMyself.target.setAttribute("inert", "true");
                }
            }
        });
    }

    startAnimReveal(duration){
        if (this.animationIsLocked())
            return false;
        this.lockAnimation();

        let meMyself = this;

        collapsibleLogicController.animReveal(this.target, ML.getMilisecondsSinceEpoch(), ML.getMilisecondsSinceEpoch() + duration,
        function(){
            meMyself.unlockAnimation();
            $(meMyself.target).css("max-height", "");
        });

        return true;
    }

    static animReveal(element, startTimeMS, endTimeMS, callback){
        let targetHeight = ML.getHeightFromChildren(element);

        let timePassed = ML.getMilisecondsSinceEpoch() - startTimeMS;
        let timePassedFactor = timePassed / (endTimeMS - startTimeMS);

        if (timePassedFactor >= 1){
            $(element).css("max-height", (String)(targetHeight) + "px");
            callback();
            return;
        }
        
        let resultingHeight = targetHeight * Math.log10(timePassedFactor * 100 + 1) / 2;

        $(element).css("max-height", (String)(resultingHeight) + "px");

        requestAnimationFrame(() => collapsibleLogicController.animReveal(element, startTimeMS, endTimeMS, callback));
    }

    startAnimHide(duration){
        if (this.animationIsLocked())
            return false;
        this.lockAnimation();

        let meMyself = this;

        collapsibleLogicController.animHide(this.target, ML.getMilisecondsSinceEpoch(), ML.getMilisecondsSinceEpoch() + duration, ML.getHeightFromChildren(this.target),
        function(){
            meMyself.unlockAnimation();
            $(meMyself.target).css("max-height", "0px");
        });

        return true;
    }

    static animHide(element, startTimeMS, endTimeMS, startHeight, callback){

        let timePassed = ML.getMilisecondsSinceEpoch() - startTimeMS;
        let timePassedFactor = timePassed / (endTimeMS - startTimeMS);

        if (timePassedFactor >= 1){
            callback();
            return;
        }
        
        let resultingHeight = startHeight - startHeight * Math.log10(timePassedFactor * 100 + 1) / 2;

        $(element).css("max-height", (String)(resultingHeight) + "px");

        requestAnimationFrame(() => collapsibleLogicController.animHide(element, startTimeMS, endTimeMS, startHeight, callback));
    }

    animationIsLocked(){
        return this.animationLocked;
    }
    lockAnimation(){
        this.animationLocked = true;
    }
    unlockAnimation(){
        this.animationLocked = false;
    }
}

customElements.define('collapsible-logic-component', collapsibleLogicController);
