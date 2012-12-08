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

/*
  If the JQuery ajax request turns out to be not
  an option, it might be doable with an XMLHttpRequest Object!

  var xmlRequestObject = new XMLHttpRequest();
  try
  {
    xmlRequestObject.open("GET", sceneFilename, false);
    xmlRequestObject.send(null);
  }
  catch (e) {
    window.alert("Unable to load the requested file.");
    return;
  }

  alert(xmlRequestObject.responseXML);
*/

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
                   //async: false, //this not the best way, blocks browser until finished
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

/*
    JQuery testing function which will be
    executed immediately after loading script.

    !!! Will be removed in final release!!!
*/
$(document).ready(function(){

                      getSceneInformation("Szene_1", sceneXML);
                      var test;

                  });
