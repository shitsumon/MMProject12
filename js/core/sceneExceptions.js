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
outputDebugInfo();    

    switch(exceptionName){
	case 'sceneBeginning_lookRight':
		sceneBeginning_lookRight();
		break;
	case 'scene1_hideDrawer':
		scene1_hideDrawer();
	break;
	case 'scene1_stopSound':
		scene1_stopSound();
	break;
	case 'scene1_showHeroine':
		scene1_showHeroine();
		break;
	case 'scene4_darkenRoom':
		scene4_darkenRoom();
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
	case 'scene6_suit_on':
        scene6_suit_on();
		break;	
	case 'scene6_celestial_quiz':
		scene6_celestial_quiz(arguments);
		break;
	case 'scene7_suit_off':
        scene7_suit_off();
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
    case 'scene7_enableWallButton':
        scene7_enableWallButton();
        break;
	case 'scene7_showEnding':
        scene7_showEnding();
        break;
    default:
        break;
    }
}


/**
* sceneBeginnning_lookRight()
*
* ensures that the heroine is looking to the right side at the beginning of the scene
*
* Input values:
* none
*
* return values:
* none
**/
function sceneBeginning_lookRight(){
	var hero	= $("canvas[id*='canvas_person_']");
	switchWalkingAnimation('standing_r', hero[0].id);
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
*scene1_hideHeroine()
*
* hides our heroine before getting out of bed
*
*Input values:
*none
*
*return values:
*
*none
**/
function scene1_hideHeroine(){

    if(gcurrent_scene_id == "Szene_1"){
        $("canvas[id*='canvas_person_allg_herotileset']").css("display", "none");
    }
}

/**
*scene1_showHeroine()
*
* shows our heroine after getting out of bed
*
*Input values:
*none
*
*return values:
*
*none
**/
function scene1_showHeroine(){

	$("canvas[id*='canvas_person_allg_herotileset']").css("display", "inline");
}


/**
* scene4_darkenRoom()
*
* darkens the room for letting Teddy escape while it's dark
*
* Input values:
* none
*
* return values:
* none
**/
function scene4_darkenRoom(){
     $('body').append($('<canvas/>', {
            id: 'uebergang'
        }));
		
    starteAnimation("uebergang", "allg_uebergang", $(window).width(), $(window).height(), false, "");

    var frametime	= 1000 / gBilder["allg_uebergang"].animationsmerkmale.fps;
    var framecount	= gBilder["allg_uebergang"].animationsmerkmale.tile_anzahl;

    window.setTimeout(function(){stoppeAnimation("allg_uebergang");$("canvas[id*='uebergang']").remove();}, frametime * framecount);
		
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
	var rightfulClicked = 0;
	for (var idx = 0; idx < gBooksClicked.length; ++idx){
		    if(gBooksClicked[idx].name == arg){
				gBooksClicked[idx].wasClicked = true
			}
			if (gBooksClicked[idx].wasClicked == true){
				++rightfulClicked
			}
	}
	if(rightfulClicked == gBooksClicked.length){

        //reset global array
        for(var idx = 0; idx < gBooksClicked.length; ++idx){
            gBooksClicked[idx].wasClicked = false;
        }

        gForceOtherDialog   = true;
        gDialogToForce      = "szene5.7.12";
        gIncreaseDialogStep = testIfSubDialog(gDialogToForce);
    }else{
		//decrease gCodegeneratorIndex because this step didn't contribute to the riddle
		gCodegeneratorIndex--;
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

    var imageObject = gUseDeprecatedImages ? gDeprecatedImages : gBilder;

    //get dimensions
    var qBoxWidth  = imageObject['szene' + arg.split('|')[0].substring(5) + '_frage_underlay'].abmessungen.width;
    var qBoxHeight = imageObject['szene' + arg.split('|')[0].substring(5) + '_frage_underlay'].abmessungen.height;

    var aBoxWidth  = imageObject['szene' + arg.split('|')[0].substring(5) + '_antwort_a_underlay'].abmessungen.width;
    var aBoxHeight = imageObject['szene' + arg.split('|')[0].substring(5) + '_antwort_a_underlay'].abmessungen.height;

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
    ctx_q.drawImage(imageObject['szene' + arg.split('|')[0].substring(5) + '_frage_underlay'].bild,
                    0,
                    0,
                    perc2pix(screenWidth,30),
                    perc2pix(screenHeight,40));

    for(var idx = 0; idx < ctx_Array.length; ++idx){
        ctx_Array[idx].drawImage(imageObject['szene' + arg.split('|')[0].substring(5) + '_antwort_a_underlay'].bild,
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

    var currentScene = arg.split('|')[0];

    if(currentScene == 'scene5'){

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
    }else if (currentScene == 'scene7'){

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

    var layoutObject        = currentScene == 'scene5' ? gScene5_LayoutSettings : gScene7_LayoutSettings;
    var dyn_font_answer     = Math.abs((screenWidth / 100) * layoutObject.font_size_boost);
    var answer_pixsize      = (aBoxWidth - a1_canvas.offset().left) / dyn_font_answer + layoutObject.line_distance;

    //Fill answer boxes
    for(var idx = 0; idx < ctx_Array.length; ++idx){

        ctx_Array[idx].fillStyle = layoutObject.font_color;

        ctx_Array[idx].font = layoutObject.bold + dyn_font_answer + 'px' + layoutObject.font;

        //if answer is short enough, print it to the
        //first line else, split it into multiple text chunks
        if(tmpQuizObject.answers[idx].length <= answer_pixsize){

            ctx_Array[idx].fillText(tmpQuizObject.answers[idx],
                                    15,
                                    perc2pix(aBoxHeight, 30) + layoutObject.line_distance);
        }else{

            var text_chunks = splitTextIntoChunks(tmpQuizObject.answers[idx], layoutObject.wordsPerChunkAnswer, " ");

            for(var idx2 = 0; idx2 < text_chunks.length; ++idx2){

                ctx_Array[idx].fillText(text_chunks[idx2].replace(/#KOMMA#/g, ","),
                                        15,
                                        perc2pix(aBoxHeight, 30) + layoutObject.line_distance * (text_chunks.length > 1 ? idx2 : 1));
            }
        }
    }

    //Fill question box
    ctx_q.fillStyle = layoutObject.font_color;
    ctx_q.font      = layoutObject.bold
            + layoutObject.fixedFont
            + 'px' + layoutObject.font;

    var pixSize = Math.abs(qBoxWidth - q_canvas.offset().left) / layoutObject.qCharDivider;

    var text = splitTextIntoChunks(tmpQuizObject.question, layoutObject.wordsPerChunkQuestion, " ");

    for(var idx2 = 0; idx2 < text.length; ++idx2){

        var xStart = (qBoxWidth - (layoutObject.qLeftMargin * text[idx2].length)) * 0.5;

        ctx_q.fillText(text[idx2].replace(/#KOMMA#/g, ","),
                       xStart,
                       perc2pix(qBoxHeight, 15) + (layoutObject.line_distance * idx2));
    }
}

/**
 * splitTextIntoChunks()
 *
 * An alternative way of splitting strings into
 * even parts. This prevents text overflow.
 *
 * Input values:
 * text (String) - Text to split
 *
 * chunksize (Integer) - Number of words per Line
 *
 * delimiter (Char) - Sign at which when found the given text is split
 *                    (This is optional, default is " ")
 *
 * Return values:
 *
 * Array with text splitted into even parts.
 */
function splitTextIntoChunks(text, chunksize, delimiter){

    delimiter = typeof(delimiter) === 'undefined' ? " " : delimiter;

    var letter_counter  = 0;
    var word_counter    = 0;
    var text_chunks     = new Array();
    var current_chunk   = "";

    while(letter_counter < text.length){

        if(text[letter_counter] === delimiter && word_counter === chunksize - 1){

            text_chunks.push(current_chunk);
            current_chunk = "";
            word_counter  = 0;

        }else if(text[letter_counter] === delimiter && word_counter < chunksize - 1){

            ++word_counter;
            current_chunk += text[letter_counter];
        }else{
            current_chunk += text[letter_counter];
        }

        if(letter_counter === text.length - 1){

            text_chunks.push(current_chunk);
        }

        ++letter_counter;
    }

    return text_chunks;
}

/**
 * Helper function
 *
 */
function displayErrorDialog(){
    gForceOtherDialog        = true;
    gDialogToForce           = gcurrent_scene_counter == 5 ? "szene5.9.1" : "szene7.5.1";
    gIncreaseDialogStep      = testIfSubDialog(gDialogToForce);
	//decrease gCodegeneratorIndex because this step didn't contribute to the riddle in the end
	gCodegeneratorIndex--;
    return true;
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
 * scene6_suit_on
 */

function scene6_suit_on(){
	//handle her
	var hero	= $("canvas[id*='canvas_person_']");
	switchWalkingAnimation('jetpack_r', hero[0].id);
	//handle him
//	hero		= $("canvas[id*='allg_heroMaleFullTileset']");
//	hero[0].id	= "canvas_person_allg_heroMaleFullTileset";
	switchWalkingAnimation('jetpack_l', "canvas_person_allg_heroMaleFullTileset");
}

function scene6_celestial_quiz(arg){
// simple 3 step quiz - klick three signs in the correct order otherwise start over again
	var choice_correct = true;
	
	switch(arg){
	case 'stier': 
		if (gScene6RiddleStepState == 0){
			gScene6RiddleStepState = 1;}
		else {
			gScene6RiddleStepState =0;
			choice_correct = false;}
		break;	
	case 'waage': 
		if (gScene6RiddleStepState == 1){
			gScene6RiddleStepState = 2;}
		else {
			gScene6RiddleStepState =0;
			choice_correct = false;}
		break;	
	case 'krebs':
		if (gScene6RiddleStepState == 2){
			gScene6RiddleStepState = 3;
			gForceOtherDialog   = true;
        	gDialogToForce      = "szene6.8.5";
       		gIncreaseDialogStep = testIfSubDialog(gDialogToForce);}
		else {
			gScene6RiddleStepState =0;
			choice_correct = false}
		break;
	}
	
	if (choice_correct == false){
		gForceOtherDialog   = true;
        gDialogToForce      = "szene6.8.1";
       	gIncreaseDialogStep = testIfSubDialog(gDialogToForce);}
	
}

/**
 * scene7_flipSpikeBackAndForth
 */
function scene7_flipSpikeBackAndForth(arg){

    flipCharacterHorizontally(arg);

    setTimeout(function(){flipCharacterHorizontally(arg);}, 2000);
}

/**
 * scene7_suit_off
 */

function scene7_suit_off(){
var hero	= $("canvas[id*='canvas_person_']");
switchWalkingAnimation('standing_r', hero[0].id);
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

    var id_array   = arg.split('|');

    for(var idx = 0; idx < id_array.length; ++idx){

        var imagePercs  = getScaledDimensions(id_array[idx]);

        if(imagePercs.width == 'undefined' && imagePercs.height == 'undefined'){
            return;
        }

        var canvas    = $("canvas[id*='" + id_array[idx] + "']");
        var ctx       = canvas[0].getContext("2d");
        canvas.width  = imagePercs.width;
        canvas.height = imagePercs.height;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(gUseDeprecatedImages ? gDeprecatedImages[id_array[idx]].bild : gBilder[id_array[idx]].bild,
                                             0,
                                             0,
                                             imagePercs.width,
                                             imagePercs.height);
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
    /*
      This is rather hacky, but it's
      almost friday so fuck this shit...
    */
    gCurrentQuizstep++;
    applyCSSClass();
    checkQuizfinished();
    /*Hacky shit ends here*/

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

    if(gcurrent_scene_id != 'Szene_7'){
        alert("Don't use this exception apart from scene 7!");
        return;
    }

    var imagePercs  = getScaledDimensions('szene7_dr_chaos_falling');

    if(imagePercs.width == 'undefined' && imagePercs.height == 'undefined'){
        return;
    }

    var factor      = 0.2;
    var canvas      = $("canvas[id*='szene7_dr_chaos_falling']");
    var ctx         = canvas[0].getContext("2d");
    var centerDist  = 1;
    var spiralDist  = 2;

    canvas.width  = imagePercs.width;
    canvas.height = imagePercs.height;

    var center_x = canvas.width  / 2;
    var center_y = canvas.height / 2;

    var img = gUseDeprecatedImages ? gDeprecatedImages['szene7_dr_chaos_falling'].bild : gBilder['szene7_dr_chaos_falling'].bild;

    //save image state
    ctx.save();

    //clear image
    ctx.clearRect ( 0, 0, canvas.width, canvas.height);

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
    ctx.drawImage(img, -center_x, -center_y, imagePercs.width, imagePercs.height);

    //restore old state
    ctx.restore();

    gRotationCounter += 2;

    //Stop if image is small enough
    if(gDrChaosScalingFactor <= 0){
        window.clearInterval(gTimerHandle);

        gDeprecatedDialogIDs = gDialogIDs;
//        gDialogIDs = gDeprecatedDialogIDs;
    }
}

/**
 * getScaledDimensions()
 *
 * extracts correctly scaled width and height
 * dimensions of the canvas which is treated
 * with at the moment.
 *
 * Input values:
 * arg (String) - Image id
 *
 * Return values:
 * Struct(width (Int), height(Int))
 */
function getScaledDimensions(arg){

    var feats = null;

    for(var idx = 0; idx < gImageStats.length; ++idx){
        if(gImageStats[idx].id == arg){
            feats = gImageStats[idx];
            break;
        }
    }

    if(feats == null){
        alert("No image with this id found!");
        return { 'width': 'undefined', 'height': 'undefined'};
    }

    var width  = perc2pix($(window).width(),  feats.size.width);
    var height = perc2pix($(window).height(), feats.size.height);

    width  *= z2mult(feats.position.zPos);
    height *= z2mult(feats.position.zPos);

    return { 'width': width, 'height': height};
}


function scene7_enableWallButton(){

    var canvas      = $("canvas[id*='roter_knopf_kraftfeld']");
    canvas.addClass("clickable");

    flags = canvas.attr("id").split(":");

    clickableFlags = flags[2].split("|");

    clickableFlags[gCurrentQuizstep] = "t";

    newFlagList = clickableFlags[0];

    for(var idx = 1; idx < clickableFlags.length; ++idx){
        newFlagList += ("|" + clickableFlags[idx]);
    }

    newID = flags[0] + ":" + flags[1] + ":" + newFlagList;

    canvas.attr("id", newID);
}

function scene7_showEnding(){
	window.setTimeout(function(){showEnde()},5000);
}
