/**
 * menu.js - Handles all menu related stuff
 */

/**
 * scaleAndPositionButtons()
 *
 * Scales buttons in relations to screen
 * size and positions buttons in the middle
 * of the screen.
 *
 * Input arguments:
 * none
 *
 * Return values:
 * none
 */
function positionMenuElement(id) {
outputDebugInfo();

    switch(id){
    case 'menu':
        $('#'+ id).css({
                           position:'absolute',
                           left: perc2pix(($(window).width()  - $('#menu').width()), gMenuPercPosX),
                           top:  perc2pix(($(window).height() - $('#menu').height()), gMenuPercPosY)
                       });
        $('#'+ id).offset({
                              left: perc2pix(($(window).width()  - $('#menu').width()), gMenuPercPosX),
                              top:  perc2pix(($(window).height() - $('#menu').height()), gMenuPercPosY)
                          });
        break;
    case 'impressum':
        $('#'+ id).css({
                           position:'absolute',
                           left: perc2pix(($(window).width()  - $('#menu').width()), gImpressumPercPosX),
                           top:  perc2pix(($(window).height() - $('#menu').height()), gImpressumPercPosY)
                       });

        $('#'+ id).offset({
                              left: perc2pix(($(window).width()  - $('#menu').width()), gImpressumPercPosX),
                              top:  perc2pix(($(window).height() - $('#menu').height()), gImpressumPercPosY)
                          });
        break;
    case 'credits_page':
        $('#'+ id).css({
                           position:'absolute',
                           left: perc2pix(($(window).width()  - $('#menu').width()), gCreditsPercPosX),
                           top:  perc2pix(($(window).height() - $('#menu').height()), gCreditsPercPosY)
                       });
        $('#'+ id).offset({
                              left: perc2pix(($(window).width()  - $('#menu').width()), gCreditsPercPosX),
                              top:  perc2pix(($(window).height() - $('#menu').height()), gCreditsPercPosY)
                          });
        break;
    case 'demo_page':
        $('#'+ id).css({
                           position:'absolute',
                           left: perc2pix(($(window).width()  - $('#menu').width()), gDemoPercPosX),
                           top:  perc2pix(($(window).height() - $('#menu').height()), gDemoPercPosY)
                       });
        $('#'+ id).offset({
                              left: perc2pix(($(window).width()  - $('#menu').width()), gDemoPercPosX),
                              top:  perc2pix(($(window).height() - $('#menu').height()), gDemoPercPosY)
                          });
        break;
    }
}

function showImpressum(){
outputDebugInfo();

    positionMenuElement('impressum');
    $("div[id*='impressum']").css('visibility','visible');
    $("div[id*='menu']").css('visibility','hidden');
//    $("div[id*='credits_page']").css('visibility','hidden');
}

function showCredits(){
outputDebugInfo();

    positionMenuElement('credits_page');
    $("div[id*='credits']").css('visibility','visible');
    $("div[id*='menu']").css('visibility','hidden');
//    $("div[id*='impressum']").css('visibility','hidden');
}

function showDemo(){
outputDebugInfo();

    $(this).css('background-color', 'black');
    positionMenuElement('demo_page');
    $("div[id*='demo_page']").css('visibility','visible');
}


function hideImpressum(){
outputDebugInfo();

    $("div[id*='impressum']").css('visibility','hidden');
    $("div[id*='menu']").css('visibility','visible');
}

function hideCredits(){
outputDebugInfo();

    $("div[id*='credits_page']").css('visibility','hidden');
    $("div[id*='menu']").css('visibility','visible');
}

function hideDemo(){
outputDebugInfo();

    $("div[id*='demo_page']").css('visibility','hidden');
    this.document.location.href = 'http://hermes.et.hs-wismar.de/~bmt08055/netzwerkstar/html/index.html';
}

$(window).resize(function(){positionMenuElement('menu');});

