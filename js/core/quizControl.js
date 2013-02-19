/*
Wendet die Veränderungen eines Rätselschrittes auf die Szene an, indem die entsprechenden Objekte ein-/ausgeblendet werden.
Darüber hinaus wird der Zähler für den aktuellen Rätsel-Schritt erhöht und geprüft, ob das Rätsel gelöst wurde.
*/
function advanceQuizStep(){
	
	var canvas;
	
	//2 Durchläufe: alte Elemente verstecken und neue einblenden
	for(var i = 0; i < 2; i++){
		
		//finde alle Canvas deren ID "quizStep_X" enthält
		canvas = $("canvas[id*=quizStep_" + ( gcurrent_quiz_step + i ).toString() + "]");
		
		canvas.each(function(index, element) {
			
			//schalte die angegebenen CSS-Klassen für das Element um
			$(element).toggleClass('quiz_shown quiz_hidden');
		});
	}
	
	//erhöhe den aktuellen Rätselschritt dieser Szene
	gcurrent_quiz_step++;
	
	//prüfe, ob das Rätsel gelöst wurde
	checkQuizfinished();
}

/*
Überprüft den Fortschritt des Rätsels in jedem Schritt und leitet das Laden der Bilder und Dialoge der nächsten Szene ein. Zusätzlich werden alle wichtigen Variablen zurückgesetzt und die alte Szene ausgeblendet.
*/
function checkQuizfinished(){
	
	if(gcurrent_quiz_step == gQuiz_steps){
		//starte die nächste szene
		//erzeuge id der nächsten szene
		gcurrent_scene_id			= "Szene_" + gcurrent_scene_counter.toString();
		
		//setze das quiz zurück
		gQuiz_steps					= 0;
		gcurrent_quiz_step			= 0;
		
		//bereite neue zoomstufen vor
		gZoomsteps					= new Array(4);

		//leere die animation
		$(gAnimationTimer).each(function(index, animation) {
			
			clearInterval(animation.timer);            
        });
		gAnimationTimer				= new Object();
		gAnimatimer.anzahl			= 0;
		
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
	
	if(gcurrent_quiz_step >= (gQuiz_steps - 1)){
		//lade alles nötige für die nächste szene
		gcurrent_scene_counter++;
		ladeBilder();
		ladeDialoge();
	}
}