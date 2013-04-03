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
function forceDialog(scene_id){

    //get right dialog IDs
    var dialogIDs = fetchDialogIDs();

    //set dialog id
    if(typeof(scene_id) == 'undefined'){
        gTalk.dialog_id = gTalk.isInitialized ? gTalk.dialog_id : dialogIDs[gDialogCounter].scene_id;
    }else{
        gTalk.dialog_id = scene_id;
    }

    //set canvas id
    gTalk.canvas_id = 'allg_dialogbox';

    //display next dialog
    dialog_zeichneDialog();

    //Only increment if current dialog chunk is
    //at it's end
    if(!gTalk.isInitialized){
        ++gDialogCounter;
    }
}

/**
 * dialog_zeichneDialog(textToDraw)
 *
 * Actual drawing routine. Based on the state of the
 * gDialogCounter, this functions grabs the appropriate
 * dialogblock object, and displays it in the dialogbox
 * sentencewise. If a dialog has it's trigger_quizstep flag
 * enabled, this function invokes quiz proceeding based on
 * the enable_at_start flag at the end or at start of a dialog
 * block.
 *
 * Input values:
 * textToDraw (String) - default is 'undefined', string is then taken from 'Satz' object
 *
 * Return values:
 * none
 */
function dialog_zeichneDialog()
{
    //fetch dialog IDs
    var dialogIDs = fetchDialogIDs();

    //Check whether sentence triggers event exception
    if(dialogIDs[gDialogCounter + gSubDialogOffset].invoke_scene_exception != '#none#' &&
            parseInt(dialogIDs[gDialogCounter + gSubDialogOffset].invoke_scene_exception.split(':')[1]) == gTalk.SatzCounter){

        triggerException(dialogIDs[gDialogCounter + gSubDialogOffset].invoke_scene_exception.split(':')[0],
                         dialogIDs[gDialogCounter + gSubDialogOffset].argument_list);
    }

    //check if a triggered scene exception forces
    //another dialog to be displayed
    if(gForceOtherDialog && /^szene\d\.\d{1,2}(\.\d{1,2}|)$/.test(gDialogToForce)){
        gTalk.dialog_id     = gDialogToForce;
        gTalk.isInitialized = false;
        gTalk.SatzCounter   = 0;
    }

    //access dialogdata
    if(!gTalk.isInitialized){
        gTalk.currentDialog = gUseDeprecatedDialogues ? gDeprecatedDialogues[gTalk.dialog_id] : gDialoge[gTalk.dialog_id];
        gTalk.SatzMax       = gTalk.currentDialog.saetze.length;
        gTalk.isInitialized = true;
    }

    //check if a scene exception triggered another dialog instead planned one
    if(gForceOtherDialog){

        for(var idx = 0; idx < dialogIDs.length; ++idx){

            if(dialogIDs[idx].scene_id == gDialogToForce){

                //Check whether dialog triggers quizstep
                if((gTalk.SatzCounter == 0) && dialogIDs[idx].trigger_quizstep && dialogIDs[idx].enable_at_start ||
                        (gTalk.SatzCounter >= (gTalk.SatzMax - 1)) && dialogIDs[idx].trigger_quizstep && !dialogIDs[idx].enable_at_start){
                    //call this with forced flag if its the last sentence
                    advanceQuizStep("CalledByDialogue");
                }
            }
        }
    }else{

        //Check whether dialog triggers quizstep
        if((gTalk.SatzCounter == 0) && dialogIDs[gDialogCounter + gSubDialogOffset].trigger_quizstep && dialogIDs[gDialogCounter + gSubDialogOffset].enable_at_start||
                (gTalk.SatzCounter >= (gTalk.SatzMax - 1)) && dialogIDs[gDialogCounter + gSubDialogOffset].trigger_quizstep && !dialogIDs[gDialogCounter + gSubDialogOffset].enable_at_start){
            //call this with forced flag if its the last sentence
            advanceQuizStep("CalledByDialogue");
        }
    }

    var Satz   = gTalk.currentDialog.saetze[gTalk.SatzCounter];
    var Text   = Satz.inhalt;

    Text = swapProxiesWithNames(Text);

    //marks an unfinished text chunk
    if(gTalk.SatzCounter < gTalk.SatzMax - 1){
        Text += '   >>';
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

    //draw character image
    ctx.drawImage( gBilder[Satz.bild_id].bild,
                  ProtImgXPos,
                  ProtImgYPos,
                  ProtImgWidth,
                  ProtImgHeight
                  );

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
        gForceOtherDialog   = false;
        gDialogToForce      = '';
    }
}

