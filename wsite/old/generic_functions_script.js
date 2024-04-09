var gfsLoginNeeded = false;

// https://www.w3schools.com/js/js_cookies.asp
function setCookie(cname, cvalue, exhours) {
    const d = new Date();
    d.setTime(d.getTime() + (exhours*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

function saveAccessCode(accessCode){
  setCookie("accessCode", accessCode, 0.1); //6 minutes for a relatively strict inactivity logout
}

function getAccessCode(){
  return getCookie("accessCode");
}

function refreshAccessCode(){
  var accessCode = getAccessCode();

  if (!Boolean(accessCode)) {
    return;
  }

  saveAccessCode(accessCode);
}

function deleteAccessCode(){
  setCookie("accessCode", "", -0.1);
}

function reportLogInRequired(){
  gfsLoginNeeded = true;
}

function destructiveReadIsLogInRequired(){
  var response = gfsLoginNeeded;
  gfsLoginNeeded = false;
  return Boolean(response);
}