/*
controls picture animation by drawing frames to the given canvas and creating a timer to repeat it

parameters include:
	targeted canvas id
	id of picture to be used
	displayed dimensions of to be drawn frame
	flags
*/
function animiereCanvas(canvas_id, bild_id){

    //get canvas and its drawing context
    var canvas  = $("#" + canvas_id)[0];
	//exit is this canvas doesn't exist
	if(typeof(canvas) === "undefined"){
		
		return;
	}
	//get drawing context
    var ctx     = canvas.getContext("2d");

    //delete content
    ctx.clearRect ( 0, 0, canvas.width, canvas.height);

    /*draws frame following this scheme
		img the picture itself					-> Image,
		sx, sy start coordinates of frame		-> Pixel int,
		swidth, sheight frame dimensions		-> Pixel int,
		x, y upper left corner inside canvas	-> Pixel int,
		width, height dimensions inside canvas	-> Pixel int
    */
    ctx.drawImage(
					gBilder[bild_id].bild, /*image*/
					gAnimationTimer[bild_id].bild_nr * gBilder[bild_id].animationsmerkmale.tile_width, /*clipping x-direction*/
					gBilder[bild_id].animationsmerkmale.tile_height
						* gAnimationTimer[bild_id].subtileset, /*clipping y-direction*/
					gBilder[bild_id].animationsmerkmale.tile_width, /*clipped image width*/
					gBilder[bild_id].animationsmerkmale.tile_height, /*clipped image height*/
					0,       /*image x-pos in canvas*/
					0,       /*image y-pos in canvas*/
					gAnimationTimer[bild_id].anzeige_width, /*width of whole tileset image*/
					gAnimationTimer[bild_id].anzeige_height /*height of whole tileset image*/
                );

    //computes current frame counter
    gAnimationTimer[bild_id].bild_nr =
		(gAnimationTimer[bild_id].bild_nr < ( gBilder[bild_id].animationsmerkmale.tile_anzahl - 1 ))
            ? (gAnimationTimer[bild_id].bild_nr + 1) : 0;
}

//stops animation by deleting the timer
function stoppeAnimation(bild_id){
	
    window.clearInterval(gAnimationTimer[bild_id].timer);
    gAnimationTimer[bild_id].running = false;
	//reset frame counter to initial frame
	gAnimationTimer[bild_id].bild_nr = 0;
	//reduce active animations counter
    gAnimationTimer.anzahl--;
}

//starts animation and creates new timer
function starteAnimation(canvas_id, bild_id, pxWidth, pxHeight){

	var delimiter = '#';
	var gBilderIDString = '';
	
	if(strContains(bild_id, delimiter)){
		
		gBilderIDString = bild_id.split(delimiter)[0];
	}else{
		
		gBilderIDString = bild_id;
	}
	
	if(typeof(gAnimationTimer[bild_id]) === "undefined"){
        //create new animation object if none exists
        gAnimationTimer[bild_id] = new Animation(
						canvas_id,
						bild_id,
						pxWidth,
						pxHeight
                    );
    }
	
	//check whether a timer is defined
	if((typeof(gAnimationTimer[bild_id].timer) !== "undefined") && (gAnimationTimer[bild_id].timer != null)){
		//delete existing same timer
		stoppeAnimation(bild_id);
	}
	
	//create new timer
	gAnimationTimer[bild_id].timer = window.setInterval(function(){
			animiereCanvas(
							canvas_id,
							bild_id
						); },
			(1000 / gBilder[gBilderIDString].animationsmerkmale.fps)
		);
		
	gAnimationTimer[bild_id].running = true;
	//increase running animations count
	gAnimationTimer.anzahl++;
}

//toggles running and paused animation
function toggleAnimation(bild_id){
	
    if(gAnimationTimer[bild_id].running){
		
        stoppeAnimation(bild_id);
    }else{
		
        starteAnimation(bild_id);
    }
}

function switchWalkingAnimation(direction, bild_id){
	
	bild_id = bild_id.split("canvas_person_");

	//check whether given id corresponds to person canvas	
	if(bild_id.length == 2){
		//get picture id part
		bild_id = bild_id[1];
		
		switch(direction){
			case 'front':
				gAnimationTimer[bild_id].subtileset = 0;
				break;
			case 'back':
				gAnimationTimer[bild_id].subtileset = 1;
				break;
			case 'right':
				gAnimationTimer[bild_id].subtileset = 2;
				break;
			case 'left':
				gAnimationTimer[bild_id].subtileset = 3;
				break;
			case 'standing':
				gAnimationTimer[bild_id].subtileset = 4;
				break;
			default:
				gAnimationTimer[bild_id].subtileset = 4;
		}
	}
}
