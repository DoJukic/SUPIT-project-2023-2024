/* ---------------------------------------- INIT ---------------------------------------- */

var tokenChangeSubscriberFuncs = []; // These contain functions we need to call when the appropriate trigger is activated
var tokenExpiredSubscriberFuncs = [];
var tokenTimeout = null; // Holds the timeout ID which we can use to delete the timer when not necessary

var chapterObserver= null;
var animationObserverActiveElements = [];

var imageLoadArray = [];

// https://stackoverflow.com/questions/13637223/how-do-you-make-a-div-tabbable (awokeKnowing's answer, slightly modified to avoid depreciated methods)
$(document).on('keydown',function(e){
  if(Boolean(this.activeElement) && (e.code=="Enter" || e.code=="Space") && this.activeElement.hasAttribute("tabindex")){
    $(this.activeElement).click();
    e.preventDefault();
  }
});

subscribeToAccessTokenExpired(removeAccessToken);
subscribeToAccessTokenChange(checkTokenTimeout);
checkTokenTimeout();

loadImage("../res/jquery-ui-1.13.2.custom/images/ui-icons_ffffff_256x240.png");

// Runs once everything (external resources included) are loaded
window.addEventListener('load', 
  function() { 
    doLateLoad();
  }, false);

/* ---------------------------------------- FUNCTIONS ---------------------------------------- */

/*
Lit-html tag override so they don't throw errors
Should probably be removed in production, but it's largely harmless
(jquery's html() is called on a selector, so there is no conflict)
*/
function html(str){return str};

// https://stackoverflow.com/questions/9333379/check-if-an-elements-content-is-overflowing
function isOverflown(element) {
  return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
}
function isOverflownRow(element) {
  return element.scrollWidth > element.clientWidth;
}

// https://stackoverflow.com/questions/5646279/get-object-class-from-string-name-in-javascript/53199720#53199720
// Ceremcem's answer (heavily modified), should be more secure than just using eval. Optimisations removed. Regex more strict. Purpose altered.
function interrogatePrerequisite(stringName){
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

function interrogatePrerequisites(stringNames){
  $(stringNames).each(function(){
    try{
      if(!interrogatePrerequisite(this)){
        console.warn(`Prerequisite script (${this}) reports bad init!`);
      }
    }catch(ex){
      console.warn("Prerequisite scripts may be missing, or you might be loading them after the check is running!");
      console.warn(ex);
    }
  });
}

// Force loading so images which are usually hidden don't get aborted and end up having to wait for a video or something when they actually want to get displayed
function loadImage(path){
  var img = new Image();
  img.src = path;
  imageLoadArray.push(img);
}

function doLateLoad(){
  document.querySelectorAll('.lateLoad').forEach(function(element) {
    element.src =  getStringAttribute(element, "lateload-src"); // I'll make you load last if it's the last thing I do!
  });
}

function setBooleanAttribute(element, attribute, inputBoolean){
  element.setAttribute("data-" + attribute, inputBoolean ? "y" : "n")
}
function getBooleanAttribute(element, attribute){
  if (element.getAttribute("data-" + attribute) == "y") return true;
  return false;
}

function setIntAttribute(element, attribute, input){
  element.setAttribute("data-" + attribute, input)
}
function getIntAttribute(element, attribute){
  var result = element.getAttribute("data-" + attribute);
  return Boolean(result) ? Number(result) : null;
}

function setStringAttribute(element, attribute, input){
  element.setAttribute("data-" + attribute, input)
}
function getStringAttribute(element, attribute){
  return element.getAttribute("data-" + attribute);
}

/* -------------------- CHAPTER ANIMATIONS -------------------- */
/*
$(document).ready(function(){
  var observerOptions = {
    treshold: [0.0001]
  };

  var observerCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        $(entry.target).addClass("fadeInSimple");
        observer.unobserve(entry.target);
      }
    });
  };

  chapterObserver = new IntersectionObserver(observerCallback, observerOptions);
  $(".jsLogicChapterAnimationTarget").each(function(){
    chapterObserver.observe(this);
  });
});
*/
/* -------------------- CHAPTER ANIMATIONS TAKE 2 -------------------- */

$(document).ready(function(){
  const observerOptions = {
    treshold: [0, 0.0001, 0.1] // If it's just 0 we can get no intersect even when the element comes into view.
  };

  var observerCallback = (entries, observer) => {
    entries.forEach((entry) => {
      const index = animationObserverActiveElements.indexOf(entry.target);

      if (entry.isIntersecting) {
        if (index < 0) {
          animationObserverActiveElements.push(entry.target);
        }
      }else{
        if (index > -1) { // https://stackoverflow.com/questions/5767325/how-can-i-remove-a-specific-item-from-an-array-in-javascript
          animationObserverActiveElements.splice(index, 1);
        }
      }
    });
  };

  chapterObserver = new IntersectionObserver(observerCallback, observerOptions);
  $(".jsLogicElementAnimationTarget").each(function(){
    chapterObserver.observe(this);
  });

  animateElements();
});

// We want the chapters to animate into view from the moment they get into view to the moment that they intersect with the center of the display
// Okay, I might just make the middle 50% of the display a full anim instead, I think it will look better
// If they are too small to intersect with the center, we'll just have to set their transition to follow how much of them is currently visible
function animateElements(){
  requestAnimationFrame(animateElements);

  let scrollPosition = window.pageYOffset;
  let documentHeight = $("body").height();
  let viewportHeight = $(window).height();

  for (let index = 0; index < animationObserverActiveElements.length; index++) {
    const element = animationObserverActiveElements[index];
    
    let rect = element.getBoundingClientRect(); // relative to viewport

    let fullTopDistance = rect.top + scrollPosition;
    let fullBottomDistance = documentHeight - (rect.bottom + scrollPosition);

    if ((rect.height + fullTopDistance) < (viewportHeight / 2)) { // can't reach middle from top
      let visibility = rect.bottom / rect.height;
      let factor = 1 - visibility;
      factor = ((factor > 1) ? 1 : factor);
      animateElement(element, factor, true);
      continue;
    }

    if ((rect.height + fullBottomDistance) < (viewportHeight / 2)) { // can't reach middle from bottom
      let visibility = (viewportHeight - rect.top) / rect.height;
      let factor = 1 - visibility;
      factor = ((factor > 1) ? 1 : factor);
      animateElement(element, factor, false);
      continue;
    }

    if(rect.bottom < (viewportHeight / 2)){ // we are above the middle
      let progress = rect.bottom / (viewportHeight / 2);
      animateElement(element, 1 - progress, true);
      continue;
    }

    if(rect.top > (viewportHeight / 2)){ // we are below the middle
      let progress = (rect.top - (viewportHeight / 2)) / (viewportHeight / 2);
      animateElement(element, progress, false);
      continue;
    }

    animateElement(element, 0, null);
  }
}

// If factor is negative transform up, otherwise transform down
// Map to max 0.5 and min -0.5
/*
0 is no anim
0.5 is scale to half, opacity to half, and transformY down just enough to account for the scale
-0.5 is scale to half, opacity to half, and transformY up just enough to account for the scale
In between is linear
*/
function animateElement(element, factor, isAbove){
  
  $(element).css("opacity", `${1 - factor}`);
  //$(element).css("transform", `translateX(${factor * 100}px)`);

  return;

  //factor = factor * 0.5;

  let factorSign = factor < 0 ? -1 : 1;

  let factorScale = 1 - Math.abs(factor);
  
  let factorTransform = 1 - factorScale;
  
  let rect = element.getBoundingClientRect();

  $(element).css("transform", `translateY(${factorTransform * factorSign * rect.height}px) scale(${factorScale})`);
  $(element).css("opacity", `${factorScale}`);
}

/* -------------------- TYPEWRITER ANIMATION -------------------- */

// This is kind of a mess, but it does work
$(document).ready(function(){
  $(".jsLogicTypewriterTarget").each(function(){
    var rowList = [];
    var rowsActual = [];

    var rowDelay = getIntAttribute(this, "typewriter-row-delay-ms");
    if(rowDelay == null){
      rowDelay = 800;
    }

    var elementDelay = getIntAttribute(this, "typewriter-letter-delay-ms");
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

    typewriterHandleRow(rowsActual, rowList, 0, rowDelay, elementDelay)
  });
});

function typewriterHandleRow(rowsActual, rowArray, rowProgress, rowDelay, elementDelay, consoleMimic){
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
    setTimeout(() => typewriterHandleRow(rowsActual, rowArray, rowProgress + 1, rowDelay, elementDelay, consoleMimic), rowDelay);
    $(temp).css("display", "none");
    $(consoleMimic).css("display", "flex");
  };

  if(rowArray[rowProgress].constructor === Array){
    setTimeout(() => typewriterHandleElement(rowArray[rowProgress], 0, elementDelay, finished), elementDelay);
    return;
  }

  finished();
}

