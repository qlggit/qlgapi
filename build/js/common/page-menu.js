$(function(){
    var $sidebarMenu = $('.sidebar-menu');
    $sidebarMenu.find('.sub-menu a').click(function(){
        if($(this).hasClass('active'))return false;
        $sidebarMenu.find('.sub-menu a').removeClass('active');
        $(this).addClass('active');
    });
    $('.sidebar-toggle-box').click(function(){

    });
});