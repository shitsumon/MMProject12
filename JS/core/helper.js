/*
    helper.js - a file for structs, helper functions and global variables

    When programming for Netzwerkstar project, please keep this simple rules in mind
    to enhance the readability for all participants:

    -- All structs, global variables and helper function belong into this file to separate it from the actual application logic
    -- global variables need to be marked as such, so the naming convention is to start ever global variable with a lower 'g' character
    -- When editing this file in order to introduce some new variables please mark the js-file with a comment in the new varables/structs are used

    At the time you link your js-file to the correspondig HTML document obey the following link order:
    1. link JQuery
    2. link helper.js
    3. link your js-file

    example:
    <html>
        <head>
            <script type="text/javascript" src="../../JS/external/jquery.js"></script>  <!-- 1. -->
            <script type="text/javascript" src="../../JS/core/helper.js"></script>      <!-- 2. -->
            <script type="text/javascript" src="../../JS/core/animation.js"></script>   <!-- 3. -->
        </head>
        <body>
        </body>
    </html>
*/

/****************
 *sceneParser.js*
 ****************/

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
function objectStruct(imgID, diagID, clickable, xPos, yPos, width, height){

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


var sceneXML = "testSzenen.xml"; //there is currently an issue with relative pathnames
var gTestSceneStruct = new sceneStruct("undefined");

/**************
 *animation.js*
 **************/
var gTimeoutDescriptor = 0;    // descriptor which is used to call a halt on setTimeout events
var gTargetIdentifier  = "";   // used to set an overlay from HTML code as movement target
var gMRset             = false;// Flag which marks if the stepwidth of the current movement has already been computed
var gVelocityParam     = 25.0; // Movement speed parameter
var gVecX              = 0.0;  // Computed stepwidth in x direction
var gVecY              = 0.0;  // Computed stepwidth in y direction

/******************
 *pictureParser.js*
 ******************/
var gBilder=new Object();
gBilder.anzahl=0;
gBilder.geladen=0;

var gbilderXMLPfad="../../Bilder/Bilder.xml";

function Abmessungen(_height, _width){
	this.height=_height;
	this.width=_width;
}

function Animation(_fps, _tile_anzahl, _tile_width){
	this.fps=_fps;
	this.tile_anzahl=_tile_anzahl;
	this.tile_width=_tile_width;
}

function Skalierung(_x, _y, _z){
	this.x=_x;
	this.y=_y;
	this.z=_z;
}

function Bild(_id, _pfad, _abmessungen, _animiert, _animation, _skalierungsstufen){
	this.id=_id;
	this.pfad=_pfad;
	this.abmessungen=_abmessungen;
	this.animiert=_animiert;
	this.animation=_animation;
	this.bild=new Image();
	this.bild.onload=function(){
		gBilder.geladen++;
		aktualisiereLadebalken();
	}
	this.bild.src=_pfad;
	this.skalierung=new Array(_skalierungsstufen);
}
