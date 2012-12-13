/*
    helper.js - a file for structs, helper functions and global variables

    When programming for Netzwerkstar project, please keep this simple rules in mind
    to enhance the readability for all participants:

    -- All structs, global variables and helper function belong into this file to separate it from the actual application logic
    -- global variables need to be marked as such, so the naming convention is to start every global variable with a lower 'g' character
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
var gBilder=new Object();	//globales Bilder-Objekt; enthält alle Bilder als Attribute, erreichbar über ihre ID
gBilder.anzahl=0;			//Zähler für die Anzahl alle Bilder in der XML-Datei, wird von pictureParser gesetzt
gBilder.geladen=0;			/*Zähler für die vollständig geladenen Bilder, wird von pictureParser gesetzt und kann für den
							Ladebalken genutzt werden*/

var gbilderXMLPfad="../../Bilder/Bilder.xml";	//Pfad zur Bilder-XML

function Abmessungen(_height, _width){	//Prototyp für die Abmessungen des Bildes in Pixel -> int
	this.height=_height;	//Pixel int
	this.width=_width;		//Pixel int
}

function Animationsmerkmale(_fps, _tile_anzahl, _tile_width){	//Prototyp für die Bildanimation
	this.fps=_fps;					//Bilder pro Sekunde		-> float
	this.tile_anzahl=_tile_anzahl;	//Anzahl der Einzelbilder	-> int
	this.tile_width=_tile_width;	//Breite eines Einzelbildes	-> Pixel int
}

function Skalierung(_x, _y, _z){	//Prototyp für eine Skalierungsstufe, enthält x/y-Skalierung in % und z-Ebene
	this.x=_x;	//Skalierung in x-Richtung		-> % float
	this.y=_y;	//Skalierung in y-Richtung		-> % float
	this.z=_z;	//z-Index der Skalierungsstufe	-> int
}

//Prototyp für ein Bild, nutzt alle vorherigen Prototypen und kümmert sich um das Laden der eigentlichen Bilder
function Bild(_id, _pfad, _abmessungen, _animiert, _animationsmerkmale, _skalierungsstufen){
	this.id=_id;					//ID des Bildes					-> string
	this.pfad=_pfad;				//Dateipfad						-> String
	this.abmessungen=_abmessungen;	//Abmessungen in Pixel			-> Abmessungen
	this.animiert=_animiert;		//animiert oder nicht			-> boolean
	this.animationsmerkmale=_animationsmerkmale;//Eigenschaften der Animation	-> Animationsmerkmale
	this.bild=new Image();			//das eigentliche Bild			-> Image
	this.bild.onload=function(){	/*aufgerufen nachdem das Bilde geladen wurde*/
		gBilder.geladen++;			/*Zähler für die fertig geladenen Bilder -> int*/
		aktualisiereLadebalken();	/*Hook für den Ladebalken*/
		statusPruefen();			/*Hook zur Benachrichtigung: Laden beendet*/
	}
	this.bild.src=_pfad;			//initiiert das Laden des Bilde	-> string
	this.skalierung=new Array(_skalierungsstufen);//				-> Skalierung
}

/*********************
 *pictureAnimation.js*
 *********************/
//verwaltet die Animationen; enthält die zugehörigen Timer als Attribute, erreichbar über die Bild-ID
var gAnimationTimer=new Object();
gAnimationTimer.anzahl=0;//zählt die aktiven Timer im Objekt -> int

//Prototyp für ein animiertes Bild-Objekt, speichert den zugehörigen Timer
function Animation(_canvas_id, _bild_id){
	this.bild_nr=0;				//der Index des aktuell angezeigten Einzelbildes	-> int
	this.canvas_id=_canvas_id;	//ID des Canvas in den gezeichnet wird				-> string
	this.bild_id=_bild_id;		//ID des Bildes, das genutzt wird					-> string
	this.timer=null;			//Timer der Animation, wird beim Erzeugen gesetzt	-> Timer (int)
	this.running=true;			//zeigt an ob die Animation gerade aktiv ist		-> bool
}
