// Generic script for convenience and avoiding repetition.
// This kicks off the loading system, which is admittably not very good

var logInScript = document.createElement('script');
logInScript.src = 'login/login_logic.js';

var navBarScript = document.createElement('script');
navBarScript.src = 'navbar/navbar_logic.js';

var footerScript = document.createElement('script');
footerScript.src = 'footer/footer_logic.js';

var scrollToTopScript = document.createElement('script');
scrollToTopScript.src = 'scroll_to_top/scroll_to_top_logic.js';

var head = document.getElementsByTagName("head")[0];

head.appendChild(logInScript);
head.appendChild(navBarScript);
head.appendChild(footerScript);
head.appendChild(scrollToTopScript);

// We obviously don't want to log the person out if they're actively doing things.
document.addEventListener('mousemove', refreshAccessCode);
document.addEventListener('click', refreshAccessCode);
document.addEventListener('scroll', refreshAccessCode);

// https://stackoverflow.com/questions/13637223/how-do-you-make-a-div-tabbable (awokeKnowing's answer, slightly modified to avoid depreciated methods and side effects)
$(document).on('keydown',function(e){
  if(Boolean(this.activeElement) && (e.code=="Enter" || e.code=="Space") && this.activeElement.hasAttribute("tabindex")){
    $(this.activeElement).click();
    e.preventDefault();
  }
});

var theObservables = [];

var navbarIntersectionObserver = new IntersectionObserver((entries) => {

  $(entries).each(function(){
      // If intersectionRatio is 0, the target is out of view
      if (this.intersectionRatio <= 0){
        $(theObservables).each(function(){
          $(this).addClass("observerReportsNavbarInvisible");
        })
          return;
      }
      $(theObservables).each(function(){
        $(this).removeClass("observerReportsNavbarInvisible");
      })
  });
});

navbarIntersectionObserver.observe(document.getElementById("navBar"));

$('.observerOpacityOnNavbar').each(function(){
  theObservables.push(this);
});

/*
$('.observerFadeIn').each(function(){
  theObservables.push(this);
});
*/

// This is fine as long as our target is not loaded in any of the additional scripts. See https://www.youtube.com/watch?v=2IbRtjez6ag .
// I was just overdesigning at this point
/*
var mainIntersectionObserver = new IntersectionObserver((entries) => {

  $(entries).each(function(){
      // If intersectionRatio is 0, the target is out of view
      if (this.intersectionRatio <= 0){
          this.target.classList.remove("observerFadeInReportsVisible");
          return;
      }
      this.target.classList.add("observerFadeInReportsVisible");
  });
});

// start observing
$('.observerFadeIn').each(function(){
  mainIntersectionObserver.observe(this);
});
*/