function starte_szene(szene){
		
	hintergrund_laden(szene);
	
	switch (szene){
		case "Szene 1":
		figur_laden('p1',95,95);
		text_anzeigen("Protagonist 1","Wo bin ich?");
		break;
		
		default:
		alert("Fehler beim Laden der Szene!");
	}
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

function schreibe_bild_in_canvas(canvas_id, szene, bild_name){
	var _canvas=document.getElementById(canvas_id);
	var _context=_canvas.getContext("2d");
	var _bild=new Image();
//	_bild.onload=function(){
//	};
	_bild.src="./../../Bilder/"+szene+"/"+bild_name;

	_canvas.width=_bild.width;
	_canvas.height=_bild.height;
	_context.drawImage(_bild,0,0);
	
	/*alert(canvas_id);
	alert(szene);
	alert(bild_name);
	alert(_bild.src);
	alert(_bild);*/
	
	return {canvas:_canvas, context:_context, bild:_bild}
}