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
    <!--<html>
        <head>
            <script type="text/javascript" src="../../JS/external/jquery.js"></script>  <!-- 1. -->
            <script type="text/javascript" src="../../JS/core/helper.js"></script>      <!-- 2. -->
            <script type="text/javascript" src="../../JS/core/animation.js"></script>   <!-- 3. -->
        </head>
        <body>
        </body>
    </html>-->
*/

/**********
*Debugging*
***********/

var gDebugModeOn = false;

function outputDebugInfo(){
	if(gDebugModeOn){
		//log called function and arguments
		console.trace();
	}
}

/***********
 *Demo Mode*
 ***********/
var gDemoMode = false;
var gStopAtScene = 'Szene_3';

/*********
 *menu.js*
 *********/
var gMenuPercPosY       = 65;
var gMenuPercPosX       = 50;
var gImpressumPercPosY  = 65;
var gImpressumPercPosX  = 50;
var gCreditsPercPosY    = 60;
var gCreditsPercPosX    = 50;
var gDemoPercPosY       = 50;
var gDemoPercPosX       = 45;

/****************
 *sceneParser.js*
 ****************/
//szenen.xml path
var sceneXML				= "../szenen.xml";
//index of current scene
var gcurrent_scene_counter	= 1;
//enables space movement animations. false=off, true=on
var gSpace = false;
//id of current scene
var gcurrent_scene_id		= "Szene_" + gcurrent_scene_counter.toString();
//scenes which require a forced dialog start at scene start
var gForceDialogScenes = new Array('Szene_2','Szene_3','Szene_4','Szene_5','Szene_7');
//z-index multiplicators
var gZoomsteps				= new Array(4);
//controls display of curent and next scene
//true makes waitforparser start sceneParser while false prevents it
//sceneParser sets it to false when finished to make dialogues and pictures load while the cuurrent scene is still running
var gdisplay_next_scene		= true;
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
}
//Struct for object information includes Position struct, Size struct and Quiz info
function objectStruct(imgID, diagID, xPos, yPos, zPos, width, height){

    this.imageID    = imgID;
	//dialog array per quizstep
    this.dialogueID = diagID;

    this.position   = new Position(xPos, yPos, zPos);
    this.size       = new Size(width, height);
	//contains 4 strings -> quizstep, quiztrigger, clickable, walkto
	//represented by arrays denoted by "|"
	//maybe transform to use objects instead of arrays
	//quiz_step		[0] = "f|t|f|t" -> controls display of canvas -> shown in step 2 and 4, invisible in 1 and 3
	//quiz_trigger	[1] = "t|t|f|f" ->	controls whether this canvas triggers the quiz
	//									step 1 and 2 do, while 3 and 4 don't
	//clickable		[2] = "t|f|t|f" -> whether the canvas is clickable in this quizstep
	//walkto		[3] = "t|t|t|f" -> whether the player can walk there
	this.quiz		= new Array(4);
	
	this.laufziel	= null;
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

//permanent storage for later usage of image information
var gImageStats = new Array();

//image stat object
function imageStatObject(id, position, size, laufziel){
    this.id       = id;
    this.position = position;
    this.size     = size;
	this.laufziel = laufziel;
}

/**********************
 *clickEventHandler.js*
 *********************/

var gClickEventValueArray         = new Array();
var gEventHandlerBusy             = false;
var gQuizAndDialogArgumentsLocked = false;

var gQuizFlags      = 'undefined';
var gDialogValue1   = 'undefined';
var gDialogValue2   = 'undefined';

var gMostRecentlyClickedIdentifier = '';

/**************
 *walkAnimation.js*
 **************/
function lastValidInformation(x,y,w,h){
    this.x      = typeof(x) == 'undefined' ? 0 : x;
    this.y      = typeof(y) == 'undefined' ? 0 : y;
}

var gLastValidPositionData = new lastValidInformation();

 //used to set an overlay from HTML code as movement target
var gTargetIdentifier  	= "";
//flag to compare current and newly clicked aim and to signal active movement
var gisWalkingTo		= "";
//waypoint positions of central path
//hero uses it as path between differing z-index
var gWegPos				= new Array(4);
//x- and y-coordinates of waypoints -> hero pos to waypt1 to waypt 2 to goal
//[2][2/3] contains computed hero dimensions stepwidth for zooming on central path
var gTargets			= new Array(new Array(2), new Array(4), new Array(2));
//hero dimensions continuously updated while walking
var gStartAbmessungen	= new Array(2);
//movement vector for the three waypoints
//[0/2][2] contain hero and goal z-index, [1][2] contains z movement vector
var gMoveVec			= new Array(new Array(3), new Array(3), new Array(3));
//flag to compute movement vector just once per goal, set by walkAnimation if vector has been computed/goal is reached
var gWegBerechnet		= false;	
var gAufrufeProSekunde	= 25;
//controls movement speed
var gPixelProAufruf		= 90;
var gIntervall			= 1000 / gAufrufeProSekunde;
//index of current aim
var gAktuellesZiel		= 0;
//Stores last known direction
var gLastDirection      = 'standing_l';

/******************
 *pictureParser.js*
 ******************/
//Array for last step in scene when new images are
//loaded, the old ones will be moved into this structure
var gDeprecatedImages       = new Object();
gDeprecatedImages.anzahl    = 0;
gDeprecatedImages.geladen   = 0;
//Flag which determines whether to use gBilder or gDeprecatedImages
var gUseDeprecatedImages = false;
//path to bilder.xml
var gbilderXMLPfad	= "../bilder/bilder.xml";
//global picture objekt, contains all pictures as attribute accesible by id
var gBilder			= new Object();
//number of pictures to be loaded from bilder.xml set by pictureParser depending on scene number
gBilder.anzahl		= 0;
//counter for succesfully loaded pictures set by pictureParser
gBilder.geladen		= 0;
//signals succesful loading of xml file
gpictureparser_xml_geladen = false;
//prototype for picture dimensions in pixel
function Abmessungen(_height, _width){
	this.height	= _height;	//Pixel int
	this.width	= _width;	//Pixel int
}
//prototype of picture animation
function Animationsmerkmale(_fps, _tile_anzahl, _tile_width, _tile_height){
	this.fps			= _fps;			//frames per second	-> float
	this.tile_anzahl	= _tile_anzahl;	//frame number		-> int
	this.tile_width		= _tile_width;	//frame width		-> Pixel int
	this.tile_height	= _tile_height;	//frame height		-> Pixel int
}
//picture prototype uses all previous prototypes and loads pictures
function Bild(_id, _pfad, _abmessungen, _animiert){
	this.id					= _id;					//picture id					-> string
	this.pfad				= _pfad;				//filepath						-> String
	this.abmessungen		= _abmessungen;			//pixel dimensions				-> Abmessungen
	this.animiert			= _animiert;			//animated flag					-> boolean
	this.animationsmerkmale	= null;					//animation properties			-> Animationsmerkmale
	this.bild				= new Image();			//the picture itself			-> Image
	this.bild.onload = function(){					/*called after loading has finished*/
		gBilder.geladen++;							/*counter for succesfully loaded pictures -> int*/
		aktualisiereLadebalken_Bilder();			/*progressbar hook*/
		statusPruefen_Bilder();						/*loading finished hook*/
		waitforparser();							/*checks whether dialogues and pictures where loaded completely*/
	}
	this.bild.src			= _pfad;				//initializes picture loading	-> string
}

/*********************
 *pictureAnimation.js*
 *********************/

gIsSceneBeginning = false;

//manages animation and contains all attributes accessible by picture id
var gAnimationTimer		= new Object();
//active timer counter	-> int
gAnimationTimer.anzahl	= 0;
//prototype of an animated picture, stores corresponding timer
function Animation(_canvas_id, _bild_id, _anzeige_width, _anzeige_height){


	this.bild_nr	= 0;			//index of currently displayed frame	-> int
	this.canvas_id	= _canvas_id;	//id of targeted canvas					-> string
	this.bild_id	= _bild_id;		//used picture id						-> string
	this.timer		= null;			//animation timer id set when creating	-> Timer (int)
	this.running	= true;			//flag if animation is active			-> bool
	this.anzeige_width	= _anzeige_width;	//pixel picture dimensions
	this.anzeige_height	= _anzeige_height;	//determines dimensions inside canvas
    this.subtileset	= gInitialDirection;	//defines current subtileset
}

//Sets initial direction of a person object to 'standing'
var gInitialDirection = 6;

/*****************
 *dialogParser.js*
*****************/
//dialoge.xml path
var gDialogeXMLPfad	= "../dialoge.xml";
//manages all dialogues from xml
var gDialoge			= new Object();
//dialogues to be loaded in the current scene
gDialoge.anzahl		= 0;
//counter for succesfully loaded dialogues
gDialoge.geladen		= 0;
//Flag which enables use of gDeprecatedDialogues
var gUseDeprecatedDialogues = false;
//Stores dialogues of current scene when gDialoge is resetted
var gDeprecatedDialogues = new Object();
//flag for initial loading sequence
gInitialLoad = true;
//signals succesfull loading of xml-file
gdialogparser_xml_geladen = false;
//prototype of dialogue object with at least one single sentence
function Dialog(_id, _anzahl_saetze){
	
	this.id				= _id;							//dialogue id								-> string
	this.anzahl_saetze	= _anzahl_saetze;				//number of sentences per dialogue			-> int
	this.saetze			= new Array(_anzahl_saetze);	//dialogues senences						-> Satz
	gDialoge.geladen++;									/*counter for succesfully loaded dialogues	-> int*/
	aktualisiereLadebalken_Dialoge();					/*progressbar hook*/
	statusPruefen_Dialoge();							/*loading finished hook*/
	waitforparser();									/*checks whether pictures and dialogues have finished loading*/
}
//prototype of single sentence in a dialogue
function Satz(_person_id, _bild_id, _inhalt){
	
	this.person_id	= _person_id;	//talking persons id		-> string
	this.bild_id	= _bild_id;		//picture id inside gBilder	-> string
	this.inhalt		= _inhalt;		//sentence content			-> string
}

/*****************
 *dialogControl.js*
 *****************/
//global variable to store dialogues properties
var gPercentageFontSize	= 10;
//prototype of dialogue object
var gTalk			= new Object();
gTalk.bild_id 		= "allg_dialogbox";		//has to be initialised by dialogSettings()
gTalk.canvas_id		= "null";				//has to be initialised by dialogSettings()
gTalk.font_color	= "yellow";				//can be customized by dialogSettings()
gTalk.font_style	= "bold 22px Arial";	//can be customized by dialogSettings()
gTalk.line_distance = 18;					//can be customized by dialogSettings()
gTalk.dialog_id		= "null";
gTalk.SatzCounter	= 0;
gTalk.SatzMax		= 0;
gTalk.currentDialog = 'undefined';
gTalk.isInitialized = false;

gTalk.TBPercPosX        = 20;    //Textbox X position in %
gTalk.TBPercPosY        = 20;    //Textbox Y position in %
gTalk.TBPercWidth       = 100;   //Textbox width in %
gTalk.TBPercHeight      = 100;   //Textbox height in %
gTalk.TBPercTextPosX    = 25;    //Textbox text X position in %
gTalk.TBPercTextPosY    = 40;    //Textbox text Y position in %
gTalk.TBPercImagePosX   = 5.65;  //Textbox image X position in %
gTalk.TBPercImagePosY   = 24.20; //Textbox image Y position in %
gTalk.TBPercImageWidth  = 15;   //Textbox image width in %
gTalk.TBPercImageHeight = 60;   //Textbox image height in %

var gTBDrawn = false;

//has to be called once to configure dialogues
function dialogSettings(_bild_id, _canvas_id, _font_color, _font_style, _line_distance){

	gTalk.bild_id		= _bild_id;			//background picture id
	gTalk.canvas_id		= _canvas_id;		//CSS object name
	gTalk.font_color	= _font_color;		//font colour
	gTalk.font_style	= _font_style;		//font (properties: "flags size type") -> "bold 16px Arial"
	gTalk.line_distance	= _line_distance	//line distance
}

function changeFontSize(size_in_px){
	//get font style which should look sth like "bold 22px Arial"
	var font_style = gTalk.font_style.split(" ");
	//take "22px" from the array and remove "px"
	font_style[1]=size_in_px+"px";
	//reset current font_style
	gTalk.font_style="";
	//rebuild font_style from all elements of the array
	for(var index in font_style){
		
		gTalk.font_style += font_style[index];
		//put a space between all elements but not at the beginning or end of the resulting string
		gTalk.font_style += (index >= 0) && (index < (font_style.length - 1)) ? " ":"";
	}
	//set line distance to roughly fit font size
	gTalk.line_distance = 0.9 * size_in_px;
}

//Stores scene id and whether this step trigger a quiz step
function DialogIDObject(scene_id, tqs, eas, ise, argl){
    this.scene_id               = scene_id;
    this.trigger_quizstep       = tqs;
    this.enable_at_start        = eas;
    this.invoke_scene_exception = ise;
    this.argument_list          = argl;
}

//Blacklist object
function BlacklistIDObject(scene_id, counter_step){
    this.scene_id         = scene_id;
    this.counter_step     = counter_step;
}

//force dialog variables
var gForceOtherDialog = false;
var gDialogToForce    = '';
//scene id array for dialog referencing
var gDialogIDs                   = new Array();
var gDeprecatedDialogIDs         = new Array();
var gDeprecatedNumberOfDialogues = 0;
var gUseDeprecated = false;
//Lookup table for imageID dialogID mapping
var gImageToObjectSceneReferrer = new Array();
//Sub-dialogues which have been already displayed
var gSubDialogBlacklist = new Array();
//Overall number of dialogs per scene
var gNumberOfDialogues          = 0;
//Point always to the current dialog in gDialogIDs
var gDialogCounter              = 0;
//Sub dialog offset
var gSubDialogOffset            = 0;
//Number of sub dialogues
var gSubDialogCount             = 0;
//Enables addition of subdialog steps to dialog counter if true
var gIncreaseDialogStep = true;
//Proxy names to filter for in dialog sentences
var gP1Proxy = "P1_DYN_NAME";
var gP2Proxy = "P2_DYN_NAME";

//Fallback name if name values are not present
var gFallbackNameP1 = "Commander Kate";
var gFallbackNameP2 = "Techniker Spike";

//Variables which hold the characters and the sidekicks names
var gP1Name = "undefined";
var gP2Name = "undefined";

//asking user to input the names of the main characters of the game
function getCharacterNames()
{
	gP1Name = prompt("Wie soll der weibliche Hauptcharakter heißen?", "Jane");
	gP2Name = prompt("Wie soll der männliche Nebencharakter heißen?", "John");

	if (( gP1Name == null ) || ( gP2Name == null ))
	{
		//if incorrect or no names are set, mark as undefined and replace with FallbackNames later
		gP1Name = "undefined";
		gP2Name = "undefined";
	}
	  
	//continue with loading of first scene
	ladeBilder();
	ladeDialoge();
}

/***************
 *quizControl*
 ***************/
//Flag prevents loading of next scene more than once
var gSceneHasBeenLoad = false;
//number of quizsteps per scene
var gQuizsteps				= 0;
//current quizstep
var gCurrentQuizstep		= 0;
//stores quiztrigger flag of aimed canvas while moving
var gQuiztriggerAfterMoving	= "";
var gQuizTrueQuizSteps      = 0;

/***************
 *Codegenerator*
 ***************/
 
//index of the scene specifique codegenerator array, incremented by clickEventHandler to be able to load the scene again
var gCodegeneratorIndex = 0;

//flag to signal loading by code is going on
var gLoadByCode = false;

//array for encoding/decoding numbers to numerals in game save code
//keep all values at the same length to not break codeGenerator->entschluesseln()
var gNumberToNumeral = new Array(
	"nn","ne","nz",
	"nd","nv","nf",
	"ns","ni","na",
	"nu","en","ee",
	"ez","ed","ev",
	"ef","es","ei",
	"ea","eu","zn",
	"ze","zz","zd",
	"zv","zf","zs",
	"zi","za","zu"
);

//array with sub array for every scene
var gCodegeneratorArray = new Array(7);
//sub array for scene 1 containing all index entries of the correctly, in order, clicked objects in gClickEventValueArray
gCodegeneratorArray[0] = new Array(1, 18, 18, 18, 18, 18, 18, 18, 18, 3, 18, 4, 18, 18, 8, 18, 18, 18, 2, 18, 18, 18, 3, 18, 18, 18, 11, 18, 18, 18, 18, 18, 18, 18, 18);

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
//checks whether dialogues and pictures completed loading before calling sceneParser
function waitforparser(){
outputDebugInfo();

	//if everything finished and the next scene should be displayed
    if(gpictureparser_xml_geladen && gdialogparser_xml_geladen &&
		(gBilder.anzahl == gBilder.geladen) && (gDialoge.anzahl == gDialoge.geladen) &&
		gdisplay_next_scene){
		//display next scene
        getSceneInformation(gcurrent_scene_id, sceneXML);
	}
}
//converts z-index to zoomstep multiplicator
function z2mult(z_index){
	
	if(z_index < 200){
        return gZoomsteps[0];//hg_dynamisch
	}else if(z_index < 300){
        return gZoomsteps[1];//person
	}else if(z_index < 400){
        return gZoomsteps[2];//vg_statisch
	}else {
        return gZoomsteps[3];//vg_dynamisch
	}
}
//checks whether the passed string contains the passed substring
function strContains(string, substring){
    return string.indexOf(substring) === -1 ? false : true;
}

//timer for hiding intro
setTimeout(function() { HideElementsIntro(); },25000);

function HideElementsIntro(){
outputDebugInfo();

	//hides intro elements
	$('h1').remove();
	$("#titles").remove();
	$("#titlesback").remove();
	$("#titlecontent").remove();
};

function HideElementsMenu(){
	//hides menu elements, called in sceneparser
	$('#bg').remove();
	$('#menu').remove();
}

/************
 *Exceptions*
 ************/

var gQuizDialogBlacklist = new Array();

/*************************
 *Scene 5 exceptions data*
 *************************/
function bookStep(name){
outputDebugInfo();

    this.name = name;
    this.wasClicked = false;
}

var gBooksClicked = new Array(new bookStep('book1'),
                              new bookStep('book2'),
                              new bookStep('book3'),
                              new bookStep('book4'),
                              new bookStep('book5'),
                              new bookStep('book6'),
                              new bookStep('book7'),
                              new bookStep('book8'),
                              new bookStep('book9'),
                              new bookStep('book10'));


//Scene 5 2nd riddle font settings
var gScene5_LayoutSettings              = new Object();
gScene5_LayoutSettings.font             = ' Arial';
gScene5_LayoutSettings.bold             = 'bold ';
gScene5_LayoutSettings.font_color       = 'white';
gScene5_LayoutSettings.line_distance    = 25;
gScene5_LayoutSettings.fixedFont        = 20;
gScene5_LayoutSettings.qCharDivider     = 2;
gScene5_LayoutSettings.qLeftMargin      = 9.5;
gScene5_LayoutSettings.font_size_boost  = 1.2;

function QuizObject(q, a1, a2, a3, a4){
    this.question = q;
    this.answers  = new Array(a1, a2, a3, a4);
}

var gQuizDataArray = new Array();

//question 1
gQuizDataArray.push(new QuizObject(
                        "Wie lautet das Wort, welches ihr als Grundlage nehmen wollt?",
                        "A. Einfach",
                        "B. Sternen",
                        "C. Quantenbeschleuniger",
                        "D. Schnecke"
                        ));

//question 2
gQuizDataArray.push(new QuizObject(
                        'Mit welchen Zahlen wollt ihr das Wort "Quantenphysik" ergänzen?',
                        "A. 5854256 Sekunden",
                        "B. Von 1999",
                        "C. 21. Jahrhundert",
                        "D. Version 1.0"
                        ));

//question 3
gQuizDataArray.push(new QuizObject(
                        "Es fehlen noch Sonderzeichen, welche kommen in Frage?",
                        "A. 1.0",
                        "B. Einfach – der einfache Leitfaden",
                        "C. Krumm, krummer, am krummsten",
                        "D. Alles von :) über -.- bis zu =("
                        ));

//question 4
gQuizDataArray.push(new QuizObject(
                        "Euch fehlt noch etwas, was könnte das sein?",
                        "A. Tobias die Schnecke – Kindergeschichten",
                        "B. SCHREIEN SOLL GELERNT SEIN – DER 10 TAGE AUFBAUKURS",
                        "C. Kochen für Dummies – Keine Angst wir kochen für alle",
                        "D. Buch ohne Titel – Der Klassiker von 1999"
                        ));

var gRiddleStepStates = new Array(new Array(false,false,true,false),
                                  new Array(true,false,false,false),
                                  new Array(false,false,false,true),
                                  new Array(false,true,false,false));

var gRiddleStepCounter = 0;

//var gClickableSlots = new Array('canvas_fg_dynamic_szene5_antwort_a_underlay',
//                                'canvas_fg_dynamic_szene5_antwort_b_underlay',
//                                'canvas_fg_dynamic_szene5_antwort_c_underlay',
//                                'canvas_fg_dynamic_szene5_antwort_d_underlay')

function getClickableSlots(){
    return new Array('canvas_fg_dynamic_szene' + gcurrent_scene_counter + '_antwort_a_underlay',
                     'canvas_fg_dynamic_szene' + gcurrent_scene_counter + '_antwort_b_underlay',
                     'canvas_fg_dynamic_szene' + gcurrent_scene_counter + '_antwort_c_underlay',
                     'canvas_fg_dynamic_szene' + gcurrent_scene_counter + '_antwort_d_underlay')

}

/*************************
 *Scene 7 exceptions data*
 *************************/
var gRotationCounter      = 1;
var gDrChaosScalingFactor = 1;
var gTimerHandle;

var gScene7DataArray = new Array();
gScene7DataArray.push(new QuizObject(
                          "Wie sollten in sozialen Netzwerken meine Privatsphäre-Einstellungen sein?",
                          "A. Die wichtigsten Daten sind auf privat gestellt, den Rest (z.B. meine Bilder) können nur meine Freunde sehen.",
                          "B. Nur meine Freunde & Freunde von Freunden können alle Informationen von mir einsehen.",
                          "C. Die wichtigsten Daten sind auf privat gestellt, den Rest (z.B. meine Bilder) kann aber jeder anschauen.",
                          "D. Jeder kann auf alle Informationen zu greifen, die ich veröffentliche."
                        ));

gScene7DataArray.push(new QuizObject(
                          "Was sollte ich bei Zugriffsberechtigungen bedenken?",
                          "A. Nichts weiter, wenn jemand fragt bekommt er natürlich welche.",
                          "B. Zugriff sollten immer nur vertrauenswürdige Leute bekommen, und dann nur eingeschränkten, niemals vollen.",
                          "D. Freunde bekommen vollen Zugriff, unbekannte gar keinen.",
                          "D. Jeder der fragt bekommt nur eingeschränkte Rechte."
                        ));

gScene7DataArray.push(new QuizObject(
                          "Was sollte ich beim Hoch – und Runterladen beachten?",
                          "A. Filme sind urheberrechtlich geschützt und dürfen nicht runtergeladen werden, Musik ist aber bedenkenlos runterzuladen.",
                          "B. Das Hochladen von Filmen, Musik, Ebooks & Hörbüchern ist verboten, das Runterladen aber legal.",
                          "C. Sowohl das Hochladen, als auch das illegale Runterladen kostenpflichtiger Inhalte wie Filme, Musik, Ebooks & Hörbüchern ist verboten.",
                          "D. Alles was ich runterladen kann ist erlaubt, sonst könnt ich es ja nicht runterladen."
                        ));

gScene7DataArray.push(new QuizObject(
                          "Mich schreibt jemand fremdes im Netz an, worauf sollte ich achten?",
                          "A. Unbekannte im Internet sind eine Gefahr. Ich sollte nie Unbekannten zurückschreiben und auch nicht auf Internetseiten gehen, die diese mir schicken.",
                          "B. Cool, ich bin beliebt! Ich schreibe natürlich zurück.",
                          "C. Ich schreibe Fremden nicht zurück, aber die Interseite, die er mir schickt schaue ich mir natürlich an.",
                          "D. Wenn jemand fremdes mit mir in einem sozialen Netzwerk befreundet ein möchte, nehme ich die Freundschaft natürlich sofort an."
                        ));

gScene7DataArray.push(new QuizObject(
                          "Viele Dinge werden am Computer mit Passwörtern gesichert, wie wähle ich ein sicheres Passwort?",
                          "A. Ich nehme meinen Vornamen mit meinem Geburtsdatum dahinter, das sieht sicher aus.",
                          "B. 'abcde' oder '12345' sieht leicht aus, ich nehme eins der beiden.",
                          "C. Es gibt nur ein sicheres Passwort, eines was ich mir ausdenke. Ich nehme also Hundeknochen, das hat keinen Bezug zu mir.",
                          "D. Mein sicheres Passwort besteht aus Zahlen, Klein- und Großbuchstaben und Zeichen."
                        ));

var gScene7RiddleStepStates = new Array(new Array(true,false,false,false),
                                        new Array(false,true,false,false),
                                        new Array(false,false,true,false),
                                        new Array(true,false,false,false),
                                        new Array(false,false,false,true));
