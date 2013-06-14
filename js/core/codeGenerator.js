//codegenerator for saving and resuming the game

//takes current scene count and quiz count to compute pass string
function verschluesseln(){
outputDebugInfo();
	
    var dummy, helper, code = "", delimiter;
	
	//some random [a-z] character
	delimiter = Math.round( Math.random() * 25 ) + 97;
	delimiter = String.fromCharCode(delimiter);
	
	//convert from number to numeral and concatenate current scene and quiz counter
	//use previous scene_counter if loading of next scene is indicated by gUseDeprecated
	helper =
		gNumberToNumeral[gUseDeprecated ? gcurrent_scene_counter - 1 : gcurrent_scene_counter]
		+ delimiter +
		gNumberToNumeral[gCodegeneratorIndex];
	
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

	//make the delimiter upper case randomly
	if( Math.round( Math.random() ) == 0 ){
	
		delimiter = String.toUpperCase(delimiter);
	}
	
	//put the delimiter in front to be able to read it while decoding
	code = delimiter + code;
	
	$("#codefeld").val(code);
	
console.log("Code: " + code + " = " + entschluesseln(code));

    return code;
}

//takes pass string, decodes it and returns stored scene and quiz step
function entschluesseln(code){
outputDebugInfo();
	
	var dummy, result = "", delimiter;
	
	//split the first character which is the delimiter
	delimiter = String.toLowerCase( code.slice(0, 1) );
	//split the rest of the code from the delimiter
	code = code.slice(1);
	
	//decoding is beeing done
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
	
	//calculate delimiter position in result. this should be the character right in the middle,
	//so take half the length and round it down (floor) to make a good input for the zero-based slice operation
	//!! this just works if all values in gNumberToNumeral are of the same length !!
	var delimiterPos = Math.floor( result.length / 2 );
	
	//slice result at the given position and then take the first character which should be the delimiter itself
	//compare with the correct delimiter and return start of scene one if these are unequal
	if( result.slice( delimiterPos ).slice(0, 1) !== delimiter ){
		return new Array(1, 0);
	}
	
	//split scene number and quiz counter
	//result will look something like "nefnz" with "f" beeing the delimiter.
	//result.substring will return the part between the two given positions
	//so '0 to delimiterPos' will be "ne" and 'delimiterPos + 1 to result.length' will be "nz"
	result = new Array( result.substring(0, delimiterPos), result.substring(delimiterPos + 1, result.length) );

	$(gNumberToNumeral).each(function(index, numeral) {
		//convert back to number
		if(result[0] === numeral){
			//gcurrent_scene_counter
			//gUseDeprecated causes coding scene number 0 at the end of scene 1, take this into consideration here
			result[0] = index == 0 ? 1 : index;
		}
		
		if(result[1] === numeral){
			//gCodegeneratorIndex
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
	var localSceneCounter;
	
	//step through the scene as the player would
	for(var i = 0, j = 0; i < gCodegeneratorIndex; i++, j++){
		//gUseDeprecated indicates whether we should use the current or the previous scene index
		key = gCodegeneratorArray[ gcurrent_scene_counter - (gUseDeprecated ? 2 : 1) ][j];
		
		//remember scene number before progressing
		localSceneCounter = gcurrent_scene_counter;
		//progress eventually
		startEventHandling( gClickEventValueArray[ key ].key );
		
		if( localSceneCounter != gcurrent_scene_counter ){
			//the scene changed so we have to adjust the index variable
			//-1 because it will be incremented to 0 by the loop
			j = -1;
		}
	}
	
	//restore this value
	gPixelProAufruf = pixelProAufruf;
	
	/*
	scene 1 steps:
	eaRRAR
	zaRmAm
	qaRdAQ
	yaRlAi
	baROAS
	TaRgAf
	iaRVAV
	gaRTAN
	RaReAh - she awoke
	uaRhRa - click desk
	baRORR
	FaRSRm - click drawer
	RaReRQ
	NaRaRi
	oaRbRS - click cupboard
	TaRgRf
	EaRRRV
	jaRWRN
	CaRPRh - click bin
	..
	faRSMN
	xaRkMh
	NaRaQa
	uaRhQR
	MaRZQm
	JaRWQQ
	paRcQi
	laRYQS
	*/
}