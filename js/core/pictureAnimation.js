/*
zuständig für das Erzeugen der Animationen. Schreibt Einzelbilder in einen gegeben Canvas und erzeugt einen Timer, der die Animation wiederholt.
*/
function animiereCanvas(canvas_id, bild_id, pxWidth, pxHeight, isPerson, subTileset){

    isPerson = typeof(isPerson)   === 'undefined' ? false : isPerson;
    isPerson = typeof(subTileset) === 'undefined' ? false : isPerson;

    //prüfe die Werte für die Ausgabegröße des Bildes
    pxWidth		= typeof(pxWidth)	=== 'undefined' ? gBilder[bild_id].animationsmerkmale.tile_width	: pxWidth;
    pxHeight	= typeof(pxHeight)	=== 'undefined' ? gBilder[bild_id].abmessungen.height				: pxHeight;

    if(isPerson){
        gCurrentDirection = subTileset;
        var tilesetHeight = pxHeight / gDirections.length;
    }

    if(typeof gAnimationTimer[bild_id] === "undefined"){
        //legt einen neuen Eintrag an
        gAnimationTimer[bild_id] = new Animation(
                    canvas_id,
                    bild_id,
                    pxWidth,
                    isPerson ? tilesetHeight : pxHeight,
                    isPerson
                    );

        //Startet die Animation.
        starteAnimation(bild_id);
    }

    //erfasst den Canvas und liest den Zeichenkontext aus
    var canvas  = $("#" + canvas_id)[0];
    var ctx     = canvas.getContext("2d");

    //löscht das aktuelle Bild
    ctx.clearRect ( 0, 0, canvas.width, canvas.height);

    //Set canvas height to tile sub-tileset height
    if(isPerson){
        canvas.height = tilesetHeight;
    }

    //zeichnet den neuen Bildausschnitt nach folgendem Schema
    /*
    img das Bild selbst -> Image,
    sx, sy Beginn des Ausschnitts -> Pixel int,
    swidth, sheight Breite und Höhe des Ausschnitts -> Pixel int,
    x, y Zeichenposition innerhalb des Canvas -> Pixel int,
    width, height Breite und Höhe des Bildes im Canvas -> Pixel int
    */
    ctx.drawImage(
                gBilder[bild_id].bild, //image
                gAnimationTimer[bild_id].bild_nr * gBilder[bild_id].animationsmerkmale.tile_width, //clipping x-direction
                gAnimationTimer[bild_id].isPerson ? (gBilder[bild_id].abmessungen.height / gDirections.length) * gCurrentDirection : 0, //clipping y-direction
                gBilder[bild_id].animationsmerkmale.tile_width, //clipped image width
                gAnimationTimer[bild_id].isPerson ? gBilder[bild_id].abmessungen.height / gDirections.length : gBilder[bild_id].abmessungen.height, //clipped image height
                0,       //image x-pos in canvas
                0,       //image y-pos in canvas
                pxWidth, //width of whole tileset image
                pxHeight //height of whole tileset image
                );

    //erhöht den Zähler für das aktuell angezeigte Einzelbild oder setzt ihn zurück
    gAnimationTimer[bild_id].bild_nr =
		(gAnimationTimer[bild_id].bild_nr < ( gBilder[bild_id].animationsmerkmale.tile_anzahl - 1 ))
            ? (gAnimationTimer[bild_id].bild_nr + 1) : 0;
}

//stoppt die Animation indem der Timer gelöscht wird
function stoppeAnimation(bild_id){
    window.clearInterval(gAnimationTimer[bild_id].timer);
    gAnimationTimer[bild_id].running = false;
    gAnimationTimer.anzahl--;
}

//startet die Animation und erzeugt einen neuen Timer
function starteAnimation(bild_id, canvas_id){

    var delimiter = '#';
    var gBilderIDString = '';

    if(strContains(bild_id, delimiter)){
        gBilderIDString = bild_id.split(delimiter)[0];
    }else{
        gBilderIDString = bild_id;
    }
	
	if(typeof(gAnimationTimer[bild_id].timer) !== "undefined"){
		//delete existing same timer
		stoppeAnimation(bild_id);
	}
	
    gAnimationTimer[bild_id].timer = window.setInterval(function(){
        animiereCanvas(
                    gAnimationTimer[bild_id].canvas_id,
                    bild_id,
                    gAnimationTimer[bild_id].anzeige_width,
                    gAnimationTimer[bild_id].anzeige_height
                    ); },
    (1000 / gBilder[gBilderIDString].animationsmerkmale.fps)
    );
    gAnimationTimer[bild_id].running = true;
    gAnimationTimer.anzahl++;
}

//schaltet zwischen laufender und pausierter Animation um
function toggleAnimation(bild_id){
    if(gAnimationTimer[bild_id].running){
        stoppeAnimation(bild_id);
    }else{
        starteAnimation(bild_id);
    }
}

function switchWalkingAnimation(direction){

    switch(direction){
		case 'front':
			gCurrentDirection = 0;
			break;
		case 'back':
			gCurrentDirection = 1;
			break;
		case 'right':
			gCurrentDirection = 2;
			break;
		case 'left':
			gCurrentDirection = 3;
			break;
		case 'standing':
			gCurrentDirection = 4;
			break;
    }
}
