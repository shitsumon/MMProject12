/*
    sceneParser.js - Parses XML documents to create a HTML view of the specified scene

    Written to implement a comfortable way of creating HTML documents
    which represent scenes of the games. The parser extracts any vital
    information from specified XML documents and uses the extracted
    information to create a proper looking game scene.
*/

/*
    getSceneElementData()

    Parses an XML object for an elements
    information and stores it in temporary
    object which is then returned.

    Input arguments:

    sceneElement - XML object which contains information

    Return values:

    tmpObject - has type objectStruct, which will be stored
                in sceneStruct wrapper Object
*/
function getSceneElementData(sceneElement){

    tmpObject = new objectStruct(sceneElement.attr('bild_id'),
                                 sceneElement.attr('dialog_id'));
    tmpObject.position.xPos = parseInt(sceneElement.find('position').attr('x'));
    tmpObject.position.yPos = parseInt(sceneElement.find('position').attr('y'));
    tmpObject.size.width    = parseInt(sceneElement.find('groesse').attr('width'));
    tmpObject.size.height   = parseInt(sceneElement.find('groesse').attr('height'));
    tmpObject.clickable     = sceneElement.attr('klickbar') === "true";

    return tmpObject;
}

/*
    getPersonElementData()

    Parses an XML object for an persons
    information and stores it in temporary
    person object which is then returned.

    Input arguments:

    sceneElement - XML object which contains information

    Return values:

    tmpObject - has type personStruct, which will be stored
                in sceneStruct wrapper Object
*/
function getPersonElementData(sceneElement){

    tmpObject = new personStruct(sceneElement.attr('person_id'),
                                 sceneElement.attr('bild_id'));
    tmpObject.position.xPos = parseInt(sceneElement.find('position').attr('x'));
    tmpObject.position.yPos = parseInt(sceneElement.find('position').attr('y'));
    tmpObject.size.width    = parseInt(sceneElement.find('groesse').attr('width'));
    tmpObject.size.height   = parseInt(sceneElement.find('groesse').attr('height'));

    return tmpObject;
}

/*
    getSceneInformation() -

    Extracts all information which are stated
    within the tags of specified scene ID.

    Input arguments:

    sceneID - ID of the scene to create
    sceneFilename - filename of the XML file where the information are located

    Return value:

    None
*/
function getSceneInformation(sceneID, sceneFilename){

    /*check for input filename, else use default*/
    sceneFilename = typeof sceneFilename === 'undefined' ? "testSzenen.xml" : sceneFilename;

    /*Create new scene structure object*/
    var sceneObject = new sceneStruct(sceneID);


    /*Extract scene information from xml file*/
    $.get(sceneFilename, function(data){
              $(data).find('szene').each(function(){

                var currentScene = $(this);

                    if(sceneID === currentScene.attr('id')){

                        $(currentScene).find('hg_statisch_objekt').each(function(){
                            sceneObject.staticBackgroundObjects.push(getSceneElementData($(this)));
                        })

                        $(currentScene).find('hg_animiert_objekt').each(function(){
                            sceneObject.dynamicBackgroundObjects.push(getSceneElementData($(this)));
                        })

                        $(currentScene).find('vg_statisch_objekt').each(function(){
                            sceneObject.staticForegroundObjects.push(getSceneElementData($(this)));
                        })

                        $(currentScene).find('vg_animiert_objekt').each(function(){
                            sceneObject.dynamicForegroundObjects.push(getSceneElementData($(this)));
                        })

                        $(currentScene).find('person').each(function(){
                            sceneObject.persons.push(getPersonElementData($(this)));
                        })
                    }
              })

    })

    drawScene(sceneObject);

    var breakpoint;
}

