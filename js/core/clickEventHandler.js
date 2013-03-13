/**
 * clickEventHandler.js
 *
 * Handles all function calls which are invoked by clicking on a canvas.
 * Makes sure that the single parts of the event are called in the right
 * order, and do not interfere with each other.
 */

/**
 * startEventHandling()
 *
 * This is the fundamental function call
 * which is started in the HTML-OnClick Event.
 *
 * Each click event triggers the following
 * chain of action:
 *
 * - set gTargetIdentifier      -> set aim of walk animation
 * - start bewegePerson()       -> walk animation
 * - start advanceQuizStep()    -> proceeds in scene quiz
 * - start justClicked()        -> trigger dialog
 *
 * It's the responsibility of startEventHandling()
 * to make sure these functioncalls do not interfere
 * with each other.
 *
 * Input values:
 * LUT_Identifier (string) - Lookup table identifier which references the correct value string
 *
 * Return values:
 * none
 */
function startEventHandling(LUT_Identifier){
    
    var parsedStringObject = new Object();

    for(var idx = 0; idx < gClickEventValueArray.length; ++idx){

        if(gClickEventValueArray[idx]['key'] == LUT_Identifier){

            parsedStringObject = parseValueString(gClickEventValueArray[idx]['value']);
            break;
        }
    }

    if(!gTalk.isInitialized){

        if(!gEventHandlerBusy){
            gTargetIdentifier = parsedStringObject.targetIdentifier;
            bewegePerson();
        }

        if(gEventHandlerBusy && !gQuizAndDialogArgumentsLocked){
            gQuizFlags = parsedStringObject.quizFlags;
        }else{
            advanceQuizStep(parsedStringObject.quizFlags);
        }
    }

    if(gEventHandlerBusy && !gQuizAndDialogArgumentsLocked){
        gDialogValue1 = parsedStringObject.dialogValue1;
        gDialogValue2 = parsedStringObject.dialogValue2;

        //Lock arguments to prevent change of target
        gQuizAndDialogArgumentsLocked = true;
    }else{
        advanceDialogStep(parsedStringObject.dialogValue1, parsedStringObject.dialogValue2);
    }
}

/**
 * finishEventHandling()
 *
 * Triggers next quiz step and next dialog
 * when the walk animation is finished.
 * Is called by bewegePerson().
 *
 * Input values:
 * none
 *
 * Return values:
 * none
 */
function finishEventHandling(){

    //activate functions with saved arguments
    advanceQuizStep(gQuizFlags);
    advanceDialogStep(gDialogValue1, gDialogValue2);

    //unlock, after functions have been
    //called with correct arguments
    gQuizAndDialogArgumentsLocked = false;
}

/**
 * parseValueString()
 *
 * Takes the value string from the generated lookup table,
 * and parses it into an array which is easier to handle.
 *
 * A common value string looks like the following example.
 *
 * 'canvas_bg_dynamic_szene2_sitz:t|f|f|f|f|f|f+t|f|f|f|f|f|f+szene2_sitz+canvas_bg_dynamic_szene2_sitz'
 *
 * The single string parts can be separated by using the '+' as delimiter.
 *
 * Input values:
 * valueString (string) - string with all necessary information to invoke sub-calls correctly
 *
 * Return values:
 * valueArray (Array) - array with correctly parsed values
 */
function parseValueString(valueString){

    var rawStrings = valueString.split('+');

    return {
        targetIdentifier : rawStrings[0] + ":" + rawStrings[2],
        quizFlags        : rawStrings[1],
        dialogValue1     : rawStrings[3],
        dialogValue2     : rawStrings[0].split(':')[0]
    }
}
