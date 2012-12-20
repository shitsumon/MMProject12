/*
fügt den Canvas onclick-Events die Funktion zum Wechseln der Inhalte hinzu
erwartet ein Array aus quizStep-Objekten
*/
function addQuizFunctionality(quizSteps){
	
	$(quizSteps).each(function(index, quizStep) {
		
		//schneide den Teil bis zum ersten _ aus der ID heraus -> "bild_name" -> "name"
		var canvas_id = quizStep.objectID.slice(
			quizStep.objectID.indexOf("_")+1,
			quizStep.objectID.length
		);
		
		//finde ein Canvas dessen ID den gegebenen String enthält
		var canvas = $('canvas[id*="'+ canvas_id +'"]');
		
		//erzeuge den String mit den Aktionen die hinzugefügt werden sollen
		/*"dialogStart('"+ quizStep.dialogueReactionID +"');" + */
		var add_action = "change_according_to_quiz('" + canvas_id + "', '";
		
		//für jede Änderung die in der XML-Datei vorgesehen ist
		$(quizStep.changes).each(function(index, quizChange) {
			
			//ID für das alte Bild wird auf den eigentlichen Namen gekürzt und dient zum Canvas Suchen
			//ID fürs Neue wird übernommen
			add_action=add_action.concat(
				quizChange.id_old.slice(
					quizChange.id_old.indexOf("_")+1, quizChange.id_old.length
				)+">"+
				quizChange.id_new+"#"
			);
        });
		
		//schließe die klammer für change_according_to_quiz
		add_action=add_action.concat("');");
		
		//überschreibe die onclick-Aktion
		canvas.attr("onclick", canvas.attr("onclick") + add_action);
    });
}

/*
führt eine Änderung entsprechend der Quizvorgaben aus
erwartet:
	die ID des geklickten Canvas
	einen String bestehend aus den IDs der zu verändernden Elemente -> a_ID>b_bild#c_ID>d_bild
*/
function change_according_to_quiz(clicked_canvas_id, id_array){

	//zerlege den String, um die Einzelaktionen zu erhalten
	id_array = id_array.split("#");
	
	//enthalten die extrahierten IDs
	var alt_id, neu_id;
	//enthalten das zu verändernde Canvas-Element und seinen Context
	var canvas, ctx;
	
	//für alle übergebenen Schritte bis auf den Letzte -> ist immer leer
	for(var i=0; i<( id_array.length-1 ); i++){
        
		//extrahiere beide IDs und speichere sie auf den Variablen
		alt_id = id_array[i].split(">");
		neu_id = alt_id[1];
		alt_id = alt_id[0];

		//erfasse den Canvas
		canvas	= $('canvas[id*="'+ alt_id +'"]');
		ctx		= canvas[0].getContext("2d");
		
		//lösche ihn
		ctx.clearRect( 0, 0, canvas[0].width, canvas[0].height );
		
		//zeichne das neue Bild
		ctx.drawImage(
			gBilder[neu_id].bild,
			0,0,
			canvas[0].width,canvas[0].height
		);
    };
}
