/*
Wendet die Veränderungen eines Rätselschrittes auf die Szene an, indem die entsprechenden Objekte ein-/ausgeblendet werden.
Darüber hinaus wird der Zähler für den aktuellen Rätsel-Schritt erhöht und geprüft, ob das Rätsel gelöst wurde.
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
		
		//erhöhe den aktuellen Rätselschritt dieser Szene
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
	
	//prüfe, ob das Rätsel gelöst wurde
	checkQuizfinished();
}

/*
Überprüft den Fortschritt des Rätsels in jedem Schritt und leitet das Laden der Bilder und Dialoge der nächsten Szene ein. Zusätzlich werden alle wichtigen Variablen zurückgesetzt und die alte Szene ausgeblendet.
*/
function checkQuizfinished(){
	
	if(gCurrentQuizstep == gQuiz_steps){
		//starte die nächste szene
		//erzeuge id der nächsten szene
		gcurrent_scene_id			= "Szene_" + gcurrent_scene_counter.toString();
		
		//setze das quiz zurück
		gQuizsteps					= 0;
		gCurrentQuizstep			= 0;
		
		//bereite neue zoomstufen vor
		gZoomsteps					= new Array(4);

		//leere die animation
		$(gAnimationTimer).each(function(index, animation) {
			
			clearInterval(animation.timer);            
        });
		gAnimationTimer				= new Object();
		gAnimationTimer.anzahl		= 0;
		
		//setze die laufrichtung zurück
		gInitialDirection			= 4;
		gCurrentDirection			= gInitialDirection;
		
		//entferne die alte szene
		$("canvas").remove();
		
		//setze die flags zurück
		gdisplay_next_scene			= true;
		gpictureparser_xml_geladen	= false;
		gdialogparser_xml_geladen	= false;
		
		//prüfe ob die szene geladen wurde und zeige sie an
		waitforparser();
	}
	
	if(gCurrentQuizstep >= (gQuizsteps - 1)){
		//lade alles nötige für die nächste szene
		gcurrent_scene_counter++;
		ladeBilder();
		ladeDialoge();
	}
}