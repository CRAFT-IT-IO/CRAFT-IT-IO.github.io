$(document).ready(function () {
    var trigger = $('.hamburger'),
        overlay = $('.overlay'),
        isClosed = false;

    trigger.click(function () {
        hamburger_cross();
    });

    function hamburger_cross() {
        if (isClosed == true) {
            overlay.hide();
            trigger.removeClass('is-open');
            trigger.addClass('is-closed');
            isClosed = false;
        } else {
            overlay.show();
            trigger.removeClass('is-closed');
            trigger.addClass('is-open');
            isClosed = true;
        }
    }

    $('[data-toggle="offcanvas"]').click(function () {
        $('#wrapper').toggleClass('toggled');
    });

    // dot menu
    $('[data-menu]:not(#btn-ag)').click(function(){
        var sec = $(this).data('menu');
        if(window.innerWidth > 800){
            $('.dot').removeClass('active');
            $(this).addClass('active');
            $.scrollify.move('#'+sec);
        } else {
            $(this).addClass('active');
            $('html, body').animate({scrollTop: ($('[data-section='+sec+']').offset().top)}, 1000);
            $('.toggle-menu').removeClass('active');
            $('.main-nav').slideUp();
        }
    });

});