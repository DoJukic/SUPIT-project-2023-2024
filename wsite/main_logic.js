/* ---------------------------------------- INIT ---------------------------------------- */

var tokenChangeSubscriberFuncs = [];
var tokenExpiredSubscriberFuncs = [];
var tokenTimeout = null;

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

/*
function setBooleanAttribute(element, attribute, inputBoolean){
  element.setAttribute("data-" + attribute, inputBoolean ? "y" : "n")
}
function getBooleanAttribute(element, attribute){
  if (element.getAttribute("data-" + attribute) == "y") return true;
  return false;
}
*/

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
