/**********Helper functions & structures***********/

//stores all information necesseary to load single object files
function sImageItem(name, filename, folder, xPos, yPos){
    this.name       = name;
    this.filename   = filename;
    this.folder     = folder;
    this.xPos       = xPos;
    this.yPos       = yPos;
}

//Calculates the effective pixel value from a CSS percentage string
function pix2perc(absolute, pixelValue){
    return (100 * pixelValue) / absolute + "%";
}

//Generates a CSS percentage from a numeric pixel value
function perc2pix(absolute, percString){
    return (absolute / 100) * parseInt(percString.replace("%",""));
}

/**********global variables***********/

var gTargetIdentifier = ""; //used to set an overlay from HTML code as movement target

var gTimeoutDescriptor; //descriptor which is used to call a halt on setTimeout events

var gMRset = false;

var gMovementRatio = 0.0;

//Temporary struct which contains vital data of objects within scene 1
var imageItems = [
            new sImageItem('protagonist1', 'Protagonist1.png', 'Allgemein', 90, 90),
            new sImageItem('doorOverlay', 'door_overlay.png', 'Szene1' , 27.5, 30),
            new sImageItem('windowOverlay', 'windowOverlay.png', 'Szene1' , 80, 30),
            new sImageItem('bedOverlay', 'bedOverlay.png', 'Szene1' , 80, 84),
            new sImageItem('dummySpot', 'dummySpot.png', 'Szene1' , 0, 0)
        ];
/*************************************/


//Main function which is called when HTML-document is loaded
function starte_szene(szene){

    hintergrund_laden(szene);

    switch (szene){
    case "Szene1":
        loadSubImagesToStartPosition();
        //text_anzeigen("Protagonist 1","Wo bin ich?");
        break;

    default:
        alert("Fehler beim Laden der Szene!");
        break;
    }
}

/*Takes all images which are set in imageItems and loads them
  to their specific canvas object. Afertwards the canvas objects
  are arranged to their stated start positions.*/
function loadSubImagesToStartPosition(){

    for(var index = 0; index < imageItems.length; ++index){

        /*alert( imageItems[index].name + "\n" +
               imageItems[index].filename + "\n" +
               imageItems[index].folder + "\n" +
               imageItems[index].xPos + "\n" +
               imageItems[index].yPos + "\n");*/

        var erg = schreibe_bild_in_canvas(imageItems[index].name ,imageItems[index].folder, imageItems[index].filename);
        var hintergrund = document.getElementById("hintergrund_canvas");
        var x = (erg.canvas.clientWidth / hintergrund.clientWidth*100);
        var y = (erg.canvas.clientHeight / hintergrund.clientHeight*100);

        x = imageItems[index].xPos - x;
        y = imageItems[index].yPos - y;

        //alert("X: " + x + "%" + "\nY: " + y + "%");

        erg.canvas.style.left=x+"%";
        erg.canvas.style.top=y+"%";
    }
}

/*
  Draws an image to a HTML-5 canvas object
  Input arguments: - ID of canvas into which the image will be drawn
                   - Name of the scene
                   - filename of the image object

  Return values: - the canvas object itself
                 - the context of the canvas object
                 - the image object itself
*/
function schreibe_bild_in_canvas(canvas_id, szene, bild_name){

    var _canvas  = document.getElementById(canvas_id);
    var _context = _canvas.getContext("2d");
    var _bild    = new Image();
    var imgsrc   = "./../../Bilder/" + szene + "/" + bild_name;

    _bild.src = imgsrc;

    _canvas.width  = _bild.width;
    _canvas.height = _bild.height;

    _context.drawImage(_bild,0,0);

    return {canvas:_canvas, context:_context, bild:_bild}
}

/*
    Does the same as loadSubImagesToStartPosition but only with the scene background.
    Suggestion: Should be integrated to loadSubImagesToStartPosition (?)

    Input value: name of the scene
*/
function hintergrund_laden(szene){

    schreibe_bild_in_canvas("hintergrund_canvas",szene,"Hintergrund.jpg");
}

/*
    Writes dialog text of one of the protagonists to the screen.

    Input arguments: - ID(?) of person which is speaking
                     - Dialog text
*/
function text_anzeigen(person, text){

    var canvas  = document.getElementById("textbox");
    var context = canvas.getContext("2d");

    canvas.style.display = "inline";

    canvas.addEventListener("click",function(){ this.style.display = "none"; }, false);

    canvas.width  = document.getElementById("hintergrund_canvas").clientWidth;
    canvas.height = document.getElementById("hintergrund_canvas").clientHeight*0.15;

    context.fillStyle   = "#000";
    context.globalAlpha = 0.9;
    context.fillRect( 0, 0, canvas.clientWidth, canvas.clientHeight);

    context.fillStyle    = "#eee";
    context.globalAlpha  = 1.0;
    context.textBaseline = "top";
    context.font         = "small Arial";
    context.fillText( person + ": " + text, 0, 0);
}

