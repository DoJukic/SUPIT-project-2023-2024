$('#logInPopup').load('login/login.html', function(){

    $('#logInPopup').children().each(function(){ // Should just be one
        $(this).click(function(clickEvent){
            if (clickEvent.target != this) {
                return;
            }
            hideLogin();
        });
    })
});

$('#logInPopup').click(function(e){
    if (e.target != this) {
        return;
    }
    hideLogin();
});

if (destructiveReadIsLogInRequired()) {
    showLogin();
}

function showLogin(){
    $('#logInPopup').css('display', 'flex');
    setLoginTextDefault();
    $('#logInPopup').addClass('fadeInQuick');
    $('#loginFormUsername').focus(); // Can't be in the startup script because of this one
}

function hideLogin(){
    $('#logInPopup').removeClass('fadeInQuick');
    // Not sure what happens here, but the fadeInQuick class breaks jQuery's animation unless we set opacity to 1 beforehand.
    $('#logInPopup').css('opacity', 1);

    $('#logInPopup').animate({
    opacity: 0
    }, 250, function(){
    $(this).css('display', 'none');
    })
}

function setLoginTextDefault(){
    $('#javascriptLogInMsgTarget').text("Log In");
}

function setLoginText(message){
    $('#javascriptLogInMsgTarget').text(message);
}

function tryLogIn(username, password){
    showLogInLoader();
    setLoginTextDefault();
    $.ajax({
        url: "https://www.fulek.com/data/api/user/login",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ "username": username, "password": password }),
        success: function(response) {
            if(response.isSuccess == true) {
                hideLogInLoader();
                // The recieved data doesn't seem to actually tell us when the token expires, so we just use our own login expiration logic until we get a 401 response or something
                saveAccessCode(response.data.token);
                if (navBarCheckCurriculumAccess()){
                    hideLogin();
                    location.reload();
                }
            }
            else {
                hideLogInLoader();
                setLoginText("Log In Failed");
            };
        },
        error: function() {
            hideLogInLoader();
            setLoginText("Connection Failed");
        }
    });
}

function showLogInLoader() {
    $('#javascriptLogInLoaderTarget').css('display', 'flex');
}

function hideLogInLoader() {
    $('#javascriptLogInLoaderTarget').css('display', 'none');
}