/*
    drawScene() -

    Takes a given sceneObject and draws all elements
    which are inside to the screen. This a simple wrapper for the
    single calls to drawObjectsOfSameType().

    Input arguments:

        sceneObject - Information which were retrieved by getSceneInformation()

    Return value:

        None
*/
function drawScene(sceneObject){

    //draw static background
    drawObjectsOfSameType('canvas_bg_static', sceneObject.staticBackgroundObjects, true);
    //draw dynamic background
    drawObjectsOfSameType('canvas_bg_dynamic', sceneObject.dynamicBackgroundObjects);
    //draw static foreground
    drawObjectsOfSameType('canvas_fg_static', sceneObject.staticForegroundObjects);
    //draw dynamic foreground
    drawObjectsOfSameType('canvas_fg_dynamic', sceneObject.dynamicForegroundObjects);
    //draw persons
    drawObjectsOfSameType('canvas_person', sceneObject.persons, false);
}

/*
    drawObjectsOfSameType() -

    Takes an object array of elements
    of a certain type and draws them to the screen.
    Based on each objects interactivity, the objects
    will be marked as clickable.

    Input arguments:

        sharedIdString  - static part of the id string for each canvas
                          by which the object is referenced in the stylesheet

        objectsToDraw   - contains all objects which will be drawn to screen

        hasSingleCanvas - flag which decides whether all objects are drawn into
                          one canvas or into separate canvasses. In case every
                          objects shall have its own canvas simply leave this
                          value blank, as it is set to 'false' by default.

    Return value:

        None
*/
function drawObjectsOfSameType(sharedIdString, objectsToDraw, hasSingleCanvas){

    //faulty input error checking
    if(sharedIdString === '' || sharedIdString === 'undefined'){
        alert("Id string not set!");
        return;
    }

    if(objectsToDraw === 'undefined'){
        alert("Object array uninitialized!");
        return;
    }

    hasSingleCanvas = typeof hasSingleCanvas === 'undefined' ? false : hasSingleCanvas;

    //initialization
    var screenWidth  = $(window).width();
    var screenHeight = $(window).height();
    var newCanvas;

    //draw to single canvas
    if(hasSingleCanvas){

        newCanvas = $('<canvas/>', {id: sharedIdString});

        //append to html body
        $('body').append(newCanvas);

        //Set dimensions to viewports size as it
        //will contain the background image
        newCanvas[0].width  = screenWidth;
        newCanvas[0].height = screenHeight;

        var canvasContext = newCanvas[0].getContext("2d");

        //draw objects onto canvas
        for(var index = 0; index < objectsToDraw.length; ++index){
            canvasContext.drawImage(
                                    gBilder[objectsToDraw[index].imageID].bild,
                                    perc2pix(screenWidth,  objectsToDraw[index].position.xPos),
                                    perc2pix(screenHeight, objectsToDraw[index].position.yPos),
                                    perc2pix(screenWidth,  objectsToDraw[index].size.width),
                                    perc2pix(screenHeight, objectsToDraw[index].size.height)
                                   );
        }
    }//draw to multiple canvasses
    else{

        for(var index = 0; index < objectsToDraw.length; ++index){

            //create id with a unique combination
            //of common string and index number
            var canvasID = sharedIdString + index;

            //Check if clickable, if yes set it as such
            if(objectsToDraw[index].clickable){


                newCanvas = $('<canvas/>',
                              {
                               id : canvasID,
                               onclick:'javascript:gTargetIdentifier="' + canvasID + '";heroMovement();'
                              }
                             );
            }else{
                newCanvas = $('<canvas/>', {id: canvasID});
            }

            //append to html body
            $('body').append(newCanvas);

            //object positioning
            newCanvas.css('left', objectsToDraw[index].position.xPos + '%');
            newCanvas.css('top',  objectsToDraw[index].position.yPos + '%');

            //calculate pixel dimensions from percentage values
            var pxWidth = perc2pix(gBilder[objectsToDraw[index].imageID].abmessungen.width,
                                   objectsToDraw[index].size.width);

            var pxHeight = perc2pix(gBilder[objectsToDraw[index].imageID].abmessungen.height,
                                   objectsToDraw[index].size.height);

            //set canvas dimensions
            newCanvas[0].width  = pxWidth;
            newCanvas[0].height = pxHeight;

            //get context
            canvasContext = newCanvas[0].getContext("2d");

            //draw image to its canvas
            canvasContext.drawImage(
                                    gBilder[objectsToDraw[index].imageID].bild,
                                    0,
                                    0,
                                    pxWidth,
                                    pxHeight
                                   );
        }
    }
}
