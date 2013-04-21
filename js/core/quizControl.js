/*
executes quizsteps implications by showing/hiding objects and increments current quizstep while checking whether the quiz was finished
*/
function advanceQuizStep(clicked_canvas_quiz_flags){

	clicked_canvas_quiz_flags = clicked_canvas_quiz_flags.split("|");
	
	if((clicked_canvas_quiz_flags[0] === "CalledByDialogue") ||
		(clicked_canvas_quiz_flags[gCurrentQuizstep] === "t")){
		//if the clicked canvas is supposed to advance the quiz now
		
		//increment current quizstep
		gCurrentQuizstep++;
		
		//encode current savestate
		verschluesseln();
	
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

	//check whether quiz has finished
	checkQuizfinished();
}

/*
checks whether the quiz has finished and initiates loading of next scenes pictures and dialogues as well as resetting all needed variables
*/
function checkQuizfinished(){
	
	//last step before quiz finishes
    if(gCurrentQuizstep == (gQuizsteps - 1) && !gSceneHasBeenLoad){

		//load all elements of next scene
		gcurrent_scene_counter++;
		ladeBilder();
		ladeDialoge();

        //set flags
        gSceneHasBeenLoad = true;
        gUseDeprecated = true;

        //exit here, to prevent change of scenes
        return;
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
    }
}

function advanceNextScene(){

    //Reset flags
    gSceneHasBeenLoad       = false;
    gUseDeprecated          = false;
    gUseDeprecatedDialogues = false;
    gDeprecatedDialogues    = new Object();

    //create scene id
	gcurrent_scene_id			= "Szene_" + gcurrent_scene_counter.toString();
	
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
