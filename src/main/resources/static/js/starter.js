let ADMIN_ROLE= "Admin";
let MODERATOR_ROLE= "Glossateur";
let USER_ROLE= "Utilisateur";
let MAX_LEVEL= 3;
let DELEGATED_AUTH= false;
let OPEN_REGISTRATION = false;

var request = new XMLHttpRequest();
request.open('GET', '/api/config', false);
request.send(null);

if (request.status === 200) {
    let data = JSON.parse(request.responseText);
    ADMIN_ROLE= data.adminRole;
    MODERATOR_ROLE= data.moderatorRole;
    USER_ROLE= data.userRole;
    MAX_LEVEL= data.maxContextLevel;
    DELEGATED_AUTH= data.delegatedAuth;
    OPEN_REGISTRATION= data.openRegistration;
}

//footer
function onElementHeightChange(elm, callback){
    let lastHeight = 0;

    (function run(){
        let newHeight = elm.clientHeight;
        if( lastHeight !== newHeight )
            callback();
        lastHeight = newHeight;

        if (elm.onElementHeightChangeTimer)
            clearTimeout(elm.onElementHeightChangeTimer);

        elm.onElementHeightChangeTimer = setTimeout(run, 200);
    })();
}


onElementHeightChange(document.body, function(){
    if(document.body.clientHeight<window.innerHeight-150){
        let foo = document.getElementById("footer").clientHeight;
        let a =window.innerHeight-document.body.clientHeight-foo+40;
        document.getElementById("footer").setAttribute("style", "margin-top: "+a+"px !important");
    } else if(document.body.clientHeight-35>window.innerHeight){
        document.getElementById("footer").setAttribute("style", "margin-top: 0px !important");
    }
});

window.onresize = function(){
    if(document.body.clientHeight<window.innerHeight-150){
        let foo = document.getElementById("footer").clientHeight;
        let a =window.innerHeight-document.body.clientHeight-foo+40;
        document.getElementById("footer").setAttribute("style", "margin-top: "+a+"px !important");
    } else if(document.body.clientHeight-35>window.innerHeight){
        document.getElementById("footer").setAttribute("style", "margin-top: 0px !important");
    }
};