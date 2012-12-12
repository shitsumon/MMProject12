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

    None until now, there are currently issues returning information
    from asynchronous ajax request!
*/
function getSceneInformation(sceneID, sceneFilename){

    /*check for input filename, else use default*/
    sceneFilename = typeof sceneFilename === 'undefined' ? "testSzenen.xml" : sceneFilename;

    /*Create new scene structure object*/
    var sceneObject = new sceneStruct(sceneID);

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

//    alert("Scene ID:" + sceneObject.sceneID);
//    alert("hg_static image id: "   + sceneObject.staticBackgroundObjects[0].imageID);
//    alert("hg_static dialog id: "  + sceneObject.staticBackgroundObjects[0].dialogueID);
//    alert("hg_static position-x: " + sceneObject.staticBackgroundObjects[0].position.xPos);
//    alert("hg_static position-y: " + sceneObject.staticBackgroundObjects[0].position.yPos);
//    alert("hg_static width: "      + sceneObject.staticBackgroundObjects[0].size.width);
//    alert("hg_static height: "     + sceneObject.staticBackgroundObjects[0].size.height);

//    alert("hg_dynamic image id: "   + sceneObject.dynamicBackgroundObjects[0].imageID);
//    alert("hg_dynamic dialog id: "  + sceneObject.dynamicBackgroundObjects[0].dialogueID);
//    alert("hg_dynamic position-x: " + sceneObject.dynamicBackgroundObjects[0].position.xPos);
//    alert("hg_dynamic position-y: " + sceneObject.dynamicBackgroundObjects[0].position.yPos);
//    alert("hg_dynamic width: "      + sceneObject.dynamicBackgroundObjects[0].size.width);
//    alert("hg_dynamic height: "     + sceneObject.dynamicBackgroundObjects[0].size.height);


    $('body').append($('<div/>', {'id':'root_div'})); //root tag

    var newCanvas = $('<canvas/>',{'id':'canvas_bg_static'}) //static background canvas
        .width($(window).width)
        .height($(window).height);

    $('#root_div').append(newCanvas);


}

function getSceneElementData(sceneElement){

    tmpObject = new objectStruct(sceneElement.attr('bild_id'),
                                 sceneElement.attr('dialog_id'),
                                 sceneElement.attr('klickbar') === "true");
    tmpObject.position.xPos = parseInt(sceneElement.find('position').attr('x'));
    tmpObject.position.yPos = parseInt(sceneElement.find('position').attr('y'));
    tmpObject.size.width    = parseInt(sceneElement.find('groesse').attr('width'));
    tmpObject.size.height   = parseInt(sceneElement.find('groesse').attr('height'));

//    alert("Image id: " + sceneElement.attr('bild_id'));
//    alert("dialog id: " + sceneElement.attr('dialog_id'));
//    alert("Klickbar: " + sceneElement.attr('klickbar') === "true");
//    alert("PosX: " + parseInt(sceneElement.find('position').attr('x')));
//    alert("PosY: " + parseInt(sceneElement.find('position').attr('y')));
//    alert("width: " + parseInt(sceneElement.find('groesse').attr('width')));
//    alert("height: " + parseInt(sceneElement.find('groesse').attr('height')));

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

/*
    JQuery testing function which will be
    executed immediately after loading script.

    !!! Will be removed in final release!!!
*/
$(document).ready(function(){

                      getSceneInformation("Szene_1", "testSzenen.xml");
                  });
