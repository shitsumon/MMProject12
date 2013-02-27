/*
loads dialogues from xml file
one dialogue consists of one or more sentences between different person
all dialogues will be stored in gDialoge and contain persons id and his/her picture id
*/
function ladeDialoge(){

	jQuery.get(gDialogeXMLPfad,function(daten){
		verarbeiteDialogXML(daten);
    },"xml");
}

function verarbeiteDialogXML(daten){
	
    gDialogIDs = new Array();
	var jquery_saetze;
	//get dialogue elements from xml corresponding to current scene
	var jquery_dialoge = $(daten).find("dialog[id*=szene"+ gcurrent_scene_counter +"]");
	//store count of dialogues to be loaded
	gDialoge.anzahl += jquery_dialoge.length;
	
	gdialogparser_xml_geladen = true;
		
	//compute each dialogue
	jquery_dialoge.each(function(dialog_index, dialog_element) {
		//get all sentences
		jquery_saetze = $(dialog_element).find("satz");
		//create new dialogue object
        gDialoge[$(dialog_element).attr("id")] = new Dialog(

			$(dialog_element).attr("id"),
			jquery_saetze.length	//sentences count
		);

        //Push IDs to array for dialog referencing
        gDialogIDs.push($(dialog_element).attr("id"));

        //each sentence
		jquery_saetze.each(function(satz_index, satz_element) {
			//create new sentence object and store all properties
			gDialoge[$(dialog_element).attr("id")].saetze[satz_index] = new Satz(
				/*persons id*/
				$(satz_element).attr("person_id"),
				/*persons picture id in gBilder*/
				$(satz_element).attr("bild_id"),
				/*sentences contend*/
				$(satz_element).text()
			);
		});
    });
	
    //save number of dialogues in current scene
    gNumberOfDialogues = gDialogIDs.length;

    //Set dialog referencing counter back to zero for current scene
    gDialogCounter = 0;
}

//loading progressbar hook called in new Dialog()
function aktualisiereLadebalken_Dialoge(){
//	alert(gDialoge.geladen+" von "+gDialoge.anzahl+" geladen");
}

//hook called after loading all pictures from new Dialog()
function statusPruefen_Dialoge(){
	//compares count of loaded to count of to be loaded dialogues
	if(gDialoge.geladen==gDialoge.anzahl){
//		alert("Alle Dialoge geladen!");
	}
}