/**
 * dialog_SatzZeilenBruch(text, pixelSize)
 *
 * This function is responsible for the formatting
 * of the single sentences. If a sentence is too long
 * to be displayed in one line, it is splitted into
 * multiple lines, for a correct text depiction.
 *
 * Input values:
 * text (String) - The text to be displayed
 * pixelSize (Number) - Actual size one character needs
 *
 * Return values:
 * result (String) - The formatted text
 */
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
 * advanceDialogStep(string imgID)
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
function advanceDialogStep(imgID, canvasID){

    //check if the clicked object is clickable for the current scene step
    var rawID = $("canvas[id*='" + canvasID + "']").attr("id").split(":")[2];

    if(rawID.split('|')[gCurrentQuizstep] === 'f'){
        return;
    }

    var dialogIDs           = fetchDialogIDs();
    gIncreaseDialogStep     = true;

    for(var idx = 0; idx < gImageToObjectSceneReferrer.length; ++idx){

        if(imgID === gImageToObjectSceneReferrer[idx].bildID){
            var sceneDialogues = gImageToObjectSceneReferrer[idx].scenes;

            for(var idx2 = 0; idx2 < sceneDialogues.length; ++idx2){

                //Check if clicked object is linked to a sub-dialog
                //If yes, this requires special care, to handle sub-dialogues
                //correctly
                gIncreaseDialogStep = testIfSubDialog(sceneDialogues[idx2].toLowerCase());

                //stop if gDialog is not defined...something
                //really wrong is going on then!
                if(typeof(gUseDeprecatedDialogues ?
                          gDeprecatedDialogues[dialogIDs[gDialogCounter + gSubDialogOffset].scene_id] :
                          gDialoge[dialogIDs[gDialogCounter + gSubDialogOffset].scene_id]) === 'undefined'){
                    alert('undefined dialog in gDialoge[]!');
                    return;
                }

                //if it's the wrong dialog skip it,
                //but only if we are not in the middle
                //of a text chunk, otherwise the click
                //onto the dialogbox would be blocked
                if((sceneDialogues[idx2].toLowerCase() != dialogIDs[gDialogCounter + gSubDialogOffset].scene_id.toLowerCase()) && !gTalk.isInitialized){
                    continue;
                }

                gTalk.dialog_id = gTalk.isInitialized ? gTalk.dialog_id : dialogIDs[gDialogCounter + gSubDialogOffset].scene_id;

                dialog_zeichneDialog();

                //Only increment if current dialog chunk is
                //at it's end
                if(!gTalk.isInitialized){

                    if(gIncreaseDialogStep){
                        ++gDialogCounter;
                        gDialogCounter += gIncreaseDialogStep ? gSubDialogCount > 0 ? (gSubDialogCount - 1) : gSubDialogCount : 0;

                        gSubDialogCount     = 0;
                    }

                    gSubDialogOffset = 0;
                }

                break; //When current dialog was displayed stop looping
            }

            break; //When current dialog was displayed stop looping
        }
    }
}

/**
 * testIfSubDialog()
 *
 * Check if passed dialog id belongs to a sub-dialog.
 * If that's the case, the dialog will be treated differently.
 *
 * Input values:
 * sceneDialog (String) - id of dialog block which is inspected
 *
 * Return values:
 * Boolean - True if the last dialog of a sub-dialog chain was clicked,
 *           else this will be false, to prevent dialog counter from
 *           being increased.
 */
function testIfSubDialog(sceneDialog){

    if(patternTest(sceneDialog) == null || idIsBlacklisted(sceneDialog) || gTalk.isInitialized){
        return true;
    }

    gSubDialogBlacklist.push(new BlacklistIDObject(sceneDialog, gDialogCounter));

    var subDialogues = new Array();
    var splittedID   = sceneDialog.split('.');
    var dialogIDs    = fetchDialogIDs();

    //extract sub dialogs
    for(var idx = 0; idx < dialogIDs.length; ++idx){
        if(patternTest(dialogIDs[idx].scene_id.toLowerCase(),
                       new RegExp('^' + splittedID[0] + '\.' + splittedID[1] + '\.\\d{1,2}$')) != null){
            subDialogues.push(dialogIDs[idx]);
        }
    }

    gSubDialogCount = subDialogues.length;

    //get offset for correct sub-dialog
    for(var idx = 0; idx < gSubDialogCount; ++idx){
        if(subDialogues[idx].scene_id.toLowerCase() == sceneDialog){

            //save offset
            gSubDialogOffset = idx;

            //enable flag to increase dialog counter (only it's the last sub-dialog)
            //this is based on the fact, that always the last sub-dialog triggers next quizstep
            return (idx == (gSubDialogCount - 1)) ? true : false;
        }
    }
}

/**
 * fetchDialogIDs()
 *
 * Load correct dialog IDs
 * depending on the current game state
 *
 * Input values:
 * none
 *
 * Return values:
 * dialog IDs
 */
function fetchDialogIDs(){
    if(gDialogCounter == (gUseDeprecated ? gDeprecatedNumberOfDialogues : gNumberOfDialogues) - 1){
        return gDeprecatedDialogIDs;
    }else{
        return gDialogIDs;
    }
}

/**
 * patternTest(string)
 *
 * Tests a string for
 * the /^szene\d.\d.\d$/
 * RegEx pattern.
 *
 * Input values:
 * string (String) - The strings to test,
 *                   if the stated pattern matches
 *
 * pattern (RegExp) - user defined pattern to
 *                    check for in given string
 *
 * Return values:
 * string - Returns the content of the string
 *          if it's a match else null is returned
 */
function patternTest(string, pattern){
    return string.match(typeof(pattern) == 'undefined' ? /^szene\d\.\d{1,2}\.\d{1,2}$/ : pattern);
}

/**
 * idIsBlacklisted(string)
 *
 * Checks if given
 * id string is on a blacklist.
 *
 * Input values:
 * string (String) - ID to check for
 *
 * Return values:
 * (Boolean) - True if it's on the list, flase if not.
 */
function idIsBlacklisted(string){

    for(var idx = 0; idx < gSubDialogBlacklist.length; ++idx){
        if(gSubDialogBlacklist[idx].scene_id == string &&
                gSubDialogBlacklist[idx].counter_step != gDialogCounter){
            return true;
        }
    }

    return false;
}
