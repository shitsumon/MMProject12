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
        'yellow',			//Schriftfarbe
		'bold 18px Arial',	//Schriftart
		20);				//Zeilenabstand

	dialog_zeichneDialog();
}

function dialog_zeichneDialog()
{
	//Greife auf Dialogdaten zu
    if(!gTalk.isInitialized){
        gTalk.currentDialog = gDialoge[gTalk.dialog_id];
        gTalk.SatzMax       = gTalk.currentDialog.saetze.length;
        gTalk.isInitialized = true;

        if(gDialogIDs[gDialogCounter].trigger_quizstep){
            ++gCurrentQuizstep;
        }
    }

    var Satz   = gTalk.currentDialog.saetze[gTalk.SatzCounter];
    var Text   = Satz.inhalt;

    Text = swapProxiesWithNames(Text);

    //marks an unfinished text chunk
    if(gTalk.SatzCounter < gTalk.SatzMax - 1){
        Text += '   >>'      ;
    }

    //screen dimensions
    var screenWidth  = $(window).width();
    var screenHeight = $(window).height();

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


    //Prinzip von pictureAnimation.js übernommen.
    var canvas = $("canvas[id*='" + gTalk.canvas_id + "']");
    //var ctx    = canvas[0].getContext("2d");
    //ctx.clearRect ( 0, 0, canvas.width, canvas.height);

    canvas.width  = perc2pix(screenWidth,  gTalk.TBPercWidth);
    canvas.height = perc2pix(screenHeight, gTalk.TBPercHeight);
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
    var ctx = canvas[0].getContext("2d");

    //Leere Inhalt des Bereiches (löscht alten text etc)
    ctx.clearRect ( 0, 0, canvas.width, canvas.height);

    //Draws background box
    ctx.drawImage(gBilder[gTalk.bild_id].bild,
                  0,
                  0,
                  textBoxImageWidth,
                  textBoxImageHeight);

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
    var text = dialog_SatzZeilenBruch(Text, pixSize);

    //Fülle Box mit Text Zeilenweise aus
    for( var i = 0; i < text.length; i++ ){
        ctx.fillText(text[i], textXPos, textYOffset + ( gTalk.line_distance * i ));
    };

    //Inkrementiere Satzcounter
    ++gTalk.SatzCounter;

    if( gTalk.SatzCounter === gTalk.SatzMax ){

        gTalk.currentDialog = 'undefined';
        gTalk.isInitialized = false;
        gTalk.SatzCounter   = 0;
    }
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
        sentence = sentence.replace(gP1Proxy, gP1Name === "undefined" ? gFallbackNameP1 : gP1Name);
    }

    //Put in name of player 2
    if(strContains(sentence, gP2Proxy)){
        sentence = sentence.replace(gP2Proxy, gP2Name === "undefined" ? gFallbackNameP2 : gP2Name);
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

    for(var idx = 0; idx < gImageToObjectSceneReferrer.length; ++idx){

        if(imgID === gImageToObjectSceneReferrer[idx].bildID){
            var sceneDialogues = gImageToObjectSceneReferrer[idx].scenes;

            for(var idx2 = 0; idx2 < sceneDialogues.length; ++idx2){

                //stop if gDialog is not defined...something
                //really wrong is going on then!
                if(gDialoge[gDialogIDs[gDialogCounter].scene_id] === 'undefined'){
                    alert('undefined dialog in gDialoge[]!');
                    return;
                }

                //if it's the wrong dialog skip it
                if(sceneDialogues[idx2] !== gDialogIDs[gDialogCounter].scene_id){
                    continue;
                }

                gTalk.dialog_id = gTalk.isInitialized ? gTalk.dialog_id : gDialogIDs[gDialogCounter].scene_id;

                dialog_zeichneDialog();

                //Only increment if current dialog chunk is
                //at it's end
                if(!gTalk.isInitialized){
                    ++gDialogCounter;
                }

                break; //When current dialog was displayed stop looping
            }

            break; //When current dialog was displayed stop looping
        }
    }
}
