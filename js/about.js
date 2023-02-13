$(document).ready(function () {
    $('.content-image').find('*').css('opacity', 0);
    var dream = $('.dream');
    var draft = $('.draft');
    var it = $('.it');
    var craft = $('.craft');

    var speedShow = 800;
    var speedHide = speedShow * 0.75;
    var delay = speedShow * 0.75;

    var animationIT = function (callback) {
        let it = $('.it');
        it.animate({ 'opacity': 1 }, speedShow / 2, function () {
            setTimeout(function () {
                callback();
                it.animate({ 'opacity': 0 }, speedHide);
            }, delay);
        });
    }

    var hideElement = function (elt) { elt.animate({ 'opacity': 0 }, speedHide); };
    var animation = function () {
        dream.animate({ 'opacity': 1 }, speedShow * 0.7, function () {
            animationIT(function () {
                hideElement(dream);
                draft.animate({ 'opacity': 1 }, speedShow, function () {
                    animationIT(function () {
                        hideElement(draft);
                        craft.animate({ 'opacity': 1 }, speedShow, function () {
                            animationIT(function () {
                                var intro = $('div.intro');
                                craft.animate({ 'opacity': 0 }, speedHide, function () {
                                    intro.animate({ 'opacity': 0 }, speedHide, function () { intro.remove(); });
                                    $('section').first().addClass('section-animated');
                                });
                            });
                        });
                    });
                });
            });
        });
    }

    animation();
});