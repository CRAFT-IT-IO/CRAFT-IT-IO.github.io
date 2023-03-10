/*
             <div class="content-image">
                <img class="logo-effect" src="images/resources/big_dot.jpeg" alt="Craft-IT logo" />
                <div class="p a"></div>
                <div class="p b"></div>
                <div class="p c"></div>
                <div class="p d"></div>
                <div class="p e"></div>
                <div class="p f"></div>
                <div class="p g"></div>
                <div class="p h"></div>
                <div class="p i"></div>
                <div class="p j"></div>
                <div class="p k"></div>
                <div class="p l"></div>
                <div class="p m"></div>
                <div class="p n"></div>
                <div class="p logo-effect-container" style="display: none;"></div>
            </div>
 */

$.fn.initializeLogoDotEffect = function () {
    let contentImage = $('<div></div>', { class: 'content-image' });
    contentImage.append($('<img></img>', { class: 'logo-effect', src: 'images/resources/big_dot_grey.svg', alt: 'Craft-It Dot Logo' }));

    let displayModel = $(this).data('display-mode');
    if (!displayModel) {
        let parts = generateAlphabet(14);
        for (var i = 0; i < parts.length; i++) {
            contentImage.append($('<div></div>', { class: 'p ' + parts[i] }));
        }
    }

    $(this).append($('<div></div>', { class: 'logo-dot-left'})).append(contentImage);
}

function generateAlphabet(nbLetter) {
    return [...Array(nbLetter)].map((_, i) => String.fromCharCode(i + (97)));
}