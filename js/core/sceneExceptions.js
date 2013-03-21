/**
 * sceneExceptions.js
 *
 * This file, provides an interface to all scenes,
 * which can be used to trigger functions
 * which are only used once or more often in a single scene.
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

function scene5_bookcode(arg){

    var bookIndex        = 0;
    var rightfullClicked = 0;

    for(var idx = 0; idx < gBooksClicked.length; ++idx){

        if(gBooksClicked[idx].wasClicked){
            ++rightfullClicked;
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
        ++rightfullClicked;
    }


    if(rightfullClicked == gBooksClicked.length){
        //reset global array
        for(var idx = 0; idx < gBooksClicked.length; ++idx){
            gBooksClicked[idx].wasClicked = false;
        }

        alert('Riddle solved!');
    }
}
