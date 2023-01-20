var scrollifyCallBacks = { };
function initScrollify(callbacks, mainPage, section){
    $.scrollify({
        section : section + '', // convert to string otherwise it thinks it is an object.
        sectionName : "section", // [data-section]
        scrollbars: false,
        scrollSpeed: 1500,
        easing: "easeOutExpo",
        standardScrollElements : '.section-container, .dots',
        before: scrollifyBefore,
        after: callbacks.after,
        afterResize: callbacks.afterResize,
        afterRender: callbacks.afterRender
    });
    scrollifyCallBacks = callbacks;
    $.scrollify.move('#' + mainPage);
}

$(window).on('wheel', function(e){
    let currentSection = $.scrollify.current();
    let currentSectionName = $.scrollify.current().data('section');

    console.log('current section : ' + currentSectionName);

    if(!currentSection.is('.section-container'))
    return;

    let delta = getDelta(e);
    subSectioncrolling(delta > 0 ? 0 : 2, currentSection, true);
});

function getDelta(e){
    let  value;
    if (e.originalEvent) {
        value = e.originalEvent.wheelDelta || -e.originalEvent.deltaY || -e.originalEvent.detail;
    } else {
        value = e.wheelDelta || -e.deltaY || -e.detail;
    }

    return Math.max(-1, Math.min(1, value));
}

function scrollifyBefore(index, sections){
    let currentSection = sections[index];
    let sectionName = currentSection.attr('data-section');

    if(scrollifyCallBacks.before && typeof scrollifyCallBacks.before === 'function')
        scrollifyCallBacks.before(index, sections);

    refreshSelectionDotMenuItem(sectionName);
    refreshSelectedSection(currentSection, index);

    if(currentSection.is('.section-container'))
        subSectioncrolling(index, currentSection, false);

    return true;
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

/* Scrollify */
var isScrolling = false;
function subSectioncrolling(indexToDisplay, currentSection, changeSelection){
    if(isScrolling)   return;

    isScrolling = true;
    let subSectionIndex = 1;
    let displayNextElt = indexToDisplay > subSectionIndex;
    let subSections = currentSection.find('.sub-section');
    let nbSections = subSections.length;

    if(nbSections == 0)
        return;

    let selectedSubSection = subSections.filter('.selected');
    let currentSubSectionIndex = 0;

    if(selectedSubSection.length == 0) {
        selectedSubSection = $(subSections[0]);
        selectedSubSection.addClass('selected');
        displayNextElt = true;
        currentSubSectionIndex = 1
    }else{
        currentSubSectionIndex = subSections.index(selectedSubSection) + 1;
    }
    if(changeSelection)
        displayNextElt ? ++currentSubSectionIndex : --currentSubSectionIndex;

    if(currentSubSectionIndex > 0 && currentSubSectionIndex <= nbSections) {
        selectedSubSection.removeClass('selected');
        selectedSubSection = $(subSections[currentSubSectionIndex - 1]);
        selectedSubSection.addClass('selected');
    }
    else{
        currentSubSectionIndex <= 0 ? $.scrollify.previous() : $.scrollify.next();
        isScrolling = false;
        return;
    }
    if(changeSelection) {
        let topPosition = (currentSubSectionIndex - 1) * -20;
        let container = currentSection.find('.sub-section-container');

        // fake animate because transform property doesn't work with animate
        container.animate({  top: topPosition + '%'}, {
            duration: 1000
        });
    }

    subSections.find('*').css('opacity', 0.1);
    subSections.find('img').css('opacity', 0);

    selectedSubSection.find('*').not('img').animate(
        {
            'opacity': 1
        }, 1000, function() {
            if(currentSubSectionIndex != 1)
                isScrolling = false;
        });

    selectedSubSection.find('img').animate(
        {
            'opacity': 1
        }, 2000, function() {
            isScrolling = false;
        });
}


function redirect(page){
    let overlay = $('.overlay');
    if(overlay.length == 0){
        overlay = $('<div></div>', { class: 'overlay' });
    }

    overlay.removeClass('hide');
    overlay.css({
        'left' : '-100%',
        'display' : 'block',
        'background-color' : 'white',
        'z-index' : 99999
    });

    overlay.animate({ left: 0 }, 1000, function(){
        window.location.href = page;
    });
}

$(function() {
    let copyright = $('.footer-copyright');
    copyright.text(new Date().getFullYear());

    $('.btn-next-page').on('click', function(){
        $.scrollify.next();
    });
});

