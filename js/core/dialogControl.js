/**
 * Function set to display the text of the game inside the dialogbox.
 */

/**
 * forceDialog()
 *
 * Forces next dialog to be displayed.
 * This can be used to initiate a
 * dialog sequence, at scene start.
 *
 * Input values:
 * none
 *
 * Return values:
 * none
 */
function forceDialog(){

    //display next dialog
    dialog_zeichneDialog();

    //Only increment if current dialog chunk is
    //at it's end
    if(!gTalk.isInitialized){
        ++gDialogCounter;
    }
}

function dialog_zeichneDialog(textToDraw)
{
    //access dialogdata
    if(!gTalk.isInitialized){
        gTalk.currentDialog = gDialoge[gTalk.dialog_id];
        gTalk.SatzMax       = gTalk.currentDialog.saetze.length;
        gTalk.isInitialized = true;
    }

    var Satz   = gTalk.currentDialog.saetze[gTalk.SatzCounter];
    var Text   = typeof(textToDraw) === 'undefined' ? Satz.inhalt : textToDraw;

    Text = swapProxiesWithNames(Text);

    //marks an unfinished text chunk
    if(gTalk.SatzCounter < gTalk.SatzMax - 1){
        Text += '   >>';
    }
	
	if(/*(*/gTalk.SatzCounter == 0/*>= (gTalk.SatzMax - 1))*/ && gDialogIDs[gDialogCounter].trigger_quizstep){
		//call this with forced flag if its the last sentence
		advanceQuizStep("CalledByDialogue");
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

    //get dialogbox canvas
    var canvas = $("canvas[id*='" + gTalk.canvas_id + "']");

    canvas.width  = perc2pix(screenWidth,  gTalk.TBPercWidth);
    canvas.height = perc2pix(screenHeight, gTalk.TBPercHeight);

    var realXPos = perc2pix(screenWidth,  gTalk.TBPercPosX) - (canvas.width * 0.5);

    var percPosX = pix2perc(screenWidth, realXPos);
    var percPosY = pix2perc(screenHeight, perc2pix(screenHeight, gTalk.TBPercPosY));

    //get canvas context
    var ctx = canvas[0].getContext("2d");

    //clear dialog box from old text etc.
    ctx.clearRect ( 0, 0, canvas.width, canvas.height);

    //draw background box
    ctx.drawImage(gBilder[gTalk.bild_id].bild,
                  0,
                  0,
                  textBoxImageWidth,
                  textBoxImageHeight);

    if(typeof(textToDraw) === 'undefined'){
        //draw character image
        ctx.drawImage( gBilder[Satz.bild_id].bild,
                      ProtImgXPos,
                      ProtImgYPos,
                      ProtImgWidth,
                      ProtImgHeight
                      );
    }

    //set layout settings
    ctx.fillStyle = gTalk.font_color;
    ctx.font      =	gTalk.font_style;

    //split text into lines if necessary
    var text = dialog_SatzZeilenBruch(Text, pixSize);

    //fill dialogbox letterwise
    for( var i = 0; i < text.length; i++ ){
        ctx.fillText(text[i].replace(/#KOMMA#/g, ","), textXPos, textYOffset + ( gTalk.line_distance * i ));
    };

    //increment sentence counter
    ++gTalk.SatzCounter;

    //if last sentence is reached, restore start state
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
	
	//replace commas to prevent them from beeing misinterpreted as array separator
	text = text.replace(/,/g, "#KOMMA#");
	
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

function justClicked(imgID, canvasID){

    //check if the clicked object is clickable for the current scene step
    var rawID = $("canvas[id*='" + canvasID + "']").attr("id").split(":")[2];

    var clickable = rawID.split('|');

//    if(clickable[gDialogCounter] === 'f'){
    if(clickable[gCurrentQuizstep] === 'f'){
        return;
    }

    if(gDialogIDs.length == gDialogCounter){

        dialog_zeichneDialog("Ende der Szene.");
        checkQuizfinished();
        return;
    }

    for(var idx = 0; idx < gImageToObjectSceneReferrer.length; ++idx){

        if(imgID === gImageToObjectSceneReferrer[idx].bildID){
            var sceneDialogues = gImageToObjectSceneReferrer[idx].scenes;

            for(var idx2 = 0; idx2 < sceneDialogues.length; ++idx2){

                //stop if gDialog is not defined...something
                //really wrong is going on then!
                if(typeof(gDialoge[gDialogIDs[gDialogCounter].scene_id]) === 'undefined'){
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
