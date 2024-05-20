// Init at bottom

/* ---------------------------------------- FUNCTIONS ---------------------------------------- */

/*
Lit-html tag override so they don't throw errors
Should probably be removed in production, but it's largely harmless
(jquery's html() is called on a selector, so there is no conflict)
*/
function html(str){return str};

// I don't want to ever deal with function conflicts, so we're shoving everything into ML (no affiliation with machine learning)
class ML{
  constructor() {
      throw new Exception("What are you doing?");
  }

  static tokenChangeSubscriberFuncs = []; // These contain functions we need to call when the appropriate trigger is activated
  static tokenExpiredSubscriberFuncs = [];
  static tokenTimeout = null; // Holds the timeout ID which we can use to delete the timer when not necessary

  static themeChangeSubscriberFuncs = [];
  
  static chapterObserver= null;
  static animationObserverActiveElements = [];
  
  static imageLoadArray = [];

  // https://stackoverflow.com/questions/9333379/check-if-an-elements-content-is-overflowing
  static isOverflown(element) {
    return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
  }
  static isOverflownRow(element) {
    return element.scrollWidth > element.clientWidth;
  }

  // https://stackoverflow.com/questions/5646279/get-object-class-from-string-name-in-javascript/53199720#53199720
  // Ceremcem's answer (heavily modified), should be more secure than just using eval. Optimisations removed. Regex more strict. Purpose altered.
  static interrogatePrerequisite(stringName){
    var result = false;

    // Proceed only if the name is a single word string
    if (stringName.match(/^[a-zA-Z]+$/)) {
      result = eval(`${stringName}.ready()`);
    } else {
      // Safety triggered
      throw new Error("Who let the dogs out?");
    }

    return result;
  }

  static interrogatePrerequisites(stringNames){
    $(stringNames).each(function(){
      try{
        if(!ML.interrogatePrerequisite(this)){
          console.warn(`Prerequisite script (${this}) reports bad init!`);
        }
      }catch(ex){
        console.warn("Prerequisite scripts may be missing, or you might be loading them after the check is running!");
        console.warn(ex);
      }
    });
  }

  // Force loading so images which are usually hidden don't get aborted and end up having to wait for a video or something when they actually want to get displayed
  static loadImage(path){
    var img = new Image();
    img.src = path;
    ML.imageLoadArray.push(img);
  }

  static doLateLoad(){
    document.querySelectorAll('.lateLoad').forEach(function(element) {
      element.src = ML.getStringAttribute(element, "lateload-src"); // I'll make you load last if it's the last thing I do!
    });
  }

  static setBooleanAttribute(element, attribute, inputBoolean){
    element.setAttribute("data-" + attribute, inputBoolean ? "y" : "n")
  }
  static getBooleanAttribute(element, attribute){
    if (element.getAttribute("data-" + attribute) == "y") return true;
    return false;
  }

  static setIntAttribute(element, attribute, input){
    element.setAttribute("data-" + attribute, input)
  }
  static getIntAttribute(element, attribute){
    var result = element.getAttribute("data-" + attribute);
    return Boolean(result) ? Number(result) : null;
  }

  static setStringAttribute(element, attribute, input){
    element.setAttribute("data-" + attribute, input)
  }
  static getStringAttribute(element, attribute){
    return element.getAttribute("data-" + attribute);
  }

  /* -------------------- THEME LOGIC -------------------- */

  static initTheme(){
    ML.subscribeToThemeChange(ML.updateTheme);
    ML.updateTheme();
  }

