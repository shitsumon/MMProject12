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
//Pfad zur szenen.xml
//var sceneXML				= "../../szenen.xml";
var sceneXML				= "../szenen.xml";
//Index der aktuellen Szene
var gcurrent_scene_counter	= 1;
//ID der aktuellen Szene
var gcurrent_scene_id		= "Szene_" + gcurrent_scene_counter.toString();
//Anzahl der Rätselschritte der aktuellen Szene
var gQuiz_steps				= 0;
//derzeitiger Rätselschritt
var gcurrent_quiz_step		= 0;
//Multiplikatoren der Zoomstufen nach Z-Index
var gZoomsteps				= new Array(4);

//Scene struct where the xml reader part stores all extracted information
function sceneStruct(id){
    this.sceneID = id;
    this.staticBackgroundObjects  = new Array();
    this.dynamicBackgroundObjects = new Array();
    this.staticForegroundObjects  = new Array();
    this.dynamicForegroundObjects = new Array();
    this.persons                  = new Array();
}

//Struct for person information includes Position struct, Size struct and Quiz info
function personStruct(id, imgID, xPos, yPos, zPos, width, height){
    this.personID   = id;
    this.imageID    = imgID;
    this.position   = new Position(xPos, yPos, zPos);
    this.size       = new Size(width, height);
	
	this.quizTrigger= false;
	this.quizStep	= 0;
}
//Struct for object information includes Position struct, Size struct and Quiz info
function objectStruct(imgID, diagID, xPos, yPos, zPos, width, height, clickable){

    this.imageID    = imgID;
    this.dialogueID = diagID;

    this.position   = new Position(xPos, yPos);
    this.size       = new Size(width, height);

    this.clickable  = typeof( clickable ) === 'undefined' ? false : clickable;
	
	this.quizTrigger= false;
	this.quizStep	= 0;
}

//Struct for object position on the browsers viewport
function Position(x, y, z){
    this.xPos = typeof( x ) === 'undefined' ? 0 : x;
    this.yPos = typeof( y ) === 'undefined' ? 0 : y;
	this.zPos = typeof( z ) === 'undefined' ? 0 : z;
}

//Struct for object size on the browsers viewport
function Size(w, h){
    this.width  = typeof( w ) === 'undefined' ? 0 : w;
    this.height = typeof( h ) === 'undefined' ? 0 : h;
}

/**************
 *walkAnimation.js*
 **************/
var gTargetIdentifier  	= "";   // used to set an overlay from HTML code as movement target
//Position der Wegpunkte des zentralen Pfades
//er dient der Figur als Weg zwischen den Tiefenebenen
var gWegPos				= new Array(4);
//x, y-Koordinaten der Wegpunkte, die nacheinander angesteuert werden
var gTargets			= new Array(new Array(2), new Array(4), new Array(2));
var gStartAbmessungen	= new Array(2);
var gMoveVec			= new Array(new Array(3), new Array(3), new Array(3));//Bewegungsvektoren über die drei Abschnitte
var gWegBerechnet		= false;	//zur einmaligen Berechnung der Vektoren
var gAufrufeProSekunde	= 25;
var gPixelProAufruf		= 100;		//steuert die Bewegungsgeschwindigkeit
var gIntervall			= 1000 / gAufrufeProSekunde;
var gAktuellesZiel		= 0;		//Index des derzeitigen Ziels
var gLastDirection      = 'standing';//Stores last known direction
/******************
 *pictureParser.js*
 ******************/
 
var gBilder			= new Object();	//globales Bilder-Objekt; enthält alle Bilder als Attribute, erreichbar über ihre ID
gBilder.anzahl		= 0;			//Zähler für die Anzahl alle Bilder in der XML-Datei, wird von pictureParser gesetzt
gBilder.geladen		= 0;			/*Zähler für die vollständig geladenen Bilder, wird von pictureParser gesetzt und kann für den
									Ladebalken genutzt werden*/

//var gbilderXMLPfad	= "../../bilder/bilder.xml";	//Pfad zur Bilder-XML
var gbilderXMLPfad	= "../bilder/bilder.xml";	//Pfad zur Bilder-XML

function Abmessungen(_height, _width){	//Prototyp für die Abmessungen des Bildes in Pixel -> int
	this.height	= _height;	//Pixel int
	this.width	= _width;	//Pixel int
}

