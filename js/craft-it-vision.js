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
        }, 'home', 'section.craft-it');

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

    checkVisibilityNextButton(index, sections, currentSection);
    refreshSelectedSection(currentSection, index);

    return true;
}