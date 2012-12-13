/*
läd alle Bilder aus der XML-Datei beim Aufruf der Seite
.get erhält den Pfad zur XML und stellt ein XMLDocument-Object bereit -> daten
bestimmt den typ des zu ladenden Dokumentes -> "xml"
*/
function ladeBilder(){		
	jQuery.get(gbilderXMLPfad,function(daten){
		verarbeiteXML(daten);
    },"xml");
}

/*
speichert die ausgelesenen Bilder und ihre Eigenschaften im globalen Objekt -> gBilder
*/
function verarbeiteXML(daten){
	var id;

    gBilder.anzahl = $(daten).find("bild").length;
	
	$(daten).find("bild").each(function(index, bild) {
        id = $(bild).attr("id");

        gBilder[id] = new Bild(
                                id,

                                $(bild).attr("pfad"),

                                new Abmessungen(
                                    parseInt($(bild).find("abmessungen").attr("height")),
                                    parseInt($(bild).find("abmessungen").attr("width"))
                                    ),

                                $(bild).attr("animiert") === "false" ? false : true,

                                new Animationsmerkmale(
                                    parseFloat($(bild).find("animation").attr("fps")),
                                    parseInt($(bild).find("animation").attr("tile_anzahl")),
                                    parseInt($(bild).find("animation").attr("tile_width"))
                                ),

                                parseInt($(bild).find("stufe").length)
		);
		
		$(bild).find("stufe").each(function(index, stufe) {

           gBilder[id].skalierung[index] = new Skalierung(
			   parseFloat($(stufe).attr("x")),
			   parseFloat($(stufe).attr("y")),
			   parseInt($(stufe).attr("z"))
		   );
        });
    });
}

/*
Hook zur Anzeige des Ladevorgangs
*/
function aktualisiereLadebalken(){
//	alert(gBilder.geladen+" von "+gBilder.anzahl+" geladen");
}

/*
Hook für die Aktion nach dem Laden aller Bilder
*/
function statusPruefen(){
	//vergleicht die Anzahl geladener mit der Gesamtzahl der Bilder
	if(gBilder.geladen==gBilder.anzahl){
		alert("Alle Bilder geladen!");
	}
}
