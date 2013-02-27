//Initiert Dialog. Dialogauswahl nach ID (string)

/*
- unbedingt an den entscheidenden stellen prüfen, ob die entsprechenden objekte vorhanden sind
- gTalk als aktuellen dialog vielleicht übergeben statt global zu speichern
- positionierung des dialogfensters
- text sollte antialiasing oä erhalten
*/
function dialogStart(dialog_id)
{	
	//wähle Dialog aus
	
    var Dialog = gDialoge[dialog_id];
    var Laenge = (Dialog.saetze).length;
	
    gTalk.SatzGerade = 0;
    gTalk.SatzMax	 = Laenge;
    gTalk.dialog_id	 = dialog_id;
	
	dialogSettings(	
		'allg_dialogbox',	//Hintergrund für Dialoge
		'textbox',			//CSS/Canvas
		'white',			//Schriftfarbe
		'bold 18px Arial',	//Schriftart
		20);				//Zeilenabstand

	dialog_zeichneDialog();
}

function dialog_zeichneDialog()
{
	//Greife auf Dialogdaten zu
    //alert(gTalk.dialog_id);
    var Dialog = gDialoge[gTalk.dialog_id];
    var Satz   = Dialog.saetze[gTalk.SatzGerade];
    var Text   = Satz.inhalt;

    //background textbox dimensions
    var textBoxImageWidth  = gBilder[gTalk.bild_id].abmessungen.width;
    var textBoxImageHeight = gBilder[gTalk.bild_id].abmessungen.height;

    //Textbox protagonist bild dimensionen
    var ProtImgXPos        = perc2pix(textBoxImageWidth,  gTalk.TBPercImagePosX);   //xPos text Bild
    var ProtImgYPos        = perc2pix(textBoxImageHeight, gTalk.TBPercImagePosY);   //yPos text Bild
    var ProtImgWidth       = perc2pix(gBilder[Satz.bild_id].abmessungen.width,  gTalk.TBPercImageWidth);  //width text Bild
    var ProtImgHeight      = perc2pix(gBilder[Satz.bild_id].abmessungen.height, gTalk.TBPercImageHeight); //height text Bild

    //Text positioning values
    var textXPos    = perc2pix(textBoxImageWidth,  gTalk.TBPercTextPosX);
    var textYOffset = perc2pix(textBoxImageHeight, gTalk.TBPercTextPosY);

    var pixSize = Math.round((textBoxImageWidth - textXPos) / gTalk.font_style.split(" ")[1].substring(0,2)) + gTalk.line_distance;

    //screen dimensions
    var screenWidth  = $(window).width();
    var screenHeight = $(window).height();

    //Prinzip von pictureAnimation.js übernommen.
    var canvas = $("canvas[id*='" + gTalk.canvas_id + "']"); // $("#" + gTalk.canvas_id)[0];

    canvas.width  = perc2pix(textBoxImageWidth,  gTalk.TBPercWidth);
    canvas.height = perc2pix(textBoxImageHeight, gTalk.TBPercHeight);
    /*
        Setze position der Textbox mit prozentualen Werten.

        Habe nicht rausgefunden wie man per jQuery auf die
        style attribute zugreift, wer das weiss, bitte ändern!
    */
    var realXPos = perc2pix(screenWidth,  gTalk.TBPercPosX) - (canvas.width * 0.5);

    var percPosX = pix2perc(screenWidth, realXPos);
    var percPosY = pix2perc(screenHeight, perc2pix(screenHeight, gTalk.TBPercPosY));

    //var c = document.getElementById(gTalk.canvas_id);

    //c.style.left = percPosX;
    //c.style.top  = percPosY;

    //hole kontext
    var ctx    = canvas[0].getContext("2d");

    //Leere Inhalt des Bereiches (löscht alten text etc)
    ctx.clearRect ( 0, 0, canvas.width, canvas.height);

    //Draws background box
    ctx.drawImage( gBilder[gTalk.bild_id].bild, 0, 0 );

    //Draw character image
    ctx.drawImage( gBilder[Satz.bild_id].bild,
                   ProtImgXPos,
                   ProtImgYPos,
                   ProtImgWidth,
                   ProtImgHeight
                   );

    //Initiere Einstellungen für Text
    ctx.fillStyle = gTalk.font_color;
    ctx.font      =	gTalk.font_style;

    //Breche Text in Zeilen
    var text = dialog_SatzZeilenBruch(Satz.inhalt, pixSize);

    //Fülle Box mit Text Zeilenweise aus
    for( var i = 0; i < text.length; i++ ){
        ctx.fillText(text[i], textXPos, textYOffset + ( gTalk.line_distance * i )); //Magic numbers, siehe oben!
    };

    //Inkrementiere Satzcounter
    ++gTalk.SatzGerade;
	
    /*Erstelle einen Mouse-onClickListener für übergang zum nächstem Satz
      Zerstöre danach eigenes Binding Falls letzter Satz erreicht wurde,
      erstelle kein Binding und lösche Dialogbox (Dialogende)*/
//	canvas.addEventListener('click', function()
//	{
//		//überprüfe ob Dialogende erreicht wurde
//        if( gTalk.SatzGerade < gTalk.SatzMax ){

//			dialog_zeichneDialog(); 	//rekursiver Aufruf
//		}
//		else{

//			ctx.clearRect ( 0, 0, canvas.width, canvas.height);
//		}
		
//		this.removeEventListener('click',arguments.callee,false);
//	}, false);
}