function heroMovement(){

    var velocityParam = 1.0;

    //Get objects of target and hero picture
    var hero = $("#protagonist1");
    var target = $("#"+gTargetIdentifier);

    var targetPos = target.offset();
    var heroPos = hero.offset();

    //Get current position of protagonist object and target clickable object
    var targetX = targetPos.left;
    var targetY = targetPos.top;

    var heroX = heroPos.left;
    var heroY = heroPos.top;

    //    var heroX = 0;
    //    var heroY = 0;

    //    if(targetX < heroPos.left){
    //        heroX = heroPos.left;
    //    }else if(targetX > heroPos.left){
    //        heroX = heroPos.left + hero.width();
    //    }

    //    if(targetY < heroPos.top){
    //        heroY = heroPos.top;
    //    }else if(targetY > heroPos.top){
    //        heroY = heroPos.top + hero.height();
    //    }

    if(!gMRset){
        gMovementRatio = Math.abs((heroX - targetX)) / Math.abs((heroY - targetY));
        gMRset = true;
    }


    var tmp = gMovementRatio * velocityParam;

    var newHx = 0;
    var newHy = 0;

    if(heroX > targetX){
        newHx = heroX - tmp;
    }else if(heroX < targetX){
        newHx = heroX + tmp;
    }else{
        newHx = targetX;
    }

    if(heroY > targetY){
        newHy = heroY - velocityParam;
    }else if(heroY < targetY){
        newHy = heroY + velocityParam;
    }else{
        newHy = targetY;
    }

    switch(borderCollisionDetection("protagonist1")){
    case 1:
        //newHx = heroX;
        break;
    case 2:
        //        newHy = heroY;
        break;
    case 0:
    default:
        break;
    }

    var newPos = {
        left: newHx,
        top: newHy
    };

    hero.offset(newPos);

    if(hero.intersectsWith(gTargetIdentifier)){
        clearTimeout(gTimeoutDescriptor);
        gTargetIdentifier = "";
        gMovementRatio = 0;
        gMRset = false;
        return;
    }else{
        gTimeoutDescriptor = setTimeout(function(){heroMovement()}, 5);
    }
}

function borderCollisionDetection(objectName){

    var movingObject        = $("#"+objectName);
    var objLeft             = movingObject.offset().left;
    var objTop              = movingObject.offset().top;
    var objLeftWithWidth    = movingObject.offset().left + movingObject.width();
    var objTopWithHeight    = movingObject.offset().top  + movingObject.height();

    var newPos = 0;

    //collision with left border
    if(objLeft <= 0){

        newPos = {
            left: 0,
            top: movingObject.offset().top
        };

        movingObject.offset(newPos);

        return 1;
    }

    //collision with upper border
    if(objTop <= 0){

        newPos = {
            left: movingObject.offset().left,
            top: 0
        };

        movingObject.offset(newPos);

        return 2;
    }

    //collision with right border
    if(objLeftWithWidth >= $(document).width()){

        newPos = {
            left: $(document).width(),
            top: movingObject.offset().top
        };

        return 1;
    }

    //collision with lower border
    if(objTopWithHeight >= $(document).height()){

        newPos = {
            left: movingObject.offset().left,
            top: $(document).height()
        };

        return 2;
    }

    return 0;
}

/*JQuery Plugin which checks wether the hero intersects with it's target*/
(function($){
     $.fn.intersectsWith = function(targetname) {
                 //alert(targetname);
                 var hero = this;
                 var target = $("#"+targetname);
                 var c = $([]);

                 if(!hero || !target){
                     return false;
                 }

                 var heroOffset = hero.offset();
                 var heroMinX   = heroOffset.left;
                 var heroMinY   = heroOffset.top;
                 var heroMaxX   = heroMinX + hero.outerWidth();
                 var heroMaxY   = heroMinY + hero.outerHeight();

                 var targetOffset = target.offset();
                 var targetMinX   = targetOffset.left;
                 var targetMinY   = targetOffset.top;
                 var targetMaxX   = targetMinX + target.outerWidth();
                 var targetMaxY   = targetMinY + target.outerHeight();

                 //No intersection
                 if(heroMinX >= targetMaxX ||
                         heroMaxX <= targetMinX ||
                         heroMinY >= targetMaxY ||
                         heroMaxY <= targetMinY){
                     return false;
                 }else{
                     return true;
                 }
             }
 })(jQuery);