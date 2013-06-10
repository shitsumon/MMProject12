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
outputDebugInfo();

    var tmpObject		= new objectStruct(sceneElement.attr('bild_id'),
                                           sceneElement.attr('dialog_id'));

    //Create a lookup table which maps the imageID to it's
    //dialogIDs
    if(sceneElement.attr('dialog_id') !== '#none#'){
        var img2SceneObj = new Object();
        //alert(sceneElement.attr('dialog_id'));
        img2SceneObj.bildID = sceneElement.attr('bild_id');
        img2SceneObj.scenes = sceneElement.attr('dialog_id').split('|');
        gImageToObjectSceneReferrer.push(img2SceneObj);
    }

    //get quiz attributes					-> string like "t|f|t|f"
    tmpObject.quiz[0] = sceneElement.attr('raetsel_sichtbar');	//visibility
    tmpObject.quiz[1] = sceneElement.attr('raetsel_ausloeser');	//quiztrigger
    //get clickable and walkto attributes	-> string like "t|f|t|f"
    tmpObject.quiz[2] = sceneElement.attr('klickbar');			//clickable
    tmpObject.quiz[3] = sceneElement.attr('walkto');			//walkto

    return getElementData(tmpObject, sceneElement);
}

/*
    getPersonElementData()

    Parses an XML object for a persons
    information and stores it in temporary
    person object which is then returned.

    Input arguments:

    sceneElement - XML object which contains information

    Return values:

    tmpObject - has type personStruct, which will be stored
                in sceneStruct wrapper Object
*/
function getPersonElementData(sceneElement){
outputDebugInfo();

    var tmpObject = new personStruct(sceneElement.attr('person_id'),
                                     sceneElement.attr('bild_id'));

    return getElementData(tmpObject, sceneElement);
}

