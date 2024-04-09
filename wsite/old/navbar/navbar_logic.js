var navBarInitialized = false;
var navBarIsCollapsible = false;
var navBarCollapsibleIsHidden = true;

// Has to be relative to the folder we're loading into, which is always /wsite (at least in this project, and unless something has gone horribly wrong)
// This is here because we have to swap them out when pressed. Ideally, we'd have some sort of animation as well.
var navBarCollapsibleImgMenuPath = '/../res/img/navbar/icons8.com-hamburger-menu-50-white.png';
var navBarCollapsibleImgXPath = '/../res/img/navbar/X-symbol-white.png';

// The navbar flex starts looking off at a bit below this
var navBarTargetWidth = 950;

// Main logic
$(window).on('resize', function(){
    navBarSizeLogic();
});

navBarSizeLogic();

function navBarSizeLogic(){

    if ((!navBarIsCollapsible || !navBarInitialized) && $(window).width() < navBarTargetWidth) {
        navBarInitialized = true;

        navBarIsCollapsible = true;
        navBarCollapsibleIsHidden = true;

        navBarLoadHamburger();
        
    }else if((navBarIsCollapsible || !navBarInitialized) && $(window).width() >= navBarTargetWidth){
        navBarInitialized = true;
        navBarIsCollapsible = false;

        navBarLoadNormal();
    }
}

function navBarLoadHamburger(){
    /* Load() is async, so we must use its callback functionality */
    $('#navBar').load('navbar/navbar_hamburger.html', function(){
        document.getElementById('navBarCollapsibleTrigger').addEventListener('click', function(){
            navBarCollapsibleToggle();
        });
        $('#navBarCollapsibleNavElement').css('display', 'none');
        $('#navBarCollapsibleImg').attr("src", navBarCollapsibleImgMenuPath);

        finalizeNavBarLoad();
    });
}

function navBarLoadNormal(){
    $('#navBar').load('navbar/navbar.html', finalizeNavBarLoad);
}

// Just makes sure the buttons do what they're supposed to do
function finalizeNavBarLoad(){
    navBarCheckCurriculumAccess();
    
    $("#javascriptLogInTarget").on('click', function(){
        showLogin();
    });
    $("#javascriptLogOutTarget").on('click', function(){
        setCookie('accessCode', '', -1);
        location.reload();
    });
}

var navBarCollapsibleIsBusy = false;

function navBarCollapsibleToggle(){

    if (navBarCollapsibleIsBusy) {
        // Button spamming breaks things otherwise, and we don't really want that
        return;
    }

    navBarCollapsibleIsBusy = true;

    if (navBarCollapsibleIsHidden) {
        $('#navBarCollapsibleImg').attr("src", navBarCollapsibleImgXPath);
        $('#navBarCollapsibleNavElement').slideDown(500, function() { 
            navBarCollapsibleIsBusy = false;
        });
    }else{
        $('#navBarCollapsibleImg').attr("src", navBarCollapsibleImgMenuPath);
        $('#navBarCollapsibleNavElement').slideUp(500, function() { 
            navBarCollapsibleIsBusy = false;
        });
    }
    navBarCollapsibleIsHidden = !navBarCollapsibleIsHidden;
}

function navBarCheckCurriculumAccess(){

    if (Boolean(getAccessCode())) {
        $('.navBarHideCurriculum').each(function(){$(this).css('display', 'none')});
        $('.navBarShowCurriculum').each(function(){$(this).css('display', 'flex')});
        return true;
    }
    $('.navBarHideCurriculum').each(function(){$(this).css('display', 'flex')});
    $('.navBarShowCurriculum').each(function(){$(this).css('display', 'none')});

    return false;
}