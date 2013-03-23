/**
 * sceneExceptions.js
 *
 * This file, provides an interface to all scenes,
 * which can be used to trigger functions
 * which are only used once or more often in a single scene.
 */

/**
 * triggerException()
 *
 * Interface function which starts a specific exception function specified
 * by passed identifier.
 *
 * Input values:
 * exceptionName (String) - Identifier which refers to a specific function
 *
 * arguments (String) - String of arguments concatenated by specific delimiter
 *
 * Return values:
 * none
 */
function triggerException(exceptionName, arguments) {
    

    switch(exceptionName){
    case 'scene5_bookcode':
    {
        if(!/book\d{1,2}/.test(arguments)){
            alert('This function requires one argument, like "book#number#"!')
            return;
        }

        scene5_bookcode(arguments);
    }
    break;
    default:
        break;
    }
}

/**
 * scene5_bookcode()
 *
 * Exception for the book riddle in scene 5. Checks clicked book
 * against an Array which contains the preset click order. When
 * all Array elements are set true, the finalizing action is triggered.
 *
 * Input values:
 * arg (String) - Name of the clicked book
 *
 * Return values:
 * none
 */
function scene5_bookcode(arg){

    var bookIndex        = 0;
    var rightfulClicked = 0;

    for(var idx = 0; idx < gBooksClicked.length; ++idx){

        if(gBooksClicked[idx].wasClicked){
            ++rightfulClicked;
        }

        if(gBooksClicked[idx].name == arg){
            bookIndex = idx;
        }
    }

    var setEntryTrue = true;

    for(var idx = 0; idx < bookIndex; ++idx){

        if(!gBooksClicked[idx].wasClicked){
            setEntryTrue = false;
            break;
        }
    }

    if(setEntryTrue){
        gBooksClicked[bookIndex].wasClicked = true;
        ++rightfulClicked;
    }


    if(rightfulClicked == gBooksClicked.length){

        //reset global array
        for(var idx = 0; idx < gBooksClicked.length; ++idx){
            gBooksClicked[idx].wasClicked = false;
        }

        gForceOtherDialog   = true;
        gDialogToForce      = "szene5.7.12";
        gIncreaseDialogStep = testIfSubDialog(gDialogToForce);
    }
}
