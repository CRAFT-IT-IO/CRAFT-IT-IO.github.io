$(document).ready(function () {
    if($.scrollify == undefined)
        return;

    $(document).on('click', 'div.dots [data-menu]', function(){
        $('div.dots .dot').removeClass('active');
        var sectionName = $(this).data('menu');
        $(this).addClass('active');

        $.scrollify.move('#'+sectionName);
    });
});