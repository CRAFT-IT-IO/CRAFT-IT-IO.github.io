
function initScrollify(dontScrollOnElementsSelector, callbacks, mainPage, section){
    $.scrollify({
        section : section + '', // convert to string otherwise it thinks it is an object.
        sectionName : "section", // [data-section]
        scrollbars: false,
        scrollSpeed: 1500,
        easing: "easeOutExpo",
        // interstitialSection : '.ignore',
        standardScrollElements : dontScrollOnElementsSelector,
        before: callbacks.before,
        after: callbacks.after,
        afterResize: callbacks.afterResize,
        afterRender: callbacks.afterRender
    });

    $.scrollify.move('#' + mainPage);
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
});

