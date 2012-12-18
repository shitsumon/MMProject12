/*
    sceneParser.js - Parses XML documents to create a HTML view of the specified scene

    Written to implement a comfortable way of creating HTML documents
    which represent scenes of the games. The parser extracts any vital
    information from specified XML documents and uses the extracted
    information to create a proper looking game scene.
*/


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

/*Not finished*/
function drawScene(sceneObject){

    var screenWidth  = $(window).width();
    var screenHeight = $(window).height();
    var newCanvas = $('<canvas/>',{id:'canvas_bg_static'});

    $('body').append(newCanvas);

    var canvasContext = $("#canvas_bg_static")[0].getContext("2d");

    $('#canvas_bg_static')[0].width  = screenWidth;
    $('#canvas_bg_static')[0].height = screenHeight;

    //draw static background objects
    for(var index1 = 0; index1 < sceneObject.staticBackgroundObjects.length; ++index1){

            if(gBilder[sceneObject.staticBackgroundObjects[index1].imageID].id === sceneObject.staticBackgroundObjects[index1].imageID){

                canvasContext.drawImage(
                                        gBilder[sceneObject.staticBackgroundObjects[index1].imageID].bild,
                                        perc2pix(screenWidth, parseInt(sceneObject.staticBackgroundObjects[index1].position.xPos)),
                                        perc2pix(screenHeight, parseInt(sceneObject.staticBackgroundObjects[index1].position.yPos)),
                                        perc2pix(screenWidth, parseInt(sceneObject.staticBackgroundObjects[index1].size.width)),
                                        perc2pix(screenHeight, parseInt(sceneObject.staticBackgroundObjects[index1].size.height))
                                       );
            }
    }

    //draw dynamic background objects
    for(var index1 = 0; index1 < sceneObject.dynamicBackgroundObjects.length; ++index1){

            if(gBilder[sceneObject.dynamicBackgroundObjects[index1].imageID].id === sceneObject.dynamicBackgroundObjects[index1].imageID){

                var canvasID = 'canvas_bg_dynamic' + index1;

                if(sceneObject.dynamicBackgroundObjects[index1].clickable){

                    alert("clickable");

                newCanvas = $('<canvas/>',
                              {
                               id : canvasID,
                               onclick:'javascript:gTargetIdentifier=' + canvasID + ';heroMovement();'
                              }
                             );

                }else{

                    newCanvas = $('<canvas/>',{'id': canvasID});
                }

                $('body').append(newCanvas);

//                alert("Screenheight: " + screenHeight + " Screenwidth: " + screenWidth);

//                alert("New Pos: " + perc2pix(screenWidth,  parseInt(sceneObject.dynamicBackgroundObjects[index1].position.xPos)) + "/" +
//                      perc2pix(screenHeight, parseInt(sceneObject.dynamicBackgroundObjects[index1].position.yPos)));


                var pxWidth = perc2pix(gBilder[sceneObject.dynamicBackgroundObjects[index1].imageID].abmessungen.width,
                                       sceneObject.dynamicBackgroundObjects[index1].size.width);

                var pxHeight = perc2pix(gBilder[sceneObject.dynamicBackgroundObjects[index1].imageID].abmessungen.height,
                                       sceneObject.dynamicBackgroundObjects[index1].size.height);

                $('#' + canvasID)[0].width  = pxWidth;

                $('#' + canvasID)[0].height = pxHeight;

                var newPos = {
                    left: perc2pix(screenWidth,  parseInt(sceneObject.dynamicBackgroundObjects[index1].position.xPos)),
                    top:  perc2pix(screenHeight, parseInt(sceneObject.dynamicBackgroundObjects[index1].position.yPos))
                };

                $(canvasID).offset(newPos);

                canvasContext = $('#' + canvasID)[0].getContext("2d");

                canvasContext.drawImage(
                                        gBilder[sceneObject.dynamicBackgroundObjects[index1].imageID].bild,
                                        0,
                                        0,
                                        pxWidth,
                                        pxHeight
                                       );
            }
    }
}

function getSceneElementData(sceneElement){

    tmpObject = new objectStruct(sceneElement.attr('bild_id'),
                                 sceneElement.attr('dialog_id'),
                                 sceneElement.attr('klickbar') === "true");
    tmpObject.position.xPos = parseInt(sceneElement.find('position').attr('x'));
    tmpObject.position.yPos = parseInt(sceneElement.find('position').attr('y'));
    tmpObject.size.width    = parseInt(sceneElement.find('groesse').attr('width'));
    tmpObject.size.height   = parseInt(sceneElement.find('groesse').attr('height'));

    return tmpObject;
}

function getPersonElementData(sceneElement){

    tmpObject = new personStruct(sceneElement.attr('id'),
                                 sceneElement.attr('bild_id'));
    tmpObject.position.xPos = parseInt(sceneElement.find('position').attr('x'));
    tmpObject.position.yPos = parseInt(sceneElement.find('position').attr('y'));
    tmpObject.size.width    = parseInt(sceneElement.find('groesse').attr('width'));
    tmpObject.size.height   = parseInt(sceneElement.find('groesse').attr('height'));

    return tmpObject;
}
