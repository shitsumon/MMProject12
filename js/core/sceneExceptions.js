/**
 * sceneExceptions.js
 *
 * This file, provides an interface to all scenes,
 * which can be used to trigger functions
 * which are only used once or more often in a single scene.
 */

/**
 * triggerException()
 *
 * Interface function which starts a specific exception function specified
 * by passed identifier.
 *
 * Input values:
 * exceptionName (String) - Identifier which refers to a specific function
 *
 * arguments (String) - String of arguments concatenated by specific delimiter
 *
 * Return values:
 * none
 */
function triggerException(exceptionName, arguments) {
    

    switch(exceptionName){
	case 'scene1_hideDrawer':
		scene1_hideDrawer();
	break;
	case 'scene1_stopSound':
		scene1_stopSound();
	break;
    case 'scene5_bookcode':
    {
        if(!/book\d{1,2}/.test(arguments)){
            alert('This function requires one argument, like "book#number#"!');
            return;
        }

        scene5_bookcode(arguments);
    }
    break;
    case 'scene5_generateCode':
        if(!/scene5\|question\d/.test(arguments)){
            alert('This function requires one argument, like "scene5|question1"!');
            return;
        }

        generateSecureCode(arguments);
        break;
    case 'scene5_hideDialogbox':
        //        if(!/hide/.test(arguments) || !/reveal/.test(arguments)){
        //            alert('This function requires one argument, like "hide" or "reveal"!');
        //            return;
        //        }

        scene5_hideDialogbox(arguments);
        break;
    case 'scene7_flipSpike':
        scene7_flipSpikeBackAndForth(arguments);
        break;
    case 'scene7_quizInput':
        if(!/scene7\|question\d/.test(arguments)){
            alert('This function requires one argument, like "scene7|question1"!');
            return;
        }

        generateSecureCode(arguments);
        break;
    case 'scene7_blowDrChaosAway':
        scene7_blowDrChaosAway();
        break;
    default:
        break;
    }
}

/**
*scene1_hideDrawer()
*
* sets z-index of drawer in scene 1 to background value while walking over it
*
*Input values:
*none
*
*return values:
*
*none
**/
function scene1_hideDrawer(){

	$("canvas[id*='canvas_bg_dynamic_szene1_schublade_zu']").css("z-index", 101);
	$("canvas[id*='canvas_bg_dynamic_szene1_schublade_offen']").css("z-index", 101);
}

/**
*scene1_stopSound()
*
* stops sound animation after quiz triggered it
*
*Input values:
*none
*
*return values:
*
*none
**/
function scene1_stopSound(){

	stoppeAnimation("szene1_sound_rechts");
	stoppeAnimation("szene1_sound_links");
}


/**
 * scene5_bookcode()
 *
 * Exception for the book riddle in scene 5. Checks clicked book
 * against an Array which contains the preset click order. When
 * all Array elements are set true, the finalizing action is triggered.
 *
 * Input values:
 * arg (String) - Name of the clicked book
 *
 * Return values:
 * none
 */
function scene5_bookcode(arg){

    var bookIndex        = 0;
    var rightfulClicked = 0;

    for(var idx = 0; idx < gBooksClicked.length; ++idx){

        if(gBooksClicked[idx].wasClicked){
            ++rightfulClicked;
        }

        if(gBooksClicked[idx].name == arg){
            bookIndex = idx;
        }
    }

    var setEntryTrue = true;

    for(var idx = 0; idx < bookIndex; ++idx){

        if(!gBooksClicked[idx].wasClicked){
            setEntryTrue = false;
            break;
        }
    }

    if(setEntryTrue){
        gBooksClicked[bookIndex].wasClicked = true;
        ++rightfulClicked;
    }


    if(rightfulClicked == gBooksClicked.length){

        //reset global array
        for(var idx = 0; idx < gBooksClicked.length; ++idx){
            gBooksClicked[idx].wasClicked = false;
        }

        gForceOtherDialog   = true;
        gDialogToForce      = "szene5.7.12";
        gIncreaseDialogStep = testIfSubDialog(gDialogToForce);
    }
}

