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

var gLastKnownGoodXPos = 999999;
var gLastKnownGoodYPos = 999999;

//Temporary struct which contains vital data of objects within scene 1
var imageItems = [
                    new sImageItem('protagonist1', 'Protagonist1.png', 'Allgemein', 90, 90),
                    new sImageItem('doorOverlay', 'door_overlay.png', 'Szene1' , 27.5, 30),
                    new sImageItem('windowOverlay', 'windowOverlay.png', 'Szene1' , 80, 30),
                    new sImageItem('dummySpot', 'dummySpot.png', 'Szene1' , 0, 0)
                 ];
/*************************************/


//Main function which is called when HTML-document is loaded
function starte_szene(szene){

    hintergrund_laden(szene);

    switch (szene){
    case "Szene1":
        loadSubImagesToStartPosition();
        text_anzeigen("Protagonist 1","Wo bin ich?");
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

function moveObject(tx, ty, hx, hy, mR, velocity){

    var tmp = Math.round(mR * velocity);

    if(hx > tx){
        var newHx = hx - tmp;
    }else{
        var newHx = hx + tmp;
    }

    if(hy > ty){
        var newHy = hy - velocity;
    }else{
        var newHy = hy + velocity;
    }

    /*if(newHx === hx && newHy === hy){

        newHx += 1;
        newHy += 1;
    }*/


//    if((newHx - tx) > gLastKnownGoodXPos || (newHy - ty) > gLastKnownGoodYPos){
//        clearTimeout(gTimeoutDescriptor);
//        gTargetIdentifier = "";
//        gLastKnownGoodXPos = 999999;
//        gLastKnownGoodYPos = 999999;
//        return;
//    }else{
//        gLastKnownGoodXPos = newHx - tx;
//        gLastKnownGoodYPos = newHy - ty;
//    }

    var hero             = document.getElementById("protagonist1");
    var backgroundHeight = document.body.clientHeight;
    var backgroundWidth  = document.body.clientWidth;

    var hxperc = pix2perc(backgroundWidth, newHx);
    var hyperc = pix2perc(backgroundHeight, newHy);

    hero.style.left = hxperc;
    hero.style.top  = hyperc;

    if(Math.abs(newHx - tx) < 1.0 || Math.abs(newHy - ty) < 1.0){
        clearTimeout(gTimeoutDescriptor);
        gTargetIdentifier = "";
//        gLastKnownGoodXPos = 999999;
//        gLastKnownGoodYPos = 999999;
    }else{
        heroMovement();
    }
}

function heroMovement(){


    //Get objects of target and hero picture
    var hero = $("#protagonist1");
    var target = $("#"+gTargetIdentifier);

    //Fetch background dimensions
    var backgroundHeight = $(window).height;
    var backgroundWidth = $(window).width;

    var targetPos = target.offset();
    var heroPos = hero.offset();

    //Get current position of protagonist object and target clickable object
    var targetX = targetPos.left;
    var targetY = targetPos.top;

    var heroX = heroPos.left;
    var heroY = heroPos.top;

    var movementRatio = (heroX - targetX) / (heroY - targetY);


    //moveObject(targetX, targetY, heroX, heroY, movementRatio, 1.00);
    //gTimeoutDescriptor = setTimeout(function(){moveObject(targetX, targetY, heroX, heroY, movementRatio, 2.5)}, 75);
    //function moveObject(tx, ty, hx, hy, mR, velocity){

    var tmp = Math.round(movementRatio * 2.5);

    if(heroX > targetX){
        var newHx = heroX - tmp;
    }else{
        var newHx = heroX + tmp;
    }

    if(heroX > targetX){
        var newHy = heroY - 2.5;
    }else{
        var newHy = heroY + 2.5;
    }

//    var hero             = document.getElementById("protagonist1");
//    var backgroundHeight = document.body.clientHeight;
//    var backgroundWidth  = document.body.clientWidth;

//    var hxperc = pix2perc(backgroundWidth, newHx);
//    var hyperc = pix2perc(backgroundHeight, newHy);

//    hero.css.style.left = hxperc;
//    hero.css.style.top  = hyperc;

    var newPos = {
                left: newHx,
                top: newHy
            };

    hero.offset(newPos);

    if(Math.abs(newHx - targetX) < 1.0 || Math.abs(newHy - targetY) < 1.0){
        clearTimeout(gTimeoutDescriptor);
        gTargetIdentifier = "";
    }else{
        gTimeoutDescriptor = setTimeout(function(){heroMovement()}, 75);
    }
}

