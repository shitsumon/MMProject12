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
    case 'scene5_generateCode':
        if(!/question\d/.test(arguments)){
            alert('This function requires one argument, like "question1"!')
            return;
        }

        scene5_generateSecureCode(arguments);
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

/**
 * scene5_generateSecureCode()
 *
 * Exception for the secure password generation riddle.
 * Depending on the passed argument, this function will
 * generate new quiz text in the quiz boxes.
 *
 *
 * Input values:
 * arg (String) - Name of the clicked answer
 *
 * Return values:
 * none
 */
function scene5_generateSecureCode(arg){


    var q_canvas = $("canvas[id*='frage_underlay']");
    var ctx_q    = q_canvas[0].getContext("2d");
    ctx_q.clearRect(0,0,q_canvas.width, q_canvas.height);

    var a1_canvas = $("canvas[id*='antwort_a_underlay']");
    var ctx_a1    = a1_canvas[0].getContext("2d");
    ctx_a1.clearRect(0,0,a1_canvas.width,a1_canvas.height);

    var a2_canvas = $("canvas[id*='antwort_b_underlay']");
    var ctx_a2    = a2_canvas[0].getContext("2d");
    ctx_a2.clearRect(0,0,a2_canvas.width,a2_canvas.height);

    var a3_canvas = $("canvas[id*='antwort_c_underlay']");
    var ctx_a3    = a3_canvas[0].getContext("2d");
    ctx_a3.clearRect(0,0,a3_canvas.width,a3_canvas.height);

    var a4_canvas = $("canvas[id*='antwort_d_underlay']");
    var ctx_a4    = a4_canvas[0].getContext("2d");
    ctx_a4.clearRect(0,0,a4_canvas.width,a4_canvas.height);

    var ctx_Array = new Array(ctx_a1, ctx_a2, ctx_a3, ctx_a4);

    switch(arg){
    case 'question0':
        break;
    case 'question1':
        break;
    case 'question2':
        break;
    case 'question3':
        break;
    }
}
