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

    var canvasContext = newCanvas[0].getContext("2d");

    newCanvas[0].width  = screenWidth;
    newCanvas[0].height = screenHeight;

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
    for(index1 = 0; index1 < sceneObject.dynamicBackgroundObjects.length; ++index1){

            if(gBilder[sceneObject.dynamicBackgroundObjects[index1].imageID].id === sceneObject.dynamicBackgroundObjects[index1].imageID){

                var canvasID = 'canvas_bg_dynamic' + index1;

                if(sceneObject.dynamicBackgroundObjects[index1].clickable){

                newCanvas = $('<canvas/>',
                              {
                               id : canvasID,
                                  onclick:'javascript:gTargetIdentifier="' + canvasID + '";heroMovement();'
                              }
                             );

                }else{

                    newCanvas = $('<canvas/>',{'id': canvasID});
                }

                $('body').append(newCanvas);

                newCanvas.css('left', sceneObject.dynamicBackgroundObjects[index1].position.xPos + '%');
                newCanvas.css('top', sceneObject.dynamicBackgroundObjects[index1].position.yPos + '%');

                var pxWidth = perc2pix(gBilder[sceneObject.dynamicBackgroundObjects[index1].imageID].abmessungen.width,
                                       sceneObject.dynamicBackgroundObjects[index1].size.width);

                var pxHeight = perc2pix(gBilder[sceneObject.dynamicBackgroundObjects[index1].imageID].abmessungen.height,
                                       sceneObject.dynamicBackgroundObjects[index1].size.height);

                newCanvas[0].width  = pxWidth;

                newCanvas[0].height = pxHeight;


                canvasContext = newCanvas[0].getContext("2d");

                canvasContext.drawImage(
                                        gBilder[sceneObject.dynamicBackgroundObjects[index1].imageID].bild,
                                        0,
                                        0,
                                        pxWidth,
                                        pxHeight
                                       );

            }
    }

    //draw static foreground objects
    for(index1 = 0; index1 < sceneObject.staticForegroundObjects.length; ++index1){

            if(gBilder[sceneObject.staticForegroundObjects[index1].imageID].id === sceneObject.staticForegroundObjects[index1].imageID){

                var canvasID = 'canvas_fg_static' + index1;

                if(sceneObject.staticForegroundObjects[index1].clickable){

                newCanvas = $('<canvas/>',
                              {
                               id : canvasID,
                                  onclick:'javascript:gTargetIdentifier="' + canvasID + '";heroMovement();'
                              }
                             );

                }else{

                    newCanvas = $('<canvas/>',{'id': canvasID});
                }

                $('body').append(newCanvas);

                newCanvas.css('left', sceneObject.staticForegroundObjects[index1].position.xPos + '%');
                newCanvas.css('top', sceneObject.staticForegroundObjects[index1].position.yPos + '%');

                var pxWidth = perc2pix(gBilder[sceneObject.staticForegroundObjects[index1].imageID].abmessungen.width,
                                       sceneObject.staticForegroundObjects[index1].size.width);

                var pxHeight = perc2pix(gBilder[sceneObject.staticForegroundObjects[index1].imageID].abmessungen.height,
                                       sceneObject.staticForegroundObjects[index1].size.height);

                newCanvas[0].width  = pxWidth;

                newCanvas[0].height = pxHeight;


                canvasContext = newCanvas[0].getContext("2d");

                canvasContext.drawImage(
                                        gBilder[sceneObject.staticForegroundObjects[index1].imageID].bild,
                                        0,
                                        0,
                                        pxWidth,
                                        pxHeight
                                       );

            }
    }


    //draw dynamic foreground objects
    for(index1 = 0; index1 < sceneObject.dynamicForegroundObjects.length; ++index1){

            if(gBilder[sceneObject.dynamicForegroundObjects[index1].imageID].id === sceneObject.dynamicForegroundObjects[index1].imageID){

                var canvasID = 'canvas_fg_dynamic' + index1;

                if(sceneObject.dynamicForegroundObjects[index1].clickable){

                newCanvas = $('<canvas/>',
                              {
                               id : canvasID,
                                  onclick:'javascript:gTargetIdentifier="' + canvasID + '";heroMovement();'
                              }
                             );

                }else{

                    newCanvas = $('<canvas/>',{'id': canvasID});
                }

                $('body').append(newCanvas);

                newCanvas.css('left', sceneObject.dynamicForegroundObjects[index1].position.xPos + '%');
                newCanvas.css('top', sceneObject.dynamicForegroundObjects[index1].position.yPos + '%');

                var pxWidth = perc2pix(gBilder[sceneObject.dynamicForegroundObjects[index1].imageID].abmessungen.width,
                                       sceneObject.dynamicForegroundObjects[index1].size.width);

                var pxHeight = perc2pix(gBilder[sceneObject.dynamicForegroundObjects[index1].imageID].abmessungen.height,
                                       sceneObject.dynamicForegroundObjects[index1].size.height);

                newCanvas[0].width  = pxWidth;

                newCanvas[0].height = pxHeight;


                canvasContext = newCanvas[0].getContext("2d");

                canvasContext.drawImage(
                                        gBilder[sceneObject.dynamicForegroundObjects[index1].imageID].bild,
                                        0,
                                        0,
                                        pxWidth,
                                        pxHeight
                                       );

            }
    }

    //draw person objects
    for(index1 = 0; index1 < sceneObject.persons.length; ++index1){

            if(gBilder[sceneObject.persons[index1].imageID].id === sceneObject.persons[index1].imageID){

                var canvasID = 'canvas_person' + index1;

                newCanvas = $('<canvas/>',{'id': canvasID});

                $('body').append(newCanvas);

                newCanvas.css('left', sceneObject.persons[index1].position.xPos + '%');
                newCanvas.css('top', sceneObject.persons[index1].position.yPos + '%');
//                newCanvas.css('width', sceneObject.persons[index1].size.width + '%');
//                newCanvas.css('height', sceneObject.persons[index1].size.height + '%');


                var pxWidth = perc2pix(gBilder[sceneObject.persons[index1].imageID].abmessungen.width,
                                       sceneObject.persons[index1].size.width);

                var pxHeight = perc2pix(gBilder[sceneObject.persons[index1].imageID].abmessungen.height,
                                       sceneObject.persons[index1].size.height);

                newCanvas[0].width  = pxWidth;
                newCanvas[0].height = pxHeight;


                canvasContext = newCanvas[0].getContext("2d");

                canvasContext.drawImage(
                                        gBilder[sceneObject.persons[index1].imageID].bild,
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
                                 sceneElement.attr('dialog_id'));
    tmpObject.position.xPos = parseInt(sceneElement.find('position').attr('x'));
    tmpObject.position.yPos = parseInt(sceneElement.find('position').attr('y'));
    tmpObject.size.width    = parseInt(sceneElement.find('groesse').attr('width'));
    tmpObject.size.height   = parseInt(sceneElement.find('groesse').attr('height'));
    tmpObject.clickable     = sceneElement.attr('klickbar') === "true";

    return tmpObject;
}

function getPersonElementData(sceneElement){

    tmpObject = new personStruct(sceneElement.attr('person_id'),
                                 sceneElement.attr('bild_id'));
    tmpObject.position.xPos = parseInt(sceneElement.find('position').attr('x'));
    tmpObject.position.yPos = parseInt(sceneElement.find('position').attr('y'));
    tmpObject.size.width    = parseInt(sceneElement.find('groesse').attr('width'));
    tmpObject.size.height   = parseInt(sceneElement.find('groesse').attr('height'));

    return tmpObject;
}
