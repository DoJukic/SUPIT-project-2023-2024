/* ---------------------------------------- INIT ---------------------------------------- */

var tokenChangeSubscriberFuncs = []; // These contain functions we need to call when the appropriate trigger is activated
var tokenExpiredSubscriberFuncs = [];
var tokenTimeout = null; // Holds the timeout ID which we can use to delete the timer when not necessary

var chapterObserver= null;
var chapterObserverActiveElements = [];

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
      console.warn("Prerequisite scripts may be missing, please include before component.");
      console.warn(ex);
    }
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

/* -------------------- CHAPTER ANIMATIONS -------------------- */

$(document).ready(function(){
  var observerOptions = {
    treshold: [0.0001] // If it's just 0 we can get no intersect even when the element comes into view.
  };

  var observerCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        console.log(entry);
        $(entry.target).addClass("fadeInSimple");
        observer.unobserve(entry);
      }
    });
  };

  chapterObserver = new IntersectionObserver(observerCallback, observerOptions);
  $(".jsLogicChapterAnimationTarget").each(function(){
    chapterObserver.observe(this);
  });
});

/* -------------------- TYPEWRITER ANIMATIONS -------------------- */

$(document).ready(function(){
  $(".jsLogicTypewriterTarget").each(function(){
    var totalDelay = 0;

    var showDelay = getIntAttribute(this, "typewriter-delay-ms");
    if(showDelay == null){
      showDelay = 500;
    }

    var rows = this.getElementsByClassName("typewriterEffect");

    $(rows).each(function(){
      $(this).css("display", "flex");
      $(this).children().each(function(){
        $(this).css("display", "none");
        if(this.classList.contains("typewriterEffectWord")){
          $(this).css("display", "flex");

          $(this).children().each(function(){
            $(this).css("display", "none");

            setTimeout(() => {
              $(this).css("display", "flex");
            }, totalDelay);

            totalDelay += showDelay;
          });

        }else{
          if((this.tagName == "CONSOLE-MIMIC")){
            $(this).css("display", "flex");
          }else{
            $(this).css("display", "none");

            setTimeout(() => {
              $(this).css("display", "flex");
            }, totalDelay);

            totalDelay += showDelay;
          }
        }
      });
    });
  });
})

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
