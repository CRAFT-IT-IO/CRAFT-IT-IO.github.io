$(function() {
        if(window.innerWidth > 800){
            $.scrollify({
                section : "section",
                easing: "easeOutExpo",
                sectionName : "section",
                scrollbars: false,
                scrollSpeed: 2500
            });
            // $.scrollify.instantMove("#home");
        }

    $('.btn-descubre').click(function(){
            $.scrollify.move("#home-2");
            let cards = $('.card').not('.animated');
            if(cards.length == 0)
                return;

            for(let i = 0; i < cards.length; i++){
                let card = cards[i];
                let left = i % 2 == 0 ? '5%' : '15%';
                $(card).animate({left: left }, (i + 1) * 1500);
            }
            $(cards).addClass('animated');
    });

    $('.header .logo').click(function(){
            $.scrollify.move("#home");
    });
});


