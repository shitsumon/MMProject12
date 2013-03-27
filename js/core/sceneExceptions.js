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
        if(!/question\d/.test(arguments)){
            alert('This function requires one argument, like "question1"!');
            return;
        }

        scene5_generateSecureCode(arguments);
        break;
    case 'scene5_hideDialogbox':
        //        if(!/hide/.test(arguments) || !/reveal/.test(arguments)){
        //            alert('This function requires one argument, like "hide" or "reveal"!');
        //            return;
        //        }

        scene5_hideDialogbox(arguments);
        break;
    default:
        break;
    }
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
 * scene5_generateSecureCode()
 *
 * Exception for the secure password generation riddle.
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
function scene5_generateSecureCode(arg){

    //get dimensions
    var qBoxWidth  = gBilder['szene5_frage_underlay'].abmessungen.width;
    var qBoxHeight = gBilder['szene5_frage_underlay'].abmessungen.height;

    var aBoxWidth  = gBilder['szene5_antwort_a_underlay'].abmessungen.width;
    var aBoxHeight = gBilder['szene5_antwort_a_underlay'].abmessungen.height;

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
    ctx_q.drawImage(gBilder['szene5_frage_underlay'].bild,
                    0,
                    0,
                    perc2pix(screenWidth,30),
                    perc2pix(screenHeight,40));

    for(var idx = 0; idx < ctx_Array.length; ++idx){
        ctx_Array[idx].drawImage(gBilder[gClickableSlots[idx].substring(18)].bild,
                                 0,
                                 0,
                                 perc2pix(screenWidth,25),
                                 perc2pix(screenHeight,17.5));
    }

    //get next question
    var tmpQuizObject            = new Object();
    var redirectToSameRiddlestep = false;
    var clickedAnswerSlot        = 0;

    //get number of clicked slot
    for(var idx = 0; idx < gClickableSlots.length; ++idx){
        if(gClickableSlots[idx] == gMostRecentlyClickedIdentifier){
            clickedAnswerSlot = idx;
            break;
        }
    }

    switch(arg){
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

    var text = foo(tmpQuizObject.question,
                   (qBoxWidth - q_canvas.offset().left) / gScene5_LayoutSettings.fixedFont + gScene5_LayoutSettings.line_distance);

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
    gDialogToForce           = "szene5.9.1";
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
