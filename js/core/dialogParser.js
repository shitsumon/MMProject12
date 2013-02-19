/*
zuständig für das Laden der Dialoge aus der XML-Datei.
Ein Dialog besteht dabei aus mehreren Sätzen zwischen verschiedenen Personen.
Alles wird in gDialoge gespeichert und enthält die IDs der sprechenden Personen und deren Bild-ID
*/
function ladeDialoge(){

	jQuery.get(gDialogeXMLPfad,function(daten){
		verarbeiteDialogXML(daten);
    },"xml");
}

function verarbeiteDialogXML(daten){
	
	var jquery_saetze;
	
	//findet alle Dialog-Elemente
	var jquery_dialoge = $(daten).find("dialog[id*=szene"+ gcurrent_scene_counter +"]");
	
	//speichert die Anzahl der hinterlegten Dialoge
	gDialoge.anzahl = jquery_dialoge.length;
	
	//für jeden Dialog
	jquery_dialoge.each(function(dialog_index, dialog_element) {
		
		//ermittle alle Sätze in diesem Dialog
		jquery_saetze = $(dialog_element).find("satz");
		
		//erzeuge ein neues Dialog-Objekt
        gDialoge[$(dialog_element).attr("id")] = new Dialog(
		
			$(dialog_element).attr("id"),
			jquery_saetze.length
		);
		
		//für jeden Satz
		jquery_saetze.each(function(satz_index, satz_element) {
			
			//erzeuge ein neues Satz-Objekt und lege alle Informationen darin ab
			gDialoge[$(dialog_element).attr("id")].saetze[satz_index] = new Satz(
				//ID der Persion	-> voraussichtlich ihr Anzeigename
				$(satz_element).attr("person_id"),
				//ID des anzuzeigenden Bildes	-> verfügbar in gBilder
				$(satz_element).attr("bild_id"),
				//der eigentliche Inhalt des Satzes
				$(satz_element).text()
			);
		});
    });
}

/*
Hook zur Anzeige des Ladevorgangs. aufgerufen in new Dialog(..)
*/
function aktualisiereLadebalken_Dialoge(){
//	alert(gDialoge.geladen+" von "+gDialoge.anzahl+" geladen");
}

/*
Hook für die Aktion nach dem Laden aller Bilder. aufgerufen in new Dialog(..)
*/
function statusPruefen_Dialoge(){
	//vergleicht die Anzahl geladener mit der Gesamtzahl der Bilder
	if(gDialoge.geladen==gDialoge.anzahl){
		//alert("Alle Dialoge geladen!");
	}
}