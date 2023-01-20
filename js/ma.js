$(function() {
    /* redirect*/
    $('.find-out').on('click', function(){
        redirect('/pages/bespoken-solution.html');
    });

    $('.header-logo .logo').click(function(){
        $.scrollify.move("#home");
    });
debugger;
    initScrollifyHome();
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


function beforeScrollifyHomePage(index, sections){
    let currentSection = sections[index];
    let sectionName = currentSection.attr('data-section');

    checkVisibilityNextButton(index, sections, currentSection);

    refreshSelectedSection(currentSection, index);

    return false;
    // if(index == 1)
    //     home2Scrolling(index, currentSection, false);

    return true;
}