/*Diese Funktion bricht längere Text in Zeilen auf
  Die Maximiale Zeilenlänge wird in gTalk.lineletters
  definiert*/
function dialog_SatzZeilenBruch(text, pixelSize)
{
    var subtext = "";
    var result  = new Array();
    var search  = 0;
	
    if ( text.length > pixelSize )
	{
        /*falls text zu lange, nimm maximale-länge string
          suche nach letztem Space speichere String als Zeile
          mach das so lange weiter bis alles rein passt*/
        while(text.length > pixelSize){

            subtext =	text.substr( 0, pixelSize);
            search  =	subtext.lastIndexOf(" ") + 1;

            result.push (text.substr( 0, search));

            text    =	text.substr(search,text.length);
		}
		
        if( text.length > 0 ){

            result.push(text);
		}//füge rest ran
		
		return result;
	}
	else
	{
        result.push(text); //falls text kurz genug ist, mache nichts
	}
		
	return result;
}


/**
 * swapProxiesWithNames(string sentence)
 *
 * Checks every dialog sentence for the occurence of a preset name proxy.
 * If one of those proxies is found, the proxy will be exchanged for the
 * players choosen name. If no name was choosen by the player, it will use
 * a fallback name for the respective character ("John Doe" | "Jane Doe").
 *
 * Input values:
 * sentence (string) - The sentence to be examined
 *
 * Return values:
 * sentence (string) - The sentence with the filled in player names, if present
 */
function swapProxiesWithNames(sentence){

    //Put in name of player 1
    if(strContains(sentence, gP1Proxy)){
        var splitSentence = sentence.split(gP1Proxy);
        sentence = splitSentence[0] + typeof(gP1Name) === "undefined" ? gFallbackNameP1 : gP1Name + splitSentence[1];
    }

    //Put in name of player 2
    if(strContains(sentence, gP2Proxy)){
        var splitSentence = sentence.split(gP2Proxy);
        sentence = splitSentence[0] + typeof(gP2Name) === "undefined" ? gFallbackNameP2 : gP2Name + splitSentence[1];
    }

    return sentence;
}

/**
 * justClicked(string imgID)
 *
 * Every object's got an onclick method anyway. So
 * it is utilized, to mark the just clicked image.
 * When the image gets clicked this function is invoked.
 * The function checks whether the just clicked image.
 * Is the next object to be clicked in the dialog chain.
 *
 * This done by comparing the imageID with gImageToObjectSceneReferrer
 * saved up imageIDs. IF the image id is found within the array and IF
 * gDialogCounter points to a dialog id mapped with the just clicked
 * image id, the next dialog piece is triggerd to show up in the
 * dialogbox.
 *
 * Input arguments:
 * imageID (string) -  presetted by sceneParser
 *
 * Return values:
 * none
 */

function justClicked(imgID){

    var lutListLength = gImageToObjectSceneReferrer.length;

    for(var idx = 0; idx < lutListLength; ++idx){

        //alert('bar');

        if(imgID === gImageToObjectSceneReferrer[idx].bildID){
            var sceneDialogues = gImageToObjectSceneReferrer[idx].scenes;

            for(var idx2 = 0; idx2 < sceneDialogues.length; ++idx2){

                //alert('foobar');

                if(sceneDialogues[idx2] === gDialogIDs[gDialogCounter]){
                    //trigger next dialog
                    //alert('foo');
                    printCurrentTextToDialogBox();
                    ++gDialogCounter;
                    break; //When current dialog was displayed stop looping
                }
            }

            break; //When current dialog was displayed stop looping
        }
    }
}

/**
 * printCurrentTextToDialogBox()
 *
 * Prints current text piece to dialog box.
 *
 * Input arguments:
 * none
 *
 * Return values:
 * none
 */

function printCurrentTextToDialogBox(){

    var dialog = gDialoge[gDialogIDs[gDialogCounter]];

    if(dialog === 'undefined'){

        return;
    }

    //alerts dienen nur als test, später wird
    //hier der text in die dialogbox eingefügt
    for(var idx = 0; idx < dialog.anzahl_saetze; ++idx){
        gTalk.dialog_id = gDialogIDs[gDialogCounter];
        //alert(swapProxiesWithNames(dialog.saetze[idx].inhalt));
        dialog_zeichneDialog();
    }

}