function Animationsmerkmale(_fps, _tile_anzahl, _tile_width){	//Prototyp für die Bildanimation
	this.fps			= _fps;			//Bilder pro Sekunde		-> float
	this.tile_anzahl	= _tile_anzahl;	//Anzahl der Einzelbilder	-> int
	this.tile_width		= _tile_width;	//Breite eines Einzelbildes	-> Pixel int
}

function Skalierung(_x, _y, _z){	//Prototyp für eine Skalierungsstufe, enthält x/y-Skalierung in % und z-Ebene
	this.x=_x;	//Skalierung in x-Richtung		-> % float
	this.y=_y;	//Skalierung in y-Richtung		-> % float
	this.z=_z;	//z-Index der Skalierungsstufe	-> int
}

//Prototyp für ein Bild, nutzt alle vorherigen Prototypen und kümmert sich um das Laden der eigentlichen Bilder
function Bild(_id, _pfad, _abmessungen, _animiert, _animationsmerkmale, _skalierungsstufen){
	this.id					= _id;					//ID des Bildes					-> string
	this.pfad				= _pfad;				//Dateipfad						-> String
	this.abmessungen		= _abmessungen;			//Abmessungen in Pixel			-> Abmessungen
	this.animiert			= _animiert;			//animiert oder nicht			-> boolean
	this.animationsmerkmale	= _animationsmerkmale;	//Eigenschaften der Animation	-> Animationsmerkmale
	this.bild				= new Image();			//das eigentliche Bild			-> Image
	this.bild.onload=function(){					/*aufgerufen nachdem das Bilde geladen wurde*/
		gBilder.geladen++;							/*Zähler für die fertig geladenen Bilder -> int*/
		aktualisiereLadebalken_Bilder();			/*Hook für den Ladebalken*/
		statusPruefen_Bilder();						/*Hook zur Benachrichtigung: Laden beendet*/
		waitforparser();							/*prüft ob Bilder und Dialoge vollständig geladen wurden*/
	}
	this.bild.src			=_pfad;					//initiiert das Laden des Bildes-> string
	this.skalierung			= new Array(_skalierungsstufen);//						-> Skalierung
}

/*********************
 *pictureAnimation.js*
 *********************/
 
//verwaltet die Animationen; enthält die zugehörigen Timer als Attribute, erreichbar über die Bild-ID
var gAnimationTimer		= new Object();
gAnimationTimer.anzahl	= 0;		//zählt die aktiven Timer im Objekt -> int

//Prototyp für ein animiertes Bild-Objekt, speichert den zugehörigen Timer
function Animation(_canvas_id, _bild_id, _anzeige_width, _anzeige_height, _isPerson){
	this.bild_nr	= 0;			//der Index des aktuell angezeigten Einzelbildes	-> int
	this.canvas_id	= _canvas_id;	//ID des Canvas in den gezeichnet wird				-> string
	this.bild_id	= _bild_id;		//ID des Bildes, das genutzt wird					-> string
	this.timer		= null;			//Timer der Animation, wird beim Erzeugen gesetzt	-> Timer (int)
	this.running	= true;			//zeigt an ob die Animation gerade aktiv ist		-> bool
	this.anzeige_width	= _anzeige_width;	//Größe des Bildes in Pixel
	this.anzeige_height	= _anzeige_height;
    this.isPerson = _isPerson;      //Marks a timer object as a person object
}

var gDirections       = new Array('front',  //Possible directions for a person object
                                  'back',
                                  'right',
                                  'left',
                                  'standing');
var gInitialDirection = 4;                  //Sets initial direction of a person object to 'standing'
var gCurrentDirection = gInitialDirection;  //Saves last known direction to compare against new directional values

/*****************
 *dialogParser.js*
 *****************/
 
 //der Pfad zur Dialoge.xml
