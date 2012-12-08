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


