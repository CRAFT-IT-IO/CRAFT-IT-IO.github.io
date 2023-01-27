$(function() {
    initScrollify(
        {
            // before : beforeScrollifyHomePage,
            afterRender : function () {
                let currentSection = $.scrollify.current();
                scrollifyScrollAnimation = currentSection[0].clientHeight < currentSection[0].scrollHeight
            }
        }, 'home', 'section');

});