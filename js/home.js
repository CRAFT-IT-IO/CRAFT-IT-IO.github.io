$(function() {
    $('.header-logo .logo').click(function(){
        $.scrollify.move("#home");
    });

    initScrollifyHome();
});

/* Scrollify */
function initScrollifyHome(){
    initScrollify(
        {
            before : beforeScrollifyHomePage,
            afterRender : function () {
                refreshSelectedSection($.scrollify.current(), $.scrollify.currentIndex());
            }
        }, 'home', 'section');

    checkFirstAnimation();
}

function checkFirstAnimation(){
    let hash = window.location.hash;
    let isHome = hash == '' ||hash == '#home';

    if(!isHome)
        return;

    let items = $('.btn-next-page, .dots');
    setTimeout(function(){
        items.show();
    }, 6000);

    items.hide();
}

function checkVisibilityNextButton(currentIndex, sections){
    let lastPageIndex = sections.length - 1;
    let currentSection = sections [currentIndex];
    let nextIcon = $('.btn-next-page');

    nextIcon.find('i').removeClass('colorBlack');
    if(currentIndex != 0) {
        let backgroundColor = currentSection.css('background-color');
        if (backgroundColor == 'rgba(0, 0, 0, 0)' ||
            backgroundColor == 'white')
            nextIcon.find('i').addClass('colorBlack');
    }

    currentIndex == lastPageIndex ? nextIcon.hide() : nextIcon.show();
}

function checkvisibilityLogo(sectionIndex){
    let logo = $('.header-logo .logo');
    if(sectionIndex == 0){
        if(logo.is(':visible'))
        {
            logo.css('left', '0');
            logo.animate({ left : '50%'}, 250, function (){
                logo.hide();
            });
        }
    }else{
        if(!logo.is(':visible'))
        {
            logo.css('left', '50%');
            logo.show();
            logo.animate({ left : 0}, 1000);
        }
    }
}

function beforeScrollifyHomePage(index, sections){
    let currentSection = sections[index];

    checkVisibilityNextButton(index, sections, currentSection);
    checkvisibilityLogo(index);

    return true;
}