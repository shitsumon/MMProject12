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
	case 'ende_page':
        $('#'+ id).css({
                           position:'absolute',
                           left: perc2pix(($(window).width()  - $('#menu').width()), gEndePercPosX),
                           top:  perc2pix(($(window).height() - $('#menu').height()), gEndePercPosY)
                       });
        $('#'+ id).offset({
                              left: perc2pix(($(window).width()  - $('#menu').width()), gEndePercPosX),
                              top:  perc2pix(($(window).height() - $('#menu').height()), gEndePercPosY)
                          });
        break;
    }
	
}

//Displays the games 'about' page
function showImpressum(){
outputDebugInfo();

    positionMenuElement('impressum');
    $("div[id*='impressum']").css('visibility','visible');
    $("div[id*='menu']").css('visibility','hidden');
//    $("div[id*='credits_page']").css('visibility','hidden');
}

//Displays the games credits
function showCredits(){
outputDebugInfo();

    positionMenuElement('credits_page');
    $("div[id*='credits']").css('visibility','visible');
    $("div[id*='menu']").css('visibility','hidden');
//    $("div[id*='impressum']").css('visibility','hidden');
}

//Displays the demo page
function showDemo(){
outputDebugInfo();

    $(this).css('background-color', 'black');
    positionMenuElement('demo_page');
    $("div[id*='demo_page']").css('visibility','visible');
}

/*
    Displays the final page, after the
    game has been played through.
*/
function showEnde(){
outputDebugInfo();

    $(this).css('background-color', 'black');
    positionMenuElement('ende_page');
    $("div[id*='ende_page']").css('visibility','visible');
    $("div[id*='ende_page']").css('top','0px');
    $("div[id*='ende_page']").css('left','0px');
	//reloads this same page
	window.setTimeout(function(){location.replace(location.href)}, 30000);
}

//Hides 'about' page
function hideImpressum(){
outputDebugInfo();

    $("div[id*='impressum']").css('visibility','hidden');
    $("div[id*='menu']").css('visibility','visible');
}

//Hides credit page
function hideCredits(){
outputDebugInfo();

    $("div[id*='credits_page']").css('visibility','hidden');
    $("div[id*='menu']").css('visibility','visible');
}

//Hides demo page
function hideDemo(){
outputDebugInfo();

    $("div[id*='demo_page']").css('visibility','hidden');
    this.document.location.href = 'http://hermes.et.hs-wismar.de/~bmt08055/netzwerkstar/html/index.html';
}

//Hides final page
function hideEnde(){
outputDebugInfo();

    $("div[id*='ende_page']").css('visibility','hidden');
    this.document.location.href = 'http://hermes.et.hs-wismar.de/~bmt08055/netzwerkstar/html/index.html';
}

$(window).resize(function(){positionMenuElement('menu');});