  static getSystemTheme(){
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return "dark";
    }
    return "light";
  }

  static getCurrentTheme(){
    let result = localStorage.getItem("theme")

    if(result == null || result =="auto"){
      return ML.getSystemTheme();
    }
  }

  static setCurrentTheme(theme){
    localStorage.setItem("theme", theme);
    ML.notifyThemeChanged();
  }

  static updateTheme(){
    $(document.documentElement).attr("data-theme", ML.getCurrentTheme())
  }

  static subscribeToThemeChange(funct){
    ML.tokenChangeSubscriberFuncs.push(funct);
  }

  static notifyThemeChanged(){
    $(ML.tokenChangeSubscriberFuncs).each(function(){
      this();
    });
  }

  /* -------------------- CHAPTER ANIMATIONS TAKE 2 -------------------- */

  static initChapterAnims(){
    const observerOptions = {
      treshold: [0, 0.0001, 0.1] // If it's just 0 we can get no intersect even when the element comes into view.
    };

    var observerCallback = (entries, observer) => {
      entries.forEach((entry) => {
        const index = ML.animationObserverActiveElements.indexOf(entry.target);

        if (entry.isIntersecting) {
          if (index < 0) {
            ML.animationObserverActiveElements.push(entry.target);
          }
        }else{
          if (index > -1) { // https://stackoverflow.com/questions/5767325/how-can-i-remove-a-specific-item-from-an-array-in-javascript
            ML.animationObserverActiveElements.splice(index, 1);
          }
        }
      });
    };

    ML.chapterObserver = new IntersectionObserver(observerCallback, observerOptions);
    $(".jsLogicElementAnimationTarget").each(function(){
      ML.chapterObserver.observe(this);
    });

    ML.animateElements();
  }

  // We want the chapters to animate into view from the moment they get into view to the moment that they intersect with the center of the display
  // Okay, I might just make the middle 50% of the display a full anim instead, I think it will look better
  // If they are too small to intersect with the center, we'll just have to set their transition to follow how much of them is currently visible
  static animateElements(){
    requestAnimationFrame(ML.animateElements);

    let scrollPosition = window.pageYOffset;
    let documentHeight = $("body").height();
    let viewportHeight = $(window).height();

    for (let index = 0; index < ML.animationObserverActiveElements.length; index++) {
      const element = ML.animationObserverActiveElements[index];
      
      let rect = element.getBoundingClientRect(); // relative to viewport

      let fullTopDistance = rect.top + scrollPosition;
      let fullBottomDistance = documentHeight - (rect.bottom + scrollPosition);

      if ((rect.height + fullTopDistance) < (viewportHeight / 2)) { // can't reach middle from top
        let visibility = rect.bottom / rect.height;
        visibility = ((visibility > 1) ? 1 : visibility);
        ML.animateElement(element, visibility, true);
        continue;
      }

      if ((rect.height + fullBottomDistance) < (viewportHeight / 2)) { // can't reach middle from bottom
        let visibility = (viewportHeight - rect.top) / rect.height;
        visibility = ((visibility > 1) ? 1 : visibility);
        ML.animateElement(element, visibility, false);
        continue;
      }

      if(rect.bottom < (viewportHeight / 2)){ // we are above the middle
        let visibility = rect.bottom / (viewportHeight / 2);
        ML.animateElement(element, visibility, true);
        continue;
      }

      if(rect.top > (viewportHeight / 2)){ // we are below the middle
        let visibility = (rect.top - (viewportHeight / 2)) / (viewportHeight / 2);
        ML.animateElement(element, 1 - visibility, false);
        continue;
      }

      ML.animateElement(element, 1, null);
    }
  }

  // Sometimes the simple solution is fine (and doesn't give you a headache!)
  static animateElement(element, visibility, isAbove){
    $(element).css("opacity", `${visibility}`);
  }

  /* -------------------- TYPEWRITER ANIMATION -------------------- */

  // This is kind of a mess, but it does work
  static initTypewriterAnims(){
    $(".jsLogicTypewriterTarget").each(function(){
      var rowList = [];
      var rowsActual = [];

      var rowDelay = ML.getIntAttribute(this, "typewriter-row-delay-ms");
      if(rowDelay == null){
        rowDelay = 800;
      }

      var elementDelay = ML.getIntAttribute(this, "typewriter-letter-delay-ms");
      if(elementDelay == null){
        elementDelay = 100;
      }

      var rows = this.getElementsByClassName("jsTypewriterRowTarget");

      // Collect all elements we need to show in one list per row and make sure their display is correct
      $(rows).each(function(){
        var rowElements = [];
        $(this).css("display", "flex");

        $(this).children().each(function(){
          if(this.classList.contains("jsTypewriterWordTarget")){ // This element is just a container for the things we actually need to show
            $(this).css("display", "flex");

            $(this).children().each(function(){
              $(this).css("display", "none");
              rowElements.push(this);
            });
          }else{ // This element is not a container and will be treated as a letter we need to display
            $(this).css("display", "none");
            rowElements.push(this)
          }
        });

        rowsActual.push(this);
        rowList.push(rowElements);
      });

      ML.typewriterHandleRow(rowsActual, rowList, 0, rowDelay, elementDelay)
    });
  }

  static typewriterHandleRow(rowsActual, rowArray, rowProgress, rowDelay, elementDelay, consoleMimic){
    if(rowProgress >= rowArray.length){
      return;
    }

    if(consoleMimic != null){
      $(consoleMimic).css("display", "none");
    }
    var temp = document.createElement("console-mimic");
    rowsActual[rowProgress].append(temp);

    consoleMimic = document.createElement("console-mimic-anim");
    $(consoleMimic).css("display", "none");
    rowsActual[rowProgress].append(consoleMimic);
    
    var finished = () => {
      setTimeout(() => ML.typewriterHandleRow(rowsActual, rowArray, rowProgress + 1, rowDelay, elementDelay, consoleMimic), rowDelay);
      $(temp).css("display", "none");
      $(consoleMimic).css("display", "flex");
    };

    if(rowArray[rowProgress].constructor === Array){
      setTimeout(() => ML.typewriterHandleElement(rowArray[rowProgress], 0, elementDelay, finished), elementDelay);
      return;
    }

    finished();
  }

  static typewriterHandleElement(elementArray, elementProgress, elementDelay, exitCallback){
    if(elementProgress >= elementArray.length){
      exitCallback();
      return;
    }

    $(elementArray[elementProgress]).css("display", "flex");
    setTimeout(() => ML.typewriterHandleElement(elementArray, elementProgress + 1, elementDelay, exitCallback), elementDelay);
  }

  /* -------------------- ACCESS TOKEN -------------------- */

  static subscribeToAccessTokenChange(funct){
    ML.tokenChangeSubscriberFuncs.push(funct);
  }

  static notifyAccessTokenChanged(){
    $(ML.tokenChangeSubscriberFuncs).each(function(){
      this();
    });
  }

  static subscribeToAccessTokenExpired(funct){
    ML.tokenExpiredSubscriberFuncs.push(funct);
  }

  static notifyTokenExpired(){
    $(ML.tokenExpiredSubscriberFuncs).each(function(){
      this();
    });
  }

  static setAccessToken(accessToken){
    // If multiple logins were attempted we want to ignore all but the first one.
    if(Boolean(ML.getAccessToken())){
      return;
    }
    ML.forceSetAccessToken(accessToken);
  }

  static forceSetAccessToken(accessToken){
    sessionStorage.setItem("accessToken", accessToken);
    ML.notifyAccessTokenChanged();
  }

  static getAccessToken(){
    return sessionStorage.getItem("accessToken");
  }

  static removeAccessToken(){
    ML.forceSetAccessToken("");
  }

  // https://stackoverflow.com/questions/38552003/how-to-decode-jwt-token-in-javascript-without-using-a-library
  static parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  }

  // https://stackoverflow.com/questions/9456138/how-can-i-get-seconds-since-epoch-in-javascript
  static getSecondsSinceEpoch(){
    return Math.ceil( Date.now() / 1000 )
  }

  static checkTokenTimeout(){
    if(ML.tokenTimeout !== null){
      clearTimeout(ML.tokenTimeout);
      ML.tokenTimeout = null;
    }

    var accessToken = ML.getAccessToken();
    if (Boolean(accessToken)) {
      var tokenExpiration = ML.parseJwt(accessToken)["exp"] - ML.getSecondsSinceEpoch();
      ML.tokenTimeout = setTimeout(ML.notifyTokenExpired, tokenExpiration * 1000);
    }
  }
    
}

/* ---------------------------------------- INIT ---------------------------------------- */

// https://stackoverflow.com/questions/13637223/how-do-you-make-a-div-tabbable (awokeKnowing's answer, slightly modified to avoid depreciated methods)
$(document).on('keydown',function(e){
  if(Boolean(this.activeElement) && (e.code=="Enter" || e.code=="Space") && this.activeElement.hasAttribute("tabindex")){
    $(this.activeElement).click();
    e.preventDefault();
  }
});

ML.subscribeToAccessTokenExpired(ML.removeAccessToken);
ML.subscribeToAccessTokenChange(ML.checkTokenTimeout);
ML.checkTokenTimeout();

ML.loadImage("../res/jquery-ui-1.13.2.custom/images/ui-icons_ffffff_256x240.png");

// Runs once everything (external resources included) are loaded
window.addEventListener('load', ML.doLateLoad, false);

$(document).ready(function(){
  ML.initChapterAnims();
  ML.initTypewriterAnims();
  ML.initTheme();
});

