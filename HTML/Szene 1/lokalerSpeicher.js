function lokalerspeicher_start(){
	
	//erzeugt ein bild zur demonstration
	var bild=new Image();
	bild.onload=function(){
		lokalerspeicher_speicherebild(this);
		};
	bild.src="./../../Bilder/Szene 1/Hintergrund.jpg";
}

function lokalerspeicher_speicherebild(bild){
	//erhält ein image object und speichert es als canvas dataurl (prinzipiell base64) in html5 localstorage
	
	//suche unsichtbaren canvas dummyspot
	var canvas=document.getElementById("dummySpot");
	var context=canvas.getContext("2d");
	
	//sichere original inhalt des canvas als dataurl
	var original=canvas.toDataURL();
	
//	alert(original);
	//sichere abmessungen zur widerherstellung
	var org_height=canvas.height, org_width=canvas.width;
	//lösche inhalt
	context.clearRect(0,0,org_width,org_height);
	//setze abmessungen entsprechend des übergebenen bildes
	canvas.height=bild.height;
	canvas.width=bild.width;
	//zeichne das bild
	context.drawImage(bild,0,0);
	//speicher dataurl des übergebenen bildes
	var bild_url=canvas.toDataURL();
	
//	alert(bild_url);
	//stelle das original wieder her
	canvas.height=org_height;
	canvas.width=org_width;
	
	bild=new Image();
	bild.onload=function(){
		context.drawImage(this,0,0);
		};
	bild.src=original;
	//schreibe in localstorage
	lokalerspeicher_speichere("bild",bild_url);
}

function lokalerspeicher_speichere(key, value){
	localStorage.setItem(key,value);
	alert(localStorage.getItem(key));
}