/*
Netzwerkstar scene parser
Written to implement a comfortable way of creating HTML documents
which represent scenes of the games. The parser extracts any vital
information from specified XML documents and uses the extracted
information to create a proper looking game scene.
*/

/*globals*/
var sceneXML = "testSzenen.xml"; //there is currently an issue with relative pathnames

//Scene struct where the xml reader part stores all extracted information
function sceneStruct(id){
    this.sceneID = id;
    this.staticBackgroundObjects  = new Array();
    this.dynamicBackgroundObjects = new Array();
    this.staticForegroundObjects  = new Array();
    this.dynamicForegroundObjects = new Array();
    this.persons                  = new Array();

    /*This might be removed in a future version*/
    this.hasQuiz                  = false;
    this.quizSteps                = new Array();
}

//Struct for person information includes Position and Size struct
function personStruct(id, imgID, xPos, yPos, width, height){
    this.personID   = id;
    this.imageID    = imgID;
    this.position   = new Position(xPos, yPos);
    this.size       = new Size(width, height);
}
//Struct for object information includes Position and Size struct
function objectStruct(imgID, diagID, xPos, yPos, width, height, clickable){

    this.imageID    = imgID;
    this.dialogueID = diagID;

    this.position   = new Position(xPos, yPos);
    this.size       = new Size(width, height);

    this.clickable  = typeof clickable === 'undefined' ? false : clickable;
}

//includes information about one step of quiz within a scene
//This might be removed in a future version
function quizStep(objID, diagReactID, diagTipID, code){

    this.objectID           = objID;
    this.dialogueReactionID = diagReactID;
    this.dialogueTipID      = diagTipID;
    this.code               = code;
}

//Struct for object position on the browsers viewport
function Position(x, y){
    this.xPos = typeof x === 'undefined' ? 0 : x;
    this.yPos = typeof y === 'undefined' ? 0 : y;
}

//Struct for object size on the browsers viewport
function Size(w, h){
    this.width  = typeof w === 'undefined' ? 0 : w;
    this.height = typeof h === 'undefined' ? 0 : h;
}

/*
Extracts all information which stated
within the tags of specified scene ID
*/
function getSceneInformation(sceneID, sceneFilename){

    /*check for input filename, else use default*/
    sceneFilename = typeof sceneFilename === 'undefined' ? "testSzenen.xml" : sceneFilename;

    /*Create new scene structure object*/
    var sceneObject = new sceneStruct(sceneID);

//    var xmlRequestObject = new XMLHttpRequest();
//    try
//    {
//    xmlRequestObject.open("GET", sceneFilename, false);
//    xmlRequestObject.send(null);
//    }
//    catch (e) {
//        window.alert("Unable to load the requested file.");
//        return;
//    }

//    alert(xmlRequestObject.responseXML);

    if(window.DOMParser)
    var parser = new DOMParser();

        var test = $.ajax(sceneFilename)
        .done(function() { alert("success"); })
        .fail(function() { alert("error"); })
        .always(function() { alert("complete"); });

        alert(test.responseXML);

        /*open xml file and search scene tag with input scene id*/
                   $.ajax({
                   url: sceneFilename,
                   type: "GET",
                   dataType: "xml",
                   async: false,
                   success:function(xmlContent){
                               alert("gotXML");
                               //iterate over each scene object and check its id against input id
                               $(xmlContent).find('szene').each(function(){
                                                                    var sceneObject = $(this);
                                                                    alert(sceneObject.attr('id'));
                                                                    alert(sceneID);
                                                                    if(sceneObject.attr('id') === sceneID){
                                                                        alert("found object!");
                                                                        //parse out static background objects
                                                                        $(sceneObject).find('hg_statisch_objekt').each(function(){
                                                                                                                           alert("now get info!");
                                                                                                                           var hgStaticXMLObj = $(this);
                                                                                                                           var hgStaticObject = new objectStruct(hgStaticXMLObj.attr('bild_id'),
                                                                                                                                                                 hgStaticXMLObj.attr('dialog_id'));
                                                                                                                           alert(hgStaticXMLObj.attr('bild_id'));
                                                                                                                          alert(hgStaticXMLObj.attr('dialog_id'));

                                                                                                                           hgStaticObject.clickable     = hgStaticXMLObj.attr('klickbar') === "true";
                                                                                                                           hgStaticObject.position.xPos = parseInt(hgStaticXMLObj.find('position').attr('x'));
                                                                                                                           hgStaticObject.position.yPos = parseInt(hgStaticXMLObj.find('position').attr('y'));
                                                                                                                           hgStaticObject.size.width    = parseInt(hgStaticXMLObj.find('groesse').attr('width'));
                                                                                                                           hgStaticObject.size.height   = parseInt(hgStaticXMLObj.find('groesse').attr('height'));

                                                                                                                           alert(hgStaticXMLObj.find('position').attr('x'));
                                                                                                                           alert(hgStaticXMLObj.find('position').attr('y'));
                                                                                                                           alert(hgStaticXMLObj.find('groesse').attr('width'));
                                                                                                                           alert(hgStaticXMLObj.find('groesse').attr('height'));
                                                                                                                           alert(hgStaticXMLObj.attr('klickbar'));

                                                                                                                           alert(hgStaticObject.imageID);
                                                                                                                           alert(hgStaticObject.dialogueID);
                                                                                                                           alert(hgStaticObject.position.xPos);
                                                                                                                           alert(hgStaticObject.position.yPos);
                                                                                                                           alert(hgStaticObject.size.width);
                                                                                                                           alert(hgStaticObject.size.height);
                                                                                                                           alert(hgStaticObject.clickable);

                                                                                                                           sceneObject.staticBackgroundObjects.push(hgStaticObject);

                                                                                                                           //need to find a way to return object from asynchronous ajax request!!!
                                                                                                                })
                                                                    }
                                                                })
                           }
               }).done(function() { alert("success");})
                 .fail(function() { alert("error"); });
}

$(document).ready(function(){

//                      $.ajax({
//                                 url: "testSzenen.xml",
//                                 type: "GET",
//                                 dataType: "xml",
//                                 success:function(foo){
//                                             $(foo).find('szene').each(function(){
//                                                                          var test = $(this);
//                                                                          alert(test.attr('id'));
//                                                                      })
//                                         }
//                             })
//                      .done(function() { alert("success"); })
//                      .fail(function() { alert("error"); })
//                      .always(function() { alert("complete"); });

                      getSceneInformation("Szene_1", sceneXML);
                      var test;

                  });
