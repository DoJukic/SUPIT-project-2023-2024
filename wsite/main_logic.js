/* ---------------------------------------- INIT ---------------------------------------- */

var tokenChangeSubscriberFuncs = []; // These contain functions we need to call when the appropriate trigger is activated
var tokenExpiredSubscriberFuncs = [];
var tokenTimeout = null; // Holds the timeout ID which we can use to delete the timer when not necessary

var chapterObserver= null;
var chapterObserverActiveElements = [];

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
      console.warn("Prerequisite scripts may be missing.");
      console.warn(ex);
    }
  });
}

// Force loading so images usually hidden don't get aborted and end up having to wait for a video or something to get displayed
function loadImage(path){
  console.log(path);
  var img = new Image();
  img.src = path;
  imageLoadArray.push(img)
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

/* -------------------- CHAPTER ANIMATIONS -------------------- */

$(document).ready(function(){
  var observerOptions = {
    treshold: [0.0001] // If it's just 0 we can get no intersect even when the element comes into view.
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

    var rows = this.getElementsByClassName("typewriterEffectRow");

    $(rows).each(function(){
      var rowElements = [];
      $(this).css("display", "flex");

      $(this).children().each(function(){
        if(this.classList.contains("typewriterEffectWord")){
          $(this).css("display", "flex");

          $(this).children().each(function(){
            $(this).css("display", "none");
            rowElements.push(this);
          });
        }else{
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

function typewriterHandleRow(rowsActual, rowArray, rowProgress, rowDelay, elementDelay, killMe){
  if(rowProgress >= rowArray.length){
    return;
  }

  if(killMe != null){
    $(killMe).css("display", "none");
  }
  var temp = document.createElement("console-mimic");
  rowsActual[rowProgress].append(temp);

  killMe = document.createElement("console-mimic-anim");
  $(killMe).css("display", "none");
  rowsActual[rowProgress].append(killMe);
  
  var finished = () => {
    setTimeout(() => typewriterHandleRow(rowsActual, rowArray, rowProgress + 1, rowDelay, elementDelay, killMe), rowDelay);
    $(temp).css("display", "none");
    $(killMe).css("display", "flex");
  }; // The world, at my fingertips

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
