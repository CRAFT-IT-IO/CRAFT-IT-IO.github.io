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

function initScrollifyHome(){
    initScrollify(null,
        {
            before : beforeScrollifyHomePage,
            afterRender : function () {

            }
        }, 'home', 'section');


    $('.btn-next-page').on('click', function(){
        $.scrollify.next();
    });
}

function beforeScrollifyHomePage(index, sections){
    let currentSection = sections[index];
    let sectionName = currentSection.attr('data-section');

    // checkVisibilityNextButton(index, sections, currentSection);
    // refreshSelectionDotMenuItem(sectionName);
    // refreshSelectedSection(currentSection, index);
    // checkvisibilityLogo(index);
    //
    // if(index == 1)
    //     home2Scrolling(index, currentSection, false);

    return true;
}