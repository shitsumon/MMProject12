/*
executes quizsteps implications by showing/hiding objects and increments current quizstep while checking whether the quiz was finished
*/
function advanceQuizStep(clicked_canvas_quiz_flags){
outputDebugInfo();

	clicked_canvas_quiz_flags = clicked_canvas_quiz_flags.split("|");
	
	if((clicked_canvas_quiz_flags[0] === "CalledByDialogue") ||
		(clicked_canvas_quiz_flags[gCurrentQuizstep] === "t")){
		//if the clicked canvas is supposed to advance the quiz now
		
		//increment current quizstep
		gCurrentQuizstep++;
		
		applyCSSClass();
		
		checkQuizfinished();
		
		//a quizstep was made
		return true;
	}
	
	//no quizstep was made
	return false;
}

/*
called by advanceQuizStep to apply corresponding CSS classes to every canvas out there
*/
function applyCSSClass(){
outputDebugInfo();

	var canvas_id_flags;
	
	//get all canvas with visbility flags -> quiz relevant
	$("canvas[id*='|']").each(function(index, canvas) {
		//split id and flags, take flags
		//[0] = id, [1] = visibility flags, [2] = clickable flags
		canvas_id_flags = $(canvas).attr("id").split(":");
		//split flags
		canvas_id_flags[1] = canvas_id_flags[1].split("|");
		canvas_id_flags[2] = canvas_id_flags[2].split("|");
		
		canvas = $(canvas);
		
		//remove all class attributes
		canvas.removeClass();
		
		//consult visibility flag
		if (canvas_id_flags[1][gCurrentQuizstep] === "t"){
			//this should now be visible
			canvas.addClass("quiz_shown");
		}else{
			//this should now be hidden
			canvas.addClass("quiz_hidden");
		}
		
		//consult clickable flag
		if (canvas_id_flags[2][gCurrentQuizstep] === "t"){
			//this should now be clickable
			canvas.addClass("clickable");
		}
	});
}

/*
checks whether the quiz has finished and initiates loading of next scenes pictures and dialogues as well as resetting all needed variables
*/
function checkQuizfinished(){
outputDebugInfo();
	
	//last step before quiz finishes
    if(gCurrentQuizstep == (gQuizsteps - 1) && !gSceneHasBeenLoad){

        //image handling
        gDeprecatedImages       = gBilder;
		//$.extend(gDeprecatedImages, gBilder);
        gUseDeprecatedImages    = true;
        gBilder                 = new Object();
        gBilder.anzahl          = 0;
        gBilder.geladen         = 0;

		//load all elements of next scene
		gcurrent_scene_counter++;
		
		//--------------------------
		//loading common pictures should be enforced at the moment
		//because picture allg_uebergang isn't available at the end of scene 1 otherwise
		//--------------------------
		ladeBilder(true);
		ladeDialoge();

        //set flags
        gSceneHasBeenLoad = true;
        gUseDeprecated = true;
		
		return false;
	}

    //start next scene if quiz finished
    //if(gCurrentQuizstep == gQuizTrueQuizSteps){
    if(gCurrentQuizstep == gQuizsteps){

        $('body').append($('<canvas/>', {
            id: 'uebergang'
        }));

        starteAnimation("uebergang", "allg_uebergang", $(window).width(), $(window).height(), false, "");

        var frametime	= 1000 / gBilder["allg_uebergang"].animationsmerkmale.fps;
        var framecount	= gBilder["allg_uebergang"].animationsmerkmale.tile_anzahl;

        window.setTimeout("advanceNextScene();", frametime * (framecount / 2));
        window.setTimeout(function(){

                stoppeAnimation("allg_uebergang");
                $("canvas[id*='uebergang']").remove();
            }, frametime * framecount);
		
		return true;
    }
	
	return;
}

function advanceNextScene(){
outputDebugInfo();

    //WORKAROUND for scene2, this must not remain here,
    //but needs a proper fix
	//gIsSceneBeginning = true;
    /////

    //Reset flags
    gSceneHasBeenLoad       = false;
    gUseDeprecated          = false;
    gUseDeprecatedDialogues = false;
    gUseDeprecatedImages    = false;
    gDeprecatedImages       = new Object();
    gDeprecatedDialogues    = new Object();

    //create scene id
	gcurrent_scene_id			= "Szene_" + gcurrent_scene_counter.toString();
	
	//reset codegeneraor
	gCodegeneratorIndex = 0;
	
    //save number of dialogues in current scene
    gNumberOfDialogues = gDialogIDs.length;
    //Set dialog referencing counter back to zero for current scene
    gDialogCounter = 0;

	//reset quiz
	gQuizsteps					= 0;
	gCurrentQuizstep			= 0;

    //reset quiz counter for quizzes in scene 5 and 7
    gRiddleStepCounter          = 0;
	
	//prepare new zoomsteps
	gZoomsteps					= new Array(4);

    //Clear Blacklist to avoid unnecessary search overhead
    gSubDialogBlacklist         = new Array();

    //Clear quiz dialog blacklist
    gQuizDialogBlacklist        = new Array();

    //clear click event array
    gClickEventValueArray       = new Array();

	//clear animation
	$(gAnimationTimer).each(function(index, animation) {
		
		if((typeof(animation.bild_id) !== "undefined") && (animation.bild_id !== "allg_uebergang")){
			
			stoppeAnimation(animation.bild_id);
		}
	});
	
	//remove old scene
    $("canvas[id!='uebergang']").remove();

	//reset flags
	gdisplay_next_scene			= true;
//	gpictureparser_xml_geladen	= false;
//	gdialogparser_xml_geladen	= false;
	
    //Exit game mode when demo flag is enabled
    if(gDemoMode && gcurrent_scene_id == gStopAtScene){
        showDemo();
    }else{
        //check whether scene elements finished loading and display scene
        waitforparser();
    }
}
