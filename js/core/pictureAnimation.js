/*
zuständig für das Erzeugen der Animationen. Schreibt Einzelbilder in einen gegeben Canvas und erzeugt einen Timer, der die Animation wiederholt.
*/
function animiereCanvas(canvas_id, bild_id){
	
    //falls noch kein Eintrag für dieses Bild vorhanden ist, erzeuge ihn
    if(typeof gAnimationTimer[bild_id] === "undefined"){
		//legt einen neuen Eintrag an
        gAnimationTimer[bild_id] = new Animation(
				canvas_id,
				bild_id
			);
        //startet die Animation
		starteAnimation(bild_id);
	}

	//erfasst den Canvas und liest den Zeichenkontext aus
    var canvas = $("#" + canvas_id)[0];
    var ctx = canvas.getContext("2d");
	
	//löscht das aktuelle Bild
	ctx.clearRect ( 0, 0, canvas.width, canvas.height);

	//zeichnet den neuen Bildausschnitt nach folgendem Schema
	/*
	img das Bild selbst -> Image,
	sx, sy Beginn des Ausschnitts -> Pixel int,
	swidth, sheight Breite und Höhe des Ausschnitts -> Pixel int,
	x, y Zeichenposition innerhalb des Canvas -> Pixel int,
	width, height Breite und Höhe des Bildes im Canvas -> Pixel int
	*/
	ctx.drawImage(
            gBilder[bild_id].bild,
            /*aktuelles Einzelbild * Breite eines Einzelbildes*/
            gAnimationTimer[bild_id].bild_nr * gBilder[bild_id].animationsmerkmale.tile_width,
            0,
            gBilder[bild_id].animationsmerkmale.tile_width,
            gBilder[bild_id].abmessungen.height,
            0,
            0,
            gBilder[bild_id].animationsmerkmale.tile_width,
            gBilder[bild_id].abmessungen.height
                );

	//erhöht den Zähler für das aktuell angezeigte Einzelbild oder setzt ihn zurück
    gAnimationTimer[bild_id].bild_nr = gAnimationTimer[bild_id].bild_nr < ( gBilder[bild_id].animationsmerkmale.tile_anzahl - 1 )
            ? (gAnimationTimer[bild_id].bild_nr + 1) : 0;
}

//stoppt die Animation indem der Timer gelöscht wird
function stoppeAnimation(bild_id){
	window.clearInterval(gAnimationTimer[bild_id].timer);
    gAnimationTimer[bild_id].running = false;
	gAnimationTimer.anzahl--;
}

//startet die Animation und erzeugt einen neuen Timer
function starteAnimation(bild_id){
    gAnimationTimer[bild_id].timer = window.setInterval(function(){
                    animiereCanvas( gAnimationTimer[bild_id].canvas_id, bild_id ); },
                    (1000 / gBilder[bild_id].animationsmerkmale.fps)
                                                        );
    gAnimationTimer[bild_id].running = true;
	gAnimationTimer.anzahl++;
}

//schaltet zwischen laufender und pausierter Animation um
function toggleAnimation(bild_id){
	if(gAnimationTimer[bild_id].running){
		stoppeAnimation(bild_id);
	}else{
		gAnimationTimer[bild_id](bild_id);
	}
}
