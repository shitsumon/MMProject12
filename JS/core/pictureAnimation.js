/*
zuständig für das Erzeugen der Animationen. Schreibt Einzelbilder in einen gegeben Canvas und erzeugt einen Timer, der die Animation wiederholt.
*/
function animiereCanvas(canvas_id, bild_id){
	
	if(typeof gAnimationTimer[bild_id]==="undefined"){
		gAnimationTimer[bild_id]=new Animation(
				canvas_id,
				bild_id
			);
		starteAnimation(gAnimationTimer[bild_id]);
	}
		
	var canvas=$("#"+canvas_id)[0];
	var ctx=canvas.getContext("2d");
	
	ctx.clearRect ( 0, 0, canvas.width, canvas.height);

	//img,sx,sy,swidth,sheight,x,y,width,height	
	ctx.drawImage(
	gBilder[bild_id].bild,
	gAnimationTimer[bild_id].bild_nr*gBilder[bild_id].animationsmerkmale.tile_width,
	0,
	gBilder[bild_id].animationsmerkmale.tile_width,
	gBilder[bild_id].abmessungen.height,
	0,0,
	gBilder[bild_id].animationsmerkmale.tile_width,
	gBilder[bild_id].abmessungen.height);

	gAnimationTimer[bild_id].bild_nr=gAnimationTimer[bild_id].bild_nr<gBilder[bild_id].animationsmerkmale.tile_anzahl-1?
	gAnimationTimer[bild_id].bild_nr+1:0;
}

function stoppeAnimation(animation){
	window.clearInterval(animation.timer);
	animation.running=false;
}

function starteAnimation(animation){
	animation.timer=window.setInterval(function(){
					animiereCanvas(animation.canvas_id, animation.bild_id);
					},
				(1000/gBilder[animation.bild_id].animationsmerkmale.fps));
	animation.running=true;
}

function toggleAnimation(animation){
	if(animation.running){
		stoppeAnimation(animation);
	}else{
		starteAnimation(animation);
	}
}