// var gDialogeXMLPfad	= "../../dialoge.xml";
  var gDialogeXMLPfad	= "../dialoge.xml";
 //verwaltet alle Dialoge aus der XML-Datei
 var gDialoge			= new Object();
 //ein Zähler für die Anzahl der Dialoge
 gDialoge.anzahl		= 0;
 //Zähler für die bereits geladenen Dialoge
 gDialoge.geladen		= 0;
 
 //Prototyp für einen Dialog mit mindestens einem Satz
 function Dialog(_id, _anzahl_saetze){
	 
	 this.id			= _id;							//die ID dieses Dialogs					-> string
	 this.anzahl_saetze	= _anzahl_saetze;				//die Anzahl der Sätze in diesem Dialog	-> int
	 this.saetze		= new Array(_anzahl_saetze);	//die Sätze des Dialogs					-> Satz
	 gDialoge.geladen++;								/*Zähler für die fertig geladenen Bilder -> int*/
	 aktualisiereLadebalken_Dialoge();					/*Hook für den Ladebalken*/
	 statusPruefen_Dialoge();							/*Hook zur Benachrichtigung: Laden beendet*/
	 waitforparser();									/*prüft ob Bilder und Dialoge vollständig geladen wurden*/
 }
 
 //Prototyp für einen Satz in einem Dialog
 function Satz(_person_id, _bild_id, _inhalt){
	 
	 this.person_id	= _person_id;	//ID der sprechenden Person voraussichtlich ihr Anzeigename	-> string
	 this.bild_id	= _bild_id;		//ID des anzuzeigenden Bildes aus gBilder					-> string
	 this.inhalt	= _inhalt;		//der Text dieses Satzes									-> string
 }

/*****************
 *dialogControl.js*
 *****************/
 
 //Globale Variable die alle Einstellungen für Dialoge Abspeichert
 //gTalk - (soll keine schleichwerbung sein, sondern einfach nur kurz).
var gTalk			= new Object();
gTalk.bild_id 		= "null";			 //MUSS mit dialogSettings(...) initialisiert
gTalk.canvas_id		= "null";			 //MUSS mit dialogSettings(...) initialisiert
gTalk.font_color	= "white";			 //kann mit dialogSettings(...) verändert werden
gTalk.font_style	= "bold 16px Arial"; //kann mit dialogSettings(...) verändert werden
gTalk.line_distance = 10;				 //kann mit dialogSettings(...) verändert werden
gTalk.dialog_id		= "null";
gTalk.SatzGerade	= 0;
gTalk.SatzMax		= 0;

gTalk.TBPercPosX        = 50; //Textbox X position in %
gTalk.TBPercPosY        = 0;  //Textbox Y position in %
gTalk.TBPercWidth       = 80; //Textbox width in %
gTalk.TBPercHeight      = 80; //Textbox height in %
gTalk.TBPercTextPosX    = 17; //Textbox text X position in %
gTalk.TBPercTextPosY    = 20; //Textbox text Y position in %
gTalk.TBPercImagePosX   = 2;  //Textbox image X position in %
gTalk.TBPercImagePosY   = 5;  //Textbox image Y position in %
gTalk.TBPercImageWidth  = 20; //Textbox image width in %
gTalk.TBPercImageHeight = 20; //Textbox image height in %


var gTBDrawn = false;

//muss einmal aufgerufen werden
//Einstellungen für alle späteren DialogAufrufe
function dialogSettings(_bild_id, _canvas_id, _font_color, _font_style, _line_distance)
{
	gTalk.bild_id		=_bild_id;			//Hintergrundbild
	gTalk.canvas_id		=_canvas_id;		//CSS-Objekt-Name
	gTalk.font_color	=_font_color;		//Schriftfarbe
	gTalk.font_style	=_font_style;		//Schriftart (format: "flags size type"). z.B: "bold 16px Arial");
	gTalk.line_distance	=_line_distance		//Zeilenabstand
}

/***********
 *Utilities*
 ***********/

//Generates a CSS percentage from a numeric pixel value
function pix2perc(absolute, pixelValue){
    return (100 * pixelValue) / absolute + "%";
}

//Calculates the effective pixel value from a CSS percentage string
function perc2pix(absolute, perc){
    return (absolute / 100) * perc;
}

//prüft ob Bilder und Dialoge vollständig geladen wurden
function waitforparser(){
	//wenn alle Elemente geladen wurden
    if(gBilder.anzahl === gBilder.geladen && gDialoge.anzahl === gDialoge.geladen){
		//lese Szene ein
        getSceneInformation(gcurrent_scene_id, sceneXML);
	}
}

//rechnet den Z-Index in den Multiplikator der Zoomstufe um
function z2mult(z_index){
	
	if(z_index < 200){
        return gZoomsteps[0];
	}else if(z_index < 300){
        return gZoomsteps[1];
	}else if(z_index < 400){
        return gZoomsteps[2];
	}else {
        return gZoomsteps[3];
	}
}

//checks whether the passed string contains the passed substring
function strContains(string, substring){
    return string.indexOf(substring) === -1 ? false : true;
}
