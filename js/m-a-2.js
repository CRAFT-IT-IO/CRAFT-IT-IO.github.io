$(function() {
    /* redirect*/
    $('.find-out').on('click', function(){
        redirect('/pages/bespoken-solution.html');
    });

    $('.header-logo .logo').click(function(){
        $.scrollify.move("#home");
    });

    initScrollifyHome();

    $('html').css('overflow', 'hidden');
    $('body').css('overflow', 'unset');
    // $('.last-ignore').each(function(i, item){
    //     let height = $(item).height();
    //     viewHeight = $('body')[0].clientHeight;
    //     $(item).css('padding-bottom', (viewHeight - height) + 'px');
    // });
});

var isScrolling = false;
$(window).on('wheel', function(e){

    let sections = $('.craft-it');
    let firstSection = sections[0];
    let lastSection = sections[sections.length - 1];
    let currentSection = sections.filter('.section-animated');
    if(currentSection.length == 0)
        currentSection = firstSection;
    let currentSectionName = $(currentSection).data('section');
    let currentIndex = sections.index(currentSection);
    console.log('CURRENT : ' + currentSectionName);

    var value;
    if (e.originalEvent) {
        value = e.originalEvent.wheelDelta || -e.originalEvent.deltaY || -e.originalEvent.detail;
    } else {
        value = e.wheelDelta || -e.deltaY || -e.detail;
    }

    let newSection = currentSection;
    var delta = Math.max(-1, Math.min(1, value));
    let plus = 0;
    if(delta < 0){
        if(currentIndex >= 0 && currentIndex < sections.length -1) {
            newSection = sections[currentIndex + 1];
            let nextIndex = sections.index(newSection);
            let nextIsLastIgnore = false;
            if (nextIndex < sections.length) {
                nextIsLastIgnore = $(sections[nextIndex + 1]).is('.last-ignore');
                if(nextIsLastIgnore){
                    plus = ($('body')[0].clientHeight + $(sections[nextIndex + 1]).height()) - $(sections[nextIndex + 1]).position().top;
                    // plus = ;
                }
            }
        }
    }else{
        if(currentIndex > 0){
            newSection = sections[--currentIndex];
        }
    }

    if(isScrolling)
        return;

    isScrolling = true;
    $('body').animate({
        top: -($(newSection).position().top - plus)
    }, 1000, function(){
        $(currentSection).removeClass('section-animated');
        $(newSection).addClass('section-animated');
        isScrolling = false;
    });
});
/* Scrollify */
function initScrollifyHome(){
    // initScrollify('[data-section="home-part-2"], .dots',
    //     {
    //         before : beforeScrollifyHomePage,
    //         afterRender : function () {
    //             refreshSelectedSection($.scrollify.current(), $.scrollify.currentIndex());
    //         }
    //     }, 'home', 'section.craft-it, div.craft-it');
    //
    // checkFirstAnimation();

    $('.btn-next-page').on('click', function(){
        $.scrollify.next();
    });

    $('.craft-it').first().addClass('section-animated');
}

function checkFirstAnimation(){
    let hash = window.location.hash;
    let isHome = hash == '' ||hash == '#home';

    if(!isHome)
        return;

    let items = $('.btn-next-page, .dots');
    refreshBackColorNextbutton($.scrollify.currentIndex(), -1, $.scrollify.current());
    setTimeout(function(){
        items.show();
    }, 6000);

    items.hide();
}

function checkVisibilityNextButton(currentIndex, sections){
    let lastPageIndex = sections.length - 1;
    let currentSection = sections [currentIndex];

    refreshBackColorNextbutton(currentIndex, sections.length - 1, currentSection);
}

function refreshBackColorNextbutton(currentIndex, lastPageIndex, currentSection) {
    let nextIcon = $('.btn-next-page');
    nextIcon.find('i').removeClass('colorBlack');
    let backgroundColor = currentSection.css('background-color');
    if (backgroundColor == 'rgba(0, 0, 0, 0)' ||
        backgroundColor == 'white')
        nextIcon.find('i').addClass('colorBlack');

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

function beforeScrollifyHomePage(index, sections){
    let currentSection = sections[index];
    let sectionName = currentSection.attr('data-section');

    checkVisibilityNextButton(index, sections, currentSection);
    refreshSelectionDotMenuItem(sectionName);
    refreshSelectedSection(currentSection, index);

    return false;
    // if(index == 1)
    //     home2Scrolling(index, currentSection, false);

    return true;
}