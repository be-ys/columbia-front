//Activation popover et tooltip
$(function () {
    $('[data-toggle="popover"]').popover()
});
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
});


//KonamiCode
jQuery(function(){
    var kKeys=[];
    function Kpress(e){
        kKeys.push(e.keyCode);
        if(kKeys.toString().indexOf("38,38,40,40,37,39,37,39,66,65")>=0){

            clippy.load('Clippy', function(agent) {
                // Do anything with the loaded agent
                agent.show();
                $('html,body').scrollTop(0);
                agent.play("Congratulate");
                agent.speak("Félicitations ! Vous venez de trouver un des easter-eggs de Columbia !");
                setTimeout(function(){agent.hide();}, 10000);
            });
            jQuery(this).unbind('keydown',Kpress);
        }
    }
    jQuery(document).keydown(Kpress)
});
