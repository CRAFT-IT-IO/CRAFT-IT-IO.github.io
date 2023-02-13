$(function() {
    $('.header-logo .logo').click(function(e){
        $.scrollify.move("#1");
        e.preventDefault();
        e.stopPropagation();
    });

    setTimeout(function () {
        addDotsMenu(5);
        addNextPageButton();
    }, 5000);

    initScrollifyHome();
});

/* Scrollify */
function initScrollifyHome(){
    initScrollify(
        {
             before : beforeScrollifyHomePage,
            afterRender : function () {
                // refreshSelectedSection($.scrollify.current(), $.scrollify.currentIndex());
            }
        }, 'home', 'section');
}


function checkVisibilityNextButton(currentIndex, sections) {
    let lastPageIndex = sections.length - 1;
    let nextIcon = $('.btn-next-page');

    currentIndex == lastPageIndex ? nextIcon.hide() : nextIcon.show();
}

function checkvisibilityLogo(sectionIndex) {
    let logo = $('.header-logo .logo');
    if (sectionIndex == 0) {
        if (logo.is(':visible')) {
            logo.css('left', '0');
            logo.animate({ left: '50%' }, 250, function () {
                logo.hide();
            });
        }
    } else {
        if (!logo.is(':visible')) {
            logo.css('left', '50%');
            logo.show();
            logo.animate({ left: 0 }, 1000);
        }
    }
}

function beforeScrollifyHomePage(index, sections) {
    let currentSection = sections[index];

    checkVisibilityNextButton(index, sections, currentSection);
    checkvisibilityLogo(index);

    let items = $('.dots, .btn-next-page, .hamburger');
    items.removeClass(['black', 'blue', 'white']);
    switch (currentSection.data('section').toString()) {
        case '2':
            items.addClass('white');
            break;
        case '3':
            items.addClass('black');
            break;
        case '4':
            items.addClass('blue');
            break;
    }

    return true;
}