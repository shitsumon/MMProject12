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
function positionButtons() {

    $('#menu').css({
            position:'absolute',
            left: perc2pix(($(window).width()  - $('#menu').width()), gMenuPercPosX),
            top:  perc2pix(($(window).height() - $('#menu').height()), gMenuPercPosY)
        });

    $('#menu').offset({
            left: perc2pix(($(window).width()  - $('#menu').width()), gMenuPercPosX),
            top:  perc2pix(($(window).height() - $('#menu').height()), gMenuPercPosY)
        });
}

$(window).resize(function(){positionButtons();});

