//codegenerator for saving and resuming the game

//takes current scene count and quiz count to compute pass string
function verschluesseln(){
outputDebugInfo();
	
    var dummy, helper, code = "";
	//convert from number to numeral and concatenate current scene and quiz counter
	helper = gNumberToNumeral[gcurrent_scene_counter] + "x" + gNumberToNumeral[gCodegeneratorIndex]
	
    for (var i = 0; i < helper.length; i++){
		//get charcode corresponding to ascii and shift by 13
		dummy = helper.charCodeAt(i) + 13; //ROT13 ;)
		//check whether we exceed a-z range and rotate instead of just shift if appropriate
		dummy = dummy > 122 ? dummy - 26 : dummy;// "x" = 122; "x" - 26 = "a"
		//everything smaller than about half of range a-z stays if i is even
		if((dummy > 109) || ((i % 2) != 0)){//109 = "m"
			//everything else is converted to upper case
			dummy -= 32;//"a" - 32 = "A"
		}
		
		code += String.fromCharCode(dummy);
    }

	$("#codefeld").val(code);
	
console.log("Code: " + code + " = " + entschluesseln(code));

    return code;
}

//takes pass string, decodes it and returns stored scene and quiz step
function entschluesseln(code){
outputDebugInfo();
	
	var dummy, result = "";
	
	for (var i = 0; i < code.length; i++){
		
		dummy = code.charCodeAt(i);
		//convert every second letter to lower case if upper case
		if((dummy <= 90) || ((i % 2) != 0)){//90 = "Z"
			
			dummy += 32;
		}
		//rotate back if appropriate to stay within a-z range
		dummy = dummy <= 109 ? dummy + 26 : dummy;
		//shift back
		result += String.fromCharCode(dummy - 13);
    }
	//split scene number and quiz counter
	result = result.split("x");

	$(gNumberToNumeral).each(function(index, numeral) {
		//convert back to number
		if(result[0] === numeral){
			
			result[0] = index;
		}
		
		if(result[1] === numeral){
			
			result[1] = index;
		}
	});
	
	if((result.length == 2) && !isNaN(result[0]) && !isNaN(result[1])){
		//check whether decoding succeeded	
		return result;
	}else{
		//return first scene and quizstep otherwise
		return new Array(1, 0);
	}
}

function spiel_fortsetzen(){
outputDebugInfo();
	
	var code = prompt("Bitte Code eingeben!");	
	
	if(code != null && code !== ""){
		
		code = entschluesseln(code);
		
		gcurrent_scene_counter	= code[0];
		gCodegeneratorIndex = code[1];
		
		gcurrent_scene_id		= "Szene_" + gcurrent_scene_counter.toString();
		
		gLoadByCode = true;
		
		ladeBilder(true);
		ladeDialoge();
	}else{
		
		alert("Kein Code eingegeben!");
	}
}

function advanceSceneToLastSavestate(){

	//backup running speed
	var pixelProAufruf = gPixelProAufruf;
	//set walking speed to near infinity
	gPixelProAufruf = 1;
	
	var key;
	
	//step through the scene as the player would
	for(var i = 0; i < gCodegeneratorIndex; i++){
		
		key = gCodegeneratorArray[ gcurrent_scene_counter - 1 ][i];
		startEventHandling( gClickEventValueArray[ key ].key );
	}
	
	//restore this value
	gPixelProAufruf = pixelProAufruf;
	
	/*
		after sceneparser is done:
		
			set walking speed to infinite
			maybe hide scene
			
			for i=0 to gCodegeneratorIndex
				get key=gCodegeneratorArray[gcurrent_scene_counter][i] from gClickEventValueArray
				call clickEventHandler( corresponding value )
		
		this works for the steps without walking animation involved. settting gAktuellesZiel == 3 will propably fix it because there will be no walking going on then
	*/
	
	/*
	scene 1 steps:
		RVaFkRVAf
		RVaFkMjRV
		RVaFkQeRV
		RVaFkIVRe
		RVaFkShRaS
		RVaFkFRPUF
		RVaFkFVRORa
		RVaFkNPUg
		RVaFkARHa
		
		RVaFkMRUa
		
		RVaFkMjBRYS
		
		RVaFkFVROMRUa
	*/
}