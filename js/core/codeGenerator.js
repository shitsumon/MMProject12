//codegenerator for saving and resuming the game

//takes current scene count and quiz count to compute pass string
function verschluesseln(){
	
    var dummy, helper, code = "";
	//convert from number to numeral and concatenate current scene and quiz counter
	helper = n2n[gcurrent_scene_counter] + "x" + n2n[gCurrentQuizstep]
	
    for (var i = 0; i < helper.length; i++){
		//get charcode corresponding to ascii and shift by 13
		dummy = helper.charCodeAt(i) + 13; //ROT13 ;)
		//check whether we exceed a-z range and rotate instead of just shift if appropriate
		dummy = dummy > 122 ? dummy - 26 : dummy;
		//everything smaller than about half of range a-z stays if i is even
		if((dummy > 109) || ((i % 2) != 0)){
			//everything else is converted to upper case
			dummy -= 32;
		}
		
		code += String.fromCharCode(dummy);
    }

    return code;
}

//takes pass string, decodes it and returns stored scene and quiz count
function entschluesseln(code){
	
	var dummy, result = "";
	
	for (var i = 0; i < code.length; i++){
		
		dummy = code.charCodeAt(i);
		//convert every second letter to lower case if upper case
		if((dummy <= 90) || ((i % 2) != 0)){
			
			dummy += 32;
		}
		//rotate back if appropriate to stay within a-z range
		dummy = dummy <= 109 ? dummy + 26 : dummy;
		//shift back
		result += String.fromCharCode(dummy - 13);
    }
	
	result = result.split("x");
	
	$(n2n).each(function(index, numeral) {
        
		if(result[0] === numeral){
			
			result[0] = index;
		}
		
		if(result[1] === numeral){
			
			result[1] = index;
		}
    });
	
	return result;
}