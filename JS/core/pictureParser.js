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
	
	gBilder.anzahl=$(daten).find("bild").length;
	
	$(daten).find("bild").each(function(index, bild) {
		id=$(bild).attr("id");
		gBilder[id]=new Bild(
		id,
		$(bild).attr("pfad"),
		new Abmessungen(
			$(bild).find("abmessungen").attr("height"),
			$(bild).find("abmessungen").attr("width")
			),
		$(bild).attr("animiert")==="false"?false:true,
		new Animation(
		$(bild).find("animation").attr("fps"),
		$(bild).find("animation").attr("tile_anzahl"),
		$(bild).find("animation").attr("tile_width")
		),
		$(bild).find("stufe").length
		);
		
		$(bild).find("stufe").each(function(index, stufe) {
           gBilder[id].skalierung[index]=new Skalierung(
			   $(stufe).attr("x"),
			   $(stufe).attr("y"),
			   $(stufe).attr("z")
		   );
        });
    });
}

/*
wird von der onload-Funktion jedes Bildes aufgerufen, um den Ladevorgang anzuzeigen
*/
function aktualisiereLadebalken(){
//	alert(gBilder.geladen+" von "+gBilder.anzahl+" geladen");
}