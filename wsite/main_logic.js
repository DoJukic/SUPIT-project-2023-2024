// https://stackoverflow.com/questions/13637223/how-do-you-make-a-div-tabbable (awokeKnowing's answer, slightly modified to avoid depreciated methods and side effects)
$(document).on('keydown',function(e){
  if(Boolean(this.activeElement) && (e.code=="Enter" || e.code=="Space") && this.activeElement.hasAttribute("tabindex")){
    $(this.activeElement).click();
    e.preventDefault();
  }
});

startFunc()

/* ---------------------------------------- FUNCTIONS ---------------------------------------- */

/*
Lit-html tag override so they don't throw errors
Should probably be removed in production, but it's largely harmless
(jquery's html() is called on a selector, so there is no conflict)
*/
function html(s){return s};

// https://stackoverflow.com/questions/9333379/check-if-an-elements-content-is-overflowing
function isOverflown(element) {

  return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
}

//
function isOverflownRow(element) {

  return element.scrollWidth > element.clientWidth;
}

/* -------------------- ACCESS TOKEN -------------------- */

//Access token: Once set, reload site. Once loaded, read its expiration and set a timer for auto-logout.
function setAccessToken(accessToken){
  sessionStorage.setItem("accessToken", accessToken);
  window.location.reload();
}

function getAccessToken(){
  return sessionStorage.getItem("accessToken");
}

function removeAccessToken(){
  setAccessToken("");
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

/* -------------------- STARTUP -------------------- */

function startFunc(){
  var accessToken = getAccessToken();
  if (Boolean(accessToken)) {
    var tokenExpiration = parseJwt(accessToken).get("exp") - getSecondsSinceEpoch();
    setTimeout(removeAccessToken(), tokenExpiration * 1000);
  }
}