function typewriterHandleElement(elementArray, elementProgress, elementDelay, exitCallback){
  if(elementProgress >= elementArray.length){
    exitCallback();
    return;
  }

  $(elementArray[elementProgress]).css("display", "flex");
  setTimeout(() => typewriterHandleElement(elementArray, elementProgress + 1, elementDelay, exitCallback), elementDelay);
}

/* -------------------- ACCESS TOKEN -------------------- */

function subscribeToAccessTokenChange(funct){
  tokenChangeSubscriberFuncs.push(funct);
}

function notifyAccessTokenChanged(){
  $(tokenChangeSubscriberFuncs).each(function(){
    this();
  });
}

function subscribeToAccessTokenExpired(funct){
  tokenExpiredSubscriberFuncs.push(funct);
}

function notifyTokenExpired(){
  $(tokenExpiredSubscriberFuncs).each(function(){
    this();
  });
}

function setAccessToken(accessToken){
  // If multiple logins were attempted we want to ignore all but the first one.
  if(Boolean(getAccessToken())){
    return;
  }
  forceSetAccessToken(accessToken);
}

function forceSetAccessToken(accessToken){
  sessionStorage.setItem("accessToken", accessToken);
  notifyAccessTokenChanged();
}

function getAccessToken(){
  return sessionStorage.getItem("accessToken");
}

function removeAccessToken(){
  forceSetAccessToken("");
}

// https://stackoverflow.com/questions/38552003/how-to-decode-jwt-token-in-javascript-without-using-a-library
function parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

// https://stackoverflow.com/questions/9456138/how-can-i-get-seconds-since-epoch-in-javascript
function getSecondsSinceEpoch(){
  return Math.ceil( Date.now() / 1000 )
}

function checkTokenTimeout(){
  if(tokenTimeout !== null){
    clearTimeout(tokenTimeout);
    tokenTimeout = null;
  }

  var accessToken = getAccessToken();
  if (Boolean(accessToken)) {
    var tokenExpiration = parseJwt(accessToken)["exp"] - getSecondsSinceEpoch();
    tokenTimeout = setTimeout(notifyTokenExpired, tokenExpiration * 1000);
  }
}