function getElementData(tmpObject, sceneElement){
outputDebugInfo();

    tmpObject.position.xPos = parseFloat(sceneElement.find('position').attr('x'));
    tmpObject.position.yPos = parseFloat(sceneElement.find('position').attr('y'));
    tmpObject.position.zPos = parseFloat(sceneElement.find('position').attr('z'));
    tmpObject.size.width    = parseFloat(sceneElement.find('groesse').attr('width'));
    tmpObject.size.height   = parseFloat(sceneElement.find('groesse').attr('height'));
	
	var laufziel = sceneElement.find('laufziel');
	
	if( (typeof(laufziel.attr('x')) !== "undefined") && (typeof(laufziel.attr('y')) !== "undefined") )
	{
		tmpObject.laufziel = new Position
			(
				parseFloat(laufziel.attr('x')), 
				parseFloat(laufziel.attr('y')), 
				-1
			);
	}

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
outputDebugInfo();

    /*check for input filename, else use default*/
    sceneFilename = typeof( sceneFilename ) === 'undefined' ? sceneXML : sceneFilename;

    /*Create new scene structure object*/
    var sceneObject = new sceneStruct(sceneID);

    /*Extract scene information from xml file*/
    $.get(sceneFilename, function(data){
        $(data).find('szene').each(function(){

            var currentScene = $(this);

            if(sceneID === currentScene.attr('id')){
                //get quiz step count
                gQuizsteps	= $(currentScene).attr('reatselschritte').length == 0 ? 0 :
                                                                                    parseInt($(currentScene).attr('reatselschritte'));
                //get space animation variable
                gSpace  = $(currentScene).find('weltall').attr("spc") == "false" ? false : true;
				
				//get waypoints of central path
                var wegpunkte	= $(currentScene).find('wegpunkt');

                //create corresponding arrays
                gWegPos			= new Array(wegpunkte.length);
                gZoomsteps		= new Array(wegpunkte.length);

                wegpunkte.each(function(index){
                    //get waypoint coordinates and store as array
                    gWegPos[index] = new Array(
                                parseFloat($(this).attr("x")),
                                parseFloat($(this).attr("y"))
                                );
                    //get corresponding zoomstep multiplicator
                    gZoomsteps[index] = parseFloat($(this).attr("zoom"));
                })

                //get all scene objects by level
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

        drawScene(sceneObject);
        //scene computation finished, prevent next scene from loading before pictures and dialogues have
        gdisplay_next_scene = false;

        //hide menu
        HideElementsMenu();
		
		//hides her in scene 1 while she's asleep
		scene1_hideHeroine();

        //force initial dialog if needed
        if(sceneNeedsForcedDialog()){
            forceDialog();
        }

        //Make sure that gImageToObjectSceneReferrer only
        //contains scene relevant objects
        var tmpArray  = new Array();
        var regex1    = new RegExp("^szene" + gcurrent_scene_counter + ".*$");

        for(var idx = 0 ; idx < gImageToObjectSceneReferrer.length; ++idx){

            //filter all objects with bildIDs of the current scene
            if(regex1.test(gImageToObjectSceneReferrer[idx].bildID)){
                tmpArray.push(gImageToObjectSceneReferrer[idx]);
            }

            //filter all objects which have 'allg_' as substring in their bildID
            //and contain dialog IDs of current scene
            if(/^allg_.*$/.test(gImageToObjectSceneReferrer[idx].bildID)){

                for(var idx2 = 0; idx2 < gImageToObjectSceneReferrer[idx].scenes.length; ++idx2){
                    if(regex1.test(gImageToObjectSceneReferrer[idx].scenes[idx2])){
                        tmpArray.push(gImageToObjectSceneReferrer[idx]);
                        break;
                    }
                }
            }
        }

        gImageToObjectSceneReferrer = tmpArray;
		
		if( gLoadByCode ){
		//called if a code was entered to load the scene
			advanceSceneToLastSavestate();
			gLoadByCode = false;
		}

    }).error(function(xhr, status, error){
        alert("Es ist ein Fehler aufgetreten: " + error);
    });
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
outputDebugInfo();

    if(gDemoMode && gcurrent_scene_id == gStopAtScene){
        return;
    }

    //draw static background
    drawObjectsOfSameType('canvas_bg_static', sceneObject.staticBackgroundObjects, true);
    //draw dynamic background
    drawObjectsOfSameType('canvas_bg_dynamic', sceneObject.dynamicBackgroundObjects);
    //draw static foreground
    drawObjectsOfSameType('canvas_fg_static', sceneObject.staticForegroundObjects);
    //draw dynamic foreground
    drawObjectsOfSameType('canvas_fg_dynamic', sceneObject.dynamicForegroundObjects);
    //draw persons
    drawObjectsOfSameType('canvas_person', sceneObject.persons);
    //create dialogues textbox
    $('body').append($('<canvas/>', {id: 'textbox'}));
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
outputDebugInfo();

    //faulty input error checking
    if(typeof(sharedIdString) === 'undefined' || sharedIdString === ''){
        alert("Id string not set!");
        return;
    }

    if(typeof(objectsToDraw) === 'undefined'){
        alert("Object array uninitialized!");
        return;
    }

    //determines whether all pictures are drawn to one single canvas like in bg_static
    hasSingleCanvas = typeof( hasSingleCanvas ) === 'undefined' ? false : hasSingleCanvas;

    //initialization
    var screenWidth  = $(window).width();
    var screenHeight = $(window).height();
    var newCanvas;
    //css-class of quiz elements
    var quizClass;

    //draw to single canvas -> bg_static
    if(hasSingleCanvas){

        newCanvas = $('<canvas/>', {
                          id: sharedIdString
                      });

        //append to html body
        $('body').append(newCanvas);

        //Set dimensions to viewports size as it will contain the background image
        newCanvas[0].width  = screenWidth;
        newCanvas[0].height = screenHeight;

        var canvasContext = newCanvas[0].getContext("2d");

        //sort objects following .position.zPos -> z order
        objectsToDraw.sort(function(a, b){
            return a.position.zPos - b.position.zPos;
        });

		var imageStat;
		
        //draw objects onto canvas
        for(var index = 0; index < objectsToDraw.length; ++index){

			imageStat = new imageStatObject(objectsToDraw[index]['imageID'],
                                                 objectsToDraw[index]['position'],
                                                 objectsToDraw[index]['size']
												);
												
			if(objectsToDraw[index]['laufziel'] != null)
			{
				imageStat.laufziel = objectsToDraw[index]['laufziel'];
			}
			
            gImageStats.push(imageStat);

            try{
                canvasContext.drawImage(
                            gBilder[objectsToDraw[index].imageID].bild,
                            perc2pix(screenWidth,  objectsToDraw[index].position.xPos),
                            perc2pix(screenHeight, objectsToDraw[index].position.yPos),
                            perc2pix(screenWidth,  objectsToDraw[index].size.width),
                            perc2pix(screenHeight, objectsToDraw[index].size.height)
                            );
            }catch (error){
                alert(error + " " + objectsToDraw[index].imageID);
            }
        }

        //set z-index to lowest value of all contained elements
        newCanvas.css("z-index", objectsToDraw[0].position.zPos);

    }else{//draw to multiple canvasses

		var imageStat;
		
        for(var index = 0; index < objectsToDraw.length; ++index){

            imageStat = new imageStatObject(objectsToDraw[index]['imageID'],
                                                 objectsToDraw[index]['position'],
                                                 objectsToDraw[index]['size']
												);
												
			if(objectsToDraw[index]['laufziel'] != null)
			{
				imageStat.laufziel = objectsToDraw[index]['laufziel'];
			}
			
            gImageStats.push(imageStat);

            //create id with a unique combination
            //of common string and picture id
            var canvasID =
                    sharedIdString + "_" +
                    objectsToDraw[index].imageID;

            //preset gTalk.canvasID for later referencing
            if(strContains(canvasID, "dialogbox")){
                gTalk.canvas_id = canvasID;
            }

            if(sharedIdString !== "canvas_person"){

                var stringValueObject = new Object();

                stringValueObject['key']      = canvasID.split(':')[0];
                stringValueObject['value']    = canvasID + "+" +
                        objectsToDraw[index].quiz[1] + "+" +
                        objectsToDraw[index].quiz[3] + "+" +
                        objectsToDraw[index].imageID;

                gClickEventValueArray.push(stringValueObject);

                //sets visibility by css "display" value through css class attribute
                //following first flag corresponding to the first quizstep
                quizClass		= objectsToDraw[index].quiz[0].split("|");
                quizClass		= quizClass[0] !== "t" ? "quiz_hidden" : "quiz_shown";

                //add visibility flags
                canvasID += ":"+objectsToDraw[index].quiz[0];
                //add clickable flags
                canvasID += ":"+objectsToDraw[index].quiz[2];

                if(objectsToDraw[index].quiz[2].split("|")[0] === "t"){
                    //if first step defines clickable == true display this canvas
                    quizClass += " " + "clickable";
                }

                newCanvas = $('<canvas/>',
                              {
                                  id : canvasID,
                                  "class": quizClass,
                                  onclick:"javascript:startEventHandling('" + canvasID.split(':')[0] + "');"
                              }
                              );
            }else{
                //if sharedid == canvas_person don't call any javascript
                newCanvas = $('<canvas/>',
                              {
                                  id : canvasID,
                                  "class": "quiz_shown"
                              }
                              );
            }

            //append to html body
            $('body').append(newCanvas);

            //object positioning
            newCanvas.css('left', objectsToDraw[index].position.xPos + '%');
            newCanvas.css('top', objectsToDraw[index].position.yPos + '%');
            newCanvas.css('z-index', objectsToDraw[index].position.zPos);

            //calculate pixel dimensions from percentage values
            var pxWidth, pxHeight;

            pxWidth		= perc2pix(screenWidth, objectsToDraw[index].size.width);
            pxHeight	= perc2pix(screenHeight, objectsToDraw[index].size.height);

            //read scaling from object and apply to canvas
            var skalierung = z2mult(objectsToDraw[index].position.zPos);

            pxWidth		*= skalierung;
            pxHeight	*= skalierung;

            //set canvas dimensions
            newCanvas[0].width  = pxWidth;
            newCanvas[0].height = pxHeight;

            //Avoid initial drawing of dialogbox
            if(strContains(canvasID, "dialogbox")){
                continue;
            }

            //get context
            canvasContext = newCanvas[0].getContext("2d");

            //debug
            if(typeof(gBilder[objectsToDraw[index].imageID]) === 'undefined'){

                alert("Undefined image:" + objectsToDraw[index].imageID);
            }
            //debug end

            if(gBilder[objectsToDraw[index].imageID].animiert){
                //Check if we deal with person objects
                if(!strContains(sharedIdString, 'person')){
                    /*
                        if not, the tileset does not have a vertical expansion greater than 1.
                        That means it is no person animation. The tileset is handled as a
                        regular animated object.
                    */
                    starteAnimation(canvasID, objectsToDraw[index].imageID, pxWidth, pxHeight);
                }else{
                    /*
                        if yes, the tileset is a persons tileset. That means we have 5 sub-tilesets
                        to deal with. Special switches are invoked to handle these tilesets, which
                        have a vertical expansion greater than one.
                    */

                    starteAnimation(canvasID, objectsToDraw[index].imageID, pxWidth, pxHeight, true, gInitialDirection);

                    /*
                        For referencing the persons later, the fixed imageID part is
                        stored in a global array.
                    */
                    //gOnClickMovablePersons.push(objectsToDraw[index].imageID);
                }
            }else{
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
}

/*
    sceneNeedsForcedDialog()

    Checks whether current scene needs a forced dialog
    at start. This will trigger a dialog at startup if
    necessary.

    Input arguments:

    none

    Return value:

    (Boolean) - true/false
*/
function sceneNeedsForcedDialog(){
outputDebugInfo();

    for(var idx = 0; idx < gForceDialogScenes.length; ++idx){
        if(gForceDialogScenes[idx] == gcurrent_scene_id){
            return true;
        }
    }

    return false;
}
