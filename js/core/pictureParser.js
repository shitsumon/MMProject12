/*
läd alle Bilder aus der XML-Datei beim Aufruf der Seite
.get erhält den Pfad zur XML und stellt ein XMLDocument-Object bereit -> daten
bestimmt den typ des zu ladenden Dokumentes -> "xml"
*/
function ladeBilder(){

	jQuery.get(gbilderXMLPfad,function(daten){
			verarbeiteBilderXML(daten);
    },"xml").fail(function(data){
			alert(data + " Fehler bilder.xml laden")
		});
}

/*
speichert die ausgelesenen Bilder und ihre Eigenschaften im globalen Objekt -> gBilder
*/
function verarbeiteBilderXML(daten){
	var id, animation;
	
	var jquery_bilder = $(daten).find("bild[id*=szene"+ gcurrent_scene_counter +"]");
	
    gBilder.anzahl += jquery_bilder.length;
	
	verarbeiteBilder(jquery_bilder);
	
	if(gcurrent_scene_counter == 1){
		
		jquery_bilder = $(daten).find("bild[id*=allg_]");
		
		gBilder.anzahl += jquery_bilder.length;
		
		verarbeiteBilder(jquery_bilder);
	}
	
	gpictureparser_xml_geladen = true;
	
	/*jquery_bilder.each(function(index, bild) {
		
        id = $(bild).attr("id");

        gBilder[id] = new Bild(
								id,
                                $(bild).attr("pfad"),
                                new Abmessungen(
								
                                    parseInt($(bild).find("abmessungen").attr("height")),
                                    parseInt($(bild).find("abmessungen").attr("width"))
                                    ),
                                $(bild).attr("animiert") === "false" ? false : true
		);
		
		if(gBilder[id].animiert){
			
			animation = $(bild).find("animation");
			
			gBilder[id].animationsmerkmale = new Animationsmerkmale(
			
				parseFloat(animation.attr("fps")),
				parseInt(animation.attr("tile_anzahl")),
				parseInt(animation.attr("tile_width"))
			)
		}
    });*/
}

function verarbeiteBilder(bilder){
	
	var jquery_bilder = $(bilder);
	
	jquery_bilder.each(function(index, bild) {
		
		id = $(bild).attr("id");
	
		gBilder[id] = new Bild(
								id,
								$(bild).attr("pfad"),
								new Abmessungen(
								
									parseInt($(bild).find("abmessungen").attr("height")),
									parseInt($(bild).find("abmessungen").attr("width"))
									),
								$(bild).attr("animiert") === "false" ? false : true
		);
		
		if(gBilder[id].animiert){
			
			animation = $(bild).find("animation");
			
			gBilder[id].animationsmerkmale = new Animationsmerkmale(
			
				parseFloat(animation.attr("fps")),
				parseInt(animation.attr("tile_anzahl")),
				parseInt(animation.attr("tile_width"))
			)
		}
	});
}

/*
Hook zur Anzeige des Ladevorgangs. aufgerufen in Image.onload in helper.js
*/
function aktualisiereLadebalken_Bilder(){
//	alert(gBilder.geladen+" von "+gBilder.anzahl+" geladen");
}

/*
Hook für die Aktion nach dem Laden aller Bilder. aufgerufen in Image.onload in helper.js
*/
function statusPruefen_Bilder(){
	//vergleicht die Anzahl geladener mit der Gesamtzahl der Bilder
	if(gBilder.geladen==gBilder.anzahl){
//		alert("Alle Bilder geladen!");
	}
}