/**
 * generateSecureCode()
 *
 * Exception for the riddles in scene 5 and 7.
 * Depending on the passed argument, this function will
 * generate new quiz text in the quiz boxes.
 *
 *
 * Input values:
 * arg (String) - Name of the clicked answer
 *
 * Return values:
 * none
 */
function generateSecureCode(arg){

    //get dimensions
    var qBoxWidth  = gBilder['szene' + arg.split('|')[0].substring(5) + '_frage_underlay'].abmessungen.width;
    var qBoxHeight = gBilder['szene' + arg.split('|')[0].substring(5) + '_frage_underlay'].abmessungen.height;

    var aBoxWidth  = gBilder['szene' + arg.split('|')[0].substring(5) + '_antwort_a_underlay'].abmessungen.width;
    var aBoxHeight = gBilder['szene' + arg.split('|')[0].substring(5) + '_antwort_a_underlay'].abmessungen.height;

    var screenWidth  = $(window).width();
    var screenHeight = $(window).height();

    //get single context of each box and clear content
    var q_canvas    = $("canvas[id*='frage_underlay']");
    q_canvas.width  = perc2pix(screenWidth, 100);
    q_canvas.height = perc2pix(screenHeight, 100);
    var ctx_q       = q_canvas[0].getContext("2d");
    ctx_q.clearRect(0,0,q_canvas.width, q_canvas.height);

    var a1_canvas    = $("canvas[id*='antwort_a_underlay']");
    a1_canvas.width  = perc2pix(screenWidth, 100);
    a1_canvas.height = perc2pix(screenHeight, 100);
    var ctx_a1       = a1_canvas[0].getContext("2d");
    ctx_a1.clearRect(0,0,a1_canvas.width,a1_canvas.height);

    var a2_canvas    = $("canvas[id*='antwort_b_underlay']");
    a2_canvas.width  = perc2pix(screenWidth, 100);
    a2_canvas.height = perc2pix(screenHeight, 100);
    var ctx_a2       = a2_canvas[0].getContext("2d");
    ctx_a2.clearRect(0,0,a2_canvas.width,a2_canvas.height);

    var a3_canvas    = $("canvas[id*='antwort_c_underlay']");
    a3_canvas.width  = perc2pix(screenWidth, 100);
    a3_canvas.height = perc2pix(screenHeight, 100);
    var ctx_a3       = a3_canvas[0].getContext("2d");
    ctx_a3.clearRect(0,0,a3_canvas.width,a3_canvas.height);

    var a4_canvas    = $("canvas[id*='antwort_d_underlay']");
    a4_canvas.width  = perc2pix(screenWidth, 100);
    a4_canvas.height = perc2pix(screenHeight, 100);
    var ctx_a4       = a4_canvas[0].getContext("2d");
    ctx_a4.clearRect(0,0,a4_canvas.width,a4_canvas.height);

    var ctx_Array = new Array(ctx_a1, ctx_a2, ctx_a3, ctx_a4);
    var letter = new Array('a', 'b', 'c', 'd');

    //redraw background images
    ctx_q.drawImage(gBilder['szene' + arg.split('|')[0].substring(5) + '_frage_underlay'].bild,
                    0,
                    0,
                    perc2pix(screenWidth,30),
                    perc2pix(screenHeight,40));

    for(var idx = 0; idx < ctx_Array.length; ++idx){
        ctx_Array[idx].drawImage(gBilder['szene' + arg.split('|')[0].substring(5) + '_antwort_a_underlay'].bild,
                                 0,
                                 0,
                                 perc2pix(screenWidth,25),
                                 perc2pix(screenHeight,17.5));
    }

    //get next question
    var tmpQuizObject            = new Object();
    var redirectToSameRiddlestep = false;
    var clickableSlots           = getClickableSlots();
    var clickedAnswerSlot        = 0;

    //get number of clicked slot
    for(var idx = 0; idx < clickableSlots.length; ++idx){
        if(clickableSlots[idx] == gMostRecentlyClickedIdentifier){
            clickedAnswerSlot = idx;
            break;
        }
    }

    if(arg.split('|')[0] == 'scene5'){

        switch(arg.split('|')[1]){
        case 'question0':
            tmpQuizObject = gQuizDataArray[0];
            break;
        case 'question1':
            if(gCurrentQuizstep != 11 || !gRiddleStepStates[gRiddleStepCounter][clickedAnswerSlot]){
                redirectToSameRiddlestep = displayErrorDialog();
            }else{
                tmpQuizObject = gQuizDataArray[1];
                ++gRiddleStepCounter;
            }
            break;
        case 'question2':
            if(gCurrentQuizstep != 12 || !gRiddleStepStates[gRiddleStepCounter][clickedAnswerSlot]){
                redirectToSameRiddlestep = displayErrorDialog();
            }else{
                tmpQuizObject = gQuizDataArray[2];
                ++gRiddleStepCounter;
            }
            break;
        case 'question3':
            if(gCurrentQuizstep != 13 || !gRiddleStepStates[gRiddleStepCounter][clickedAnswerSlot]){
                redirectToSameRiddlestep = displayErrorDialog();
            }else{
                tmpQuizObject = gQuizDataArray[3];
                ++gRiddleStepCounter;
            }
            break;
        case 'question4':
            if(gCurrentQuizstep != 14 || !gRiddleStepStates[gRiddleStepCounter][clickedAnswerSlot]){
                redirectToSameRiddlestep = displayErrorDialog();
            }else{
                tmpQuizObject = gQuizDataArray[3];
                ++gRiddleStepCounter;
            }
            break;
        }

        //Choose correct riddle step to display
        if(redirectToSameRiddlestep){
            switch(gCurrentQuizstep){
            case 10:
                tmpQuizObject = gQuizDataArray[0];
                break;
            case 11:
                tmpQuizObject = gQuizDataArray[1];
                break;
            case 12:
                tmpQuizObject = gQuizDataArray[2];
                break;
            case 13:
                tmpQuizObject = gQuizDataArray[3];
                break;
            }
        }
    }else if (arg.split('|')[0] == 'scene7'){

        var parts    = arg.split('|');
        var getNext  = false;
        var takeAsIs = false;
        var dialog   = '';

        if(parts.length > 2){
            for(var idx = 1; idx < parts.length; ++idx){

                for(var idx2 = 0; idx2 < gQuizDialogBlacklist.length; ++idx2){

                    if(parts[idx] == gQuizDialogBlacklist[idx2].scene_id &&
                            gRiddleStepCounter == gQuizDialogBlacklist[idx2].counter_step){
                        takeAsIs = true;
                        break;
                    }else if(parts[idx] == gQuizDialogBlacklist[idx2].scene_id &&
                             gRiddleStepCounter != gQuizDialogBlacklist[idx2].counter_step){
                        getNext = true;
                        break;
                    }

                }

                if(takeAsIs){
                    dialog = parts[idx];
                    //gQuizDialogBlacklist.push(new BlacklistIDObject(dialog, gRiddleStepCounter));
                    break;
                }

                if(!getNext){
                    dialog = parts[idx];

                    if(parseInt(dialog.substring(8)) <= gRiddleStepCounter + 1){
                        gQuizDialogBlacklist.push(new BlacklistIDObject(dialog, gRiddleStepCounter));
                    }

                    break;
                }

                getNext = false;
            }
        }else{
            dialog = parts[1];
        }

        switch(dialog){
        case 'question0':
            tmpQuizObject = gScene7DataArray[0];
            break;
        case 'question1':
            if(gCurrentQuizstep != 5 || !gScene7RiddleStepStates[gRiddleStepCounter][clickedAnswerSlot]){
                redirectToSameRiddlestep = displayErrorDialog();
            }else{
                tmpQuizObject = gScene7DataArray[1];
                ++gRiddleStepCounter;
            }
            break;
        case 'question2':
            if(gCurrentQuizstep != 6 || !gScene7RiddleStepStates[gRiddleStepCounter][clickedAnswerSlot]){
                redirectToSameRiddlestep = displayErrorDialog();
            }else{
                tmpQuizObject = gScene7DataArray[2];
                ++gRiddleStepCounter;
            }
            break;
        case 'question3':
            if(gCurrentQuizstep != 7 || !gScene7RiddleStepStates[gRiddleStepCounter][clickedAnswerSlot]){
                redirectToSameRiddlestep = displayErrorDialog();
            }else{
                tmpQuizObject = gScene7DataArray[3];
                ++gRiddleStepCounter;
            }
            break;
        case 'question4':
            if(gCurrentQuizstep != 8 || !gScene7RiddleStepStates[gRiddleStepCounter][clickedAnswerSlot]){
                redirectToSameRiddlestep = displayErrorDialog();
            }else{
                tmpQuizObject = gScene7DataArray[4];
                ++gRiddleStepCounter;
            }
            break;
        case 'question5':
            if(gCurrentQuizstep != 9 || !gScene7RiddleStepStates[gRiddleStepCounter][clickedAnswerSlot]){
                redirectToSameRiddlestep = displayErrorDialog();
            }else{
                tmpQuizObject = gScene7DataArray[4];
                ++gRiddleStepCounter;
            }
            break;
        default:
            redirectToSameRiddlestep = displayErrorDialog();
            break;
        }

        //Choose correct riddle step to display
        if(redirectToSameRiddlestep){
            switch(gCurrentQuizstep){
            case 4:
                tmpQuizObject = gScene7DataArray[0];
                break;
            case 5:
                tmpQuizObject = gScene7DataArray[1];
                break;
            case 6:
                tmpQuizObject = gScene7DataArray[2];
                break;
            case 7:
                tmpQuizObject = gScene7DataArray[3];
                break;
            case 8:
                tmpQuizObject = gScene7DataArray[4];
                break;
            }
        }
    }

    var dyn_font_answer = Math.abs((screenWidth / 100) * gScene5_LayoutSettings.font_size_boost);
    var answer_pixsize  = (aBoxWidth - a1_canvas.offset().left) / dyn_font_answer + gScene5_LayoutSettings.line_distance;

    //Fill answer boxes
    for(var idx = 0; idx < ctx_Array.length; ++idx){

        ctx_Array[idx].fillStyle = gScene5_LayoutSettings.font_color;

        ctx_Array[idx].font = gScene5_LayoutSettings.bold + dyn_font_answer + 'px' + gScene5_LayoutSettings.font;

        if(tmpQuizObject.answers[idx].length <= answer_pixsize){

            ctx_Array[idx].fillText(tmpQuizObject.answers[idx],
                                    10,
                                    50);
        }else{

            var text = foo(tmpQuizObject.answers[idx], answer_pixsize);

            for(var idx2 = 0; idx2 < text.length; ++idx2){
                ctx_Array[idx].fillText(text[idx2].replace(/#KOMMA#/g, ","),
                                        10,
                                        perc2pix(aBoxHeight, 25) + (gScene5_LayoutSettings.line_distance * idx2));
            }
        }
    }

    //Fill question box
    ctx_q.fillStyle = gScene5_LayoutSettings.font_color;
    ctx_q.font      = gScene5_LayoutSettings.bold
            + gScene5_LayoutSettings.fixedFont
            + 'px' + gScene5_LayoutSettings.font;

    var text = tmpQuizObject.question;/*foo(tmpQuizObject.question,
                   (qBoxWidth - q_canvas.offset().left) / gScene5_LayoutSettings.fixedFont + gScene5_LayoutSettings.line_distance);*/

    for(var idx2 = 0; idx2 < text.length; ++idx2){
        ctx_q.fillText(text[idx2].replace(/#KOMMA#/g, ","),
                       perc2pix(qBoxWidth, 10),
                       perc2pix(qBoxHeight, 10) + (gScene5_LayoutSettings.line_distance * idx2));
    }
}


/**
 * Helper function
 *
 */
function displayErrorDialog(){
    gForceOtherDialog        = true;
    gDialogToForce           = gcurrent_scene_counter == 5 ? "szene5.9.1" : "szene7.5.1";
    gIncreaseDialogStep      = testIfSubDialog(gDialogToForce);
    return true;
}

function foo(text, pixelSize)
{
    var subtext = "";
    var result  = new Array();
    var search  = 0;

    //replace commas to prevent them from beeing misinterpreted as array separator
    text = text.replace(/,/g, "#KOMMA#");

    if ( text.length > pixelSize )
    {
        /*falls text zu lange, nimm maximale-länge string
          suche nach letztem Space speichere String als Zeile
          mach das so lange weiter bis alles rein passt*/
        while(text.length > pixelSize){

            subtext =	text.substr( 0, pixelSize);
            search  =	subtext.lastIndexOf(" ") + 1;

            result.push (text.substr( 0, search));

            text    =	text.substr(search,text.length);
        }

        if( text.length > 0 ){

            result.push(text);
        }//füge rest ran

        return result;
    }
    else
    {
        result.push(text); //falls text kurz genug ist, mache nichts
    }

    return result;
}

function scene5_hideDialogbox(arg){

    switch(arg){
    case 'hide':
        $("canvas[id*='allg_dialogbox']").addClass("invisible");
        break;
    case 'reveal':
        $("canvas[id*='allg_dialogbox']").removeClass("invisible");
        break;
    }
}

/**
 * scene7_flipSpikeBackAndForth
 */
function scene7_flipSpikeBackAndForth(arg){

    flipCharacterHorizontally(arg);

    setTimeout(function(){flipCharacterHorizontally(arg);}, 2000);
}

/**
 * flipCharacterHorizontally()
 *
 * flips all objects which objects id
 * have been passed to as arguments horizontally.
 *
 * Input values:
 * arg (String) - concatenated object IDs. Delimiter is '|'.
 *
 * Return values:
 * none
 */
function flipCharacterHorizontally(arg){

    var id_array = arg.split('|');

    for(var idx = 0; idx < id_array.length; ++idx){

        var canvas    = $("canvas[id*='" + id_array[idx] + "']");
        var ctx       = canvas[0].getContext("2d");
        canvas.width  = gBilder[id_array[idx]].abmessungen.width;
        canvas.height = gBilder[id_array[idx]].abmessungen.height;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(gBilder[id_array[idx]].bild, 0, 0);
    }
}

/**
 * scene7_blowDrChaosAway()
 *
 * Wrapper for applyNextTransformation(),
 * which starts the function as interval.
 *
 * Input values:
 * none
 *
 * Return values:
 * none
 */
function scene7_blowDrChaosAway(){

     gTimerHandle = window.setInterval(applyNextTransformation, 50);
}

/**
 * applyNextTransformation()
 *
 * Special exception written for
 * scene7, where dr chaos is blown
 * into space when the player clicks
 * the wall button to open the
 * freight hangar
 *
 * Input values:
 * none
 *
 * Return values:
 * none
 */
function applyNextTransformation(){

    var factor      = 0.2;
    var canvas      = $("canvas[id*='szene7_dr_chaos_falling']");
    var ctx         = canvas[0].getContext("2d");
    var centerDist  = 1;
    var spiralDist  = 2;

    canvas.width  = gBilder['szene7_dr_chaos_falling'].abmessungen.width;
    canvas.height = gBilder['szene7_dr_chaos_falling'].abmessungen.height;

    var center_x = canvas.width  / 2;
    var center_y = canvas.height / 2;

    var img = gBilder['szene7_dr_chaos_falling'].bild;

    //save image state
    ctx.save();

    //clear image
    ctx.clearRect ( 0, 0, canvas.width, canvas.height*2);

    //Use archimedean spiral to make it look good
    x = center_x + ( centerDist + spiralDist * (gRotationCounter * factor)) * Math.cos(gRotationCounter * factor);
    y = center_y + ( centerDist + spiralDist * (gRotationCounter * factor)) * Math.sin(gRotationCounter * factor);

    //move image to next point on spiral
    ctx.translate(x, y);

    //rotate around new degree value
    ctx.rotate(gRotationCounter * Math.PI/180);

    //calculate new scaling factor
    gDrChaosScalingFactor -= 0.005;

    //scale with new factor
    ctx.scale(gDrChaosScalingFactor, gDrChaosScalingFactor)

    //draw image
    ctx.drawImage(img,-center_x,-center_y);

    //restore old state
    ctx.restore();

    gRotationCounter += 2;

    //Stop if image is small enough
    if(gDrChaosScalingFactor <= 0){
        window.clearInterval(gTimerHandle);
    }
}
