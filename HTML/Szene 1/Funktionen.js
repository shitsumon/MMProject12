//helper struct
function imageItem(name, filename, folder, xPos, yPos){
	this.name   = name;
	this.filename   = filename;
	this.folder = folder;
	this.xPos   = xPos;
	this.yPos   = yPos;
}

//Content of this array comes from XML-Parse function which is yet
//to be defined!
var imageItems = [
	new imageItem('protagonist1', 'Protagonist1.png', 'Allgemein', 90, 90),
	new imageItem('doorOverlay', 'door_overlay.png', 'Szene 1' , 27.5, 30),
	new imageItem('windowOverlay', 'windowOverlay.png', 'Szene 1' , 80, 30),
	new imageItem('dummySpot', 'dummySpot.png', 'Szene 1' , 0, 0)
	];

//Main function which is called when HTML-document is loaded
function starte_szene(szene){
	
	hintergrund_laden(szene);
	
	switch (szene){
		case "Szene 1":
		loadSubImagesToStartPosition();
		text_anzeigen("Protagonist 1","Wo bin ich?");
		break;
		
		default:
		alert("Fehler beim Laden der Szene!");
	}
}

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

function schreibe_bild_in_canvas(canvas_id, szene, bild_name){
	var _canvas = document.getElementById(canvas_id);
	var _context = _canvas.getContext("2d");
	var _bild = new Image();

	var imgsrc = "./../../Bilder/" + szene + "/" + bild_name;
	
	_bild.src = imgsrc;

	_canvas.width = _bild.width;
	_canvas.height = _bild.height;
	
	_context.drawImage(_bild,0,0);
	
	return {canvas:_canvas, context:_context, bild:_bild}
}

function hintergrund_laden(szene){
	schreibe_bild_in_canvas("hintergrund_canvas",szene,"Hintergrund.jpg");
}

function figur_laden(figur, position_x, position_y){
	
	var erg=schreibe_bild_in_canvas("protagonist1","Allgemein","Protagonist1.png");
	var hintergrund=document.getElementById("hintergrund_canvas");
	
	var x=(erg.canvas.clientWidth/hintergrund.clientWidth*100);
	var y=(erg.canvas.clientHeight/hintergrund.clientHeight*100);
	
	x=position_x-x;
	y=position_y-y;
	
	//alert("X2: " + x + "%" + "\nY2: " + y + "%");
	
	erg.canvas.style.left=x+"%";
	erg.canvas.style.top=y+"%";
}


function text_anzeigen(person, text){
	var canvas=document.getElementById("textbox");
	var context=canvas.getContext("2d");

	canvas.style.display="inline";
	
	canvas.addEventListener("click",function(){
		this.style.display="none";
		},false);
	
	canvas.width=document.getElementById("hintergrund_canvas").clientWidth;
	canvas.height=document.getElementById("hintergrund_canvas").clientHeight*0.15;
		
	context.fillStyle="#000";
	context.globalAlpha=0.9;
	context.fillRect(0,0,canvas.clientWidth,canvas.clientHeight);
	
	context.fillStyle="#eee";
	context.globalAlpha=1.0;
	context.textBaseline="top";
	context.font="small Arial";
	context.fillText(person+": "+text,0,0);
}

//Globale Variablen
var protagonist, ziel, xZiel, yZiel, xProt, yProt, deltaX, deltaY, yFactor, bgWidth, bgHeight;
var usedOnce = false;
var globalTarget = "";

function updatePositions(){

	protagonist = document.getElementById("protagonist1");
	ziel		= document.getElementById(globalTarget);
	bg			= document.getElementById("hintergrund_canvas");
	
	bgWidth  	= bg.width;
	bgHeight 	= bg.height;
	
	var p1XString = protagonist.style.left;
	var p1YString = protagonist.style.top;
	
	var zielXString = ziel.style.left;
	var zielYString = ziel.style.top;	
	
	xProt = Math.round((bgWidth / 100) * parseInt(p1XString.replace("%","")));
	yProt = Math.round((bgHeight / 100) * parseInt(p1YString.replace("%","")));
	
	xZiel = Math.round((bgWidth / 100) * parseInt(zielXString.replace("%","")));
	yZiel = Math.round((bgHeight / 100) * parseInt(zielYString.replace("%","")));
	
}

function berechneBewegungsfaktor(){
	
	updatePositions();
	
	deltaX = xProt - xZiel;
	deltaY = yProt - yZiel;
	
	yFactor = deltaX / deltaY;
	
	/*alert("x-prot: " + xProt + "\n" +
		  "y-prot: " + yProt + "\n" +
		  "x-ziel: " + xZiel + "\n" +
		  "y-ziel: " + yZiel + "\n" +
		  "delta-x: " + deltaX + "\n" +
		  "delta-y: " + deltaY + "\n" +
		  "yFactor: " + yFactor + "\n");*/
}

function areWeThereYet(zielName){
	
	/*protagonist = document.getElementById("protagonist1");
	ziel		= document.getElementById(zielName);
	
	var p1XString = protagonist.style.left;
	var p1YString = protagonist.style.top;
	
	var zielXString = ziel.style.left;
	var zielYString = ziel.style.top;
	
	var xP1 = Math.round((bgWidth / 100) * parseInt(p1XString.replace("%","")));
	var yP1 = Math.round((bgHeight / 100) * parseInt(p1YString.replace("%","")));
	
	var xZ = Math.round((bgWidth / 100) * parseInt(zielXString.replace("%","")));
	var yZ = Math.round((bgHeight / 100) * parseInt(zielYString.replace("%","")));*/
	
	updatePositions();
	
	/*alert("x-prot: " + xP1 + "\n" +
		  "y-prot: " + yP1 + "\n" +
		  "x-ziel: " + xZ + "\n" +
		  "y-ziel: " + yZ + "\n");*/
		  
	/*alert("x-prot: " + xProt + "\n" +
		  "y-prot: " + yProt + "\n" +
		  "x-ziel: " + xZiel + "\n" +
		  "y-ziel: " + yZiel + "\n");*/
	
	/*if((xP1 - xZ) == 0 || (yP1 - yZ) == 0){
		return true;
	}else{
		return false;
	}*/
	
	if((xProt - xZiel) == 0 || (yProt - yZiel) == 0){
		return true;
	}else{
		return false;
	}
}

function bewegeObjekt(){

	var velocity = 1.00;
	
	if(xProt > xZiel){
		xProt -= Math.round(yFactor * velocity);
	}else{
		xProt += Math.round(yFactor * velocity);
	}
	
	if(yProt > yZiel){
		yProt -= velocity;
	}else{
		yProt += velocity;
	}
	
	//alert("x: " + xProt + "\ny: " + yProt);
	
	var xPerc = (100 * xProt / bgWidth) + "%";
	var yPerc = (100 * yProt / bgHeight) + "%";
	
	protagonist.style.left = xPerc;
	protagonist.style.top = yPerc;
}

function moveP1(){

	//alert(globalTarget);

	if(!usedOnce){
		berechneBewegungsfaktor();
		usedOnce = true;
	}
	
	bewegeObjekt();
	
	var aktiv = setTimeout(function(){moveP1()}, 75);
	
	if(areWeThereYet(globalTarget)){
		clearTimeout(aktiv);
		usedOnce = false;
		alert("Stopped");
	}
}
