/*
executes quizsteps implications by showing/hiding objects and increments current quizstep while checking whether the quiz was finished
*/
function advanceQuizStep(clicked_canvas_quiz_flags){
	
	if(gisWalkingTo !== ""){
		//store parameter in global variable if movement is active and exit
		gQuiztriggerAfterMoving = clicked_canvas_quiz_flags;
		
		return;
	}else{
		//restore saved parameter as walking is over
		clicked_canvas_quiz_flags = gQuiztriggerAfterMoving;
	}
	
	clicked_canvas_quiz_flags = clicked_canvas_quiz_flags.split("|");
	
	if(clicked_canvas_quiz_flags[gCurrentQuizstep] === "t"){
		//if the clicked canvas is supposed to advance the quiz now
		
		//increment current quizstep
		gCurrentQuizstep++;
	
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
	
	if(gCurrentQuizstep == gQuizsteps){
		//start next scene if quiz finished
		//create scene id
		gcurrent_scene_id			= "Szene_" + gcurrent_scene_counter.toString();
		
		//reset quiz
		gQuizsteps					= 0;
		gCurrentQuizstep			= 0;
		
		//prepare new zoomsteps
		gZoomsteps					= new Array(4);

		//clear animation
		$(gAnimationTimer).each(function(index, animation) {
			
			stoppeAnimation(animation.bild_id);
        });
		
		//reset walking direction
		gInitialDirection			= 4;
		gCurrentDirection			= gInitialDirection;
		
		//remove old scene
		$("canvas").remove();
		
		//reset flags
		gdisplay_next_scene			= true;
		gpictureparser_xml_geladen	= false;
		gdialogparser_xml_geladen	= false;
		
		//check whether scene elements finished loading and display scene
		waitforparser();
	}
	
	//last step before quiz finishes
	if(gCurrentQuizstep >= (gQuizsteps - 1)){
		//load all elements of next scene
		gcurrent_scene_counter++;
		ladeBilder();
		ladeDialoge();
	}
}