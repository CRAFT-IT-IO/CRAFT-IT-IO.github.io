$(function() {
    /* redirect*/
    $('.find-out').on('click', function(){
        redirect('/pages/bespoken-solution.html');
    });

    $('.header-logo .logo').click(function(){
        $.scrollify.move("#home");
    });

    initScrollifyHome();
});

/* Scrollify */
var isScrolling = false;
function home2Scrolling(indexToDisplay, currentSection, changeSelection){
    if(isScrolling)   return;

    isScrolling = true;
    let indexTitlesSection = 1;
    let displayNextElt = indexToDisplay > indexTitlesSection;
    let titles = currentSection.find('div.title');
    let nbTitles = titles.length;
    let selectedTitle = titles.filter('.selected');
    let currentTitleNumber = 0;

    if(selectedTitle.length == 0) {
        selectedTitle = titles.filter('.title-1');
        selectedTitle.addClass('selected');
        displayNextElt = true;
        currentTitleNumber = 1
    }else{
        currentTitleNumber = selectedTitle.data('title');
    }
    if(changeSelection)
        displayNextElt ? ++currentTitleNumber : --currentTitleNumber;

    if(currentTitleNumber > 0 && currentTitleNumber <= nbTitles) {
        selectedTitle.removeClass('selected');
        selectedTitle = titles.filter('[data-title="' + currentTitleNumber + '"]');
        selectedTitle.addClass('selected');
    }
    else{
        currentTitleNumber <= 0 ? $.scrollify.previous() : $.scrollify.next();
        isScrolling = false;
        return;
    }
    if(changeSelection) {
        let topPosition = (currentTitleNumber - 1) * -20;
        let container = currentSection.find('.container-home-part-2');

        // fake animate because transform property doesn't work with animate
        container.animate({  top: topPosition + '%'}, {
            duration: 1000
        });
    }

    titles.find('*').css('opacity', 0.1);
    titles.find('img').css('opacity', 0);

    selectedTitle.find('*').not('img').animate(
        {
            'opacity': 1
        }, 1000, function() {
            if(currentTitleNumber != 1)
                isScrolling = false;
        });

    if(currentTitleNumber == 1) {
        selectedTitle.find('img').animate(
            {
                'opacity': 1
            }, 2000, function() {
                isScrolling = false;
            });
    }
}
$(window).on('wheel', function(e){
    let currentSection = $.scrollify.current();
    let currentSectionName = $.scrollify.current().data('section');

    console.log('CURRENT : ' + currentSectionName);

    if(currentSectionName == 'home-part-2') {
        var value;
        if (e.originalEvent) {
            value = e.originalEvent.wheelDelta || -e.originalEvent.deltaY || -e.originalEvent.detail;
        } else {
            value = e.wheelDelta || -e.deltaY || -e.detail;
        }

        var delta = Math.max(-1, Math.min(1, value));
        home2Scrolling(delta > 0 ? 0 : 2, currentSection, true);
    }
});
/* Scrollify */
function initScrollifyHome(){
    initScrollify('[data-section="home-part-2"], .dots',
        {
            before : beforeScrollifyHomePage,
            afterRender : function () {
                refreshSelectedSection($.scrollify.current(), $.scrollify.currentIndex());
            }
        }, 'home', 'section');

    checkFirstAnimation();

    $('.btn-next-page').on('click', function(){
        $.scrollify.next();
    });
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

function refreshSelectionDotMenuItem(sectionName){
    $('.dot').removeClass('active');
    $('.dot[data-menu="' + sectionName +'"]').addClass('active');
}

function refreshSelectedSection(currentSection, currentIndex){
    if(currentIndex == 0)
        currentSection.addClass('animated');

    $('.section-animated').removeClass('section-animated');
    currentSection.addClass('section-animated');
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
    let sectionName = currentSection.attr('data-section');

    checkVisibilityNextButton(index, sections, currentSection);
    refreshSelectionDotMenuItem(sectionName);
    refreshSelectedSection(currentSection, index);
    checkvisibilityLogo(index);

    if(index == 1)
        home2Scrolling(index, currentSection, false);

    return true;
}