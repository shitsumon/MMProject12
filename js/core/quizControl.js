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
Überprüft die Lösung des Rätsels nach jedem Schritt und erhöht in dem Fall den Zähler für die aktuelle Szene.
Die nächste Szene kann dann geladen werden.
*/
function checkQuizfinished(){
	
	if(gcurrent_quiz_step > gQuiz_steps){
		
		alert("Szene beendet!");
		
		gcurrent_scene_counter++;
		gcurrent_scene_id = "Szene_" + gcurrent_scene_counter.toString();
	}
	
	if(gcurrent_quiz_step == gQuiz_steps){
		
		alert("Laden der nächsten Szene gestartet!");
	}
}