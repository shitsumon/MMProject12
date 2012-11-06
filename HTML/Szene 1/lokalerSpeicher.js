function lokalerspeicher_start(){
	
	var bild=new Image();
	bild.onload=function(){
		lokalerspeicher_speicherebild(this);
		};
	bild.src="./../../Bilder/Szene 1/Hintergrund.jpg";
}

function lokalerspeicher_speicherebild(bild){
	
	var canvas=document.getElementById("dummySpot");
	var context=canvas.getContext("2d");

	var original=canvas.toDataURL();
	
//	alert(original);
	
	var org_height=canvas.height, org_width=canvas.width;
	
	context.clearRect(0,0,org_width,org_height);
	
	canvas.height=bild.height;
	canvas.width=bild.width;
	
	context.drawImage(bild,0,0);
	
	var bild_url=canvas.toDataURL();
	
//	alert(bild_url);
	
	canvas.height=org_height;
	canvas.width=org_width;
	
	bild=new Image();
	bild.onload=function(){
		context.drawImage(this,0,0);
		};
	bild.src=original;
	
	lokalerspeicher_speichere("bild",bild_url);
}

function lokalerspeicher_speichere(key, value){
	localStorage.setItem(key,value);
	alert(localStorage.getItem(key));
}