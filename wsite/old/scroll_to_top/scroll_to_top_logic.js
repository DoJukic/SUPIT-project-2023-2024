var targetElement;
const targetClass = "observerReportsNavbarInvisible";

var scrollToTopIntersectionObserver

$('#scrollToTop').load('scroll_to_top/scroll_to_top.html', function(){
    $(window).on('resize', function(){
        scrollToTopCheckHeight();
    });
    scrollToTopCheckHeight();

    targetElement = $("#scrollToTopImage")
    targetElement.on("click", function(){
        if(targetElement.hasClass(targetClass)){
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }else{
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }
    })

    scrollToTopIntersectionObserver = new IntersectionObserver((entries) => {
        $(entries).each(function(){
            // If intersectionRatio is 0, the target is out of view (unless it is not, but we don't talk about that)

            if (this.intersectionRatio <= 0){
                targetElement.addClass(targetClass);
                return;
            }
            targetElement.removeClass(targetClass);
        });
    }, {threshold: [0, 0.1],}); // two values prevent failure state where observer reports 0 after scrolling up
    
    scrollToTopIntersectionObserver.observe(document.getElementById("navBar"));
});



function scrollToTopCheckHeight(){
    if ($("body").height() - 200 > $(window).height()) {
        $('#scrollToTop').css("display", "flex");
        return;
    }
    $('#scrollToTop').css("display", "none");

}