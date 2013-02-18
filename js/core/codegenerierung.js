// Codegenerierung um zu einem späteren Zeitpunkt das Spiel am Anfang einer Szene wiederaufnehmen zu können

function verschluesseln(szene, protagonist)
 {
    var code = "";
	var helper = scene.concat(protagonist); //Zusammenfügen von Szenennummer und Name des Protagonisten(Spielers)
	
    for (i=0; i<helper.length;i++)
	 {
        var a = helper.charCodeAt(i);
        var b = a ^ 123;    // bitwise XOR with any number, e.g. 123
        code = String.fromCharCode(b) + code;
    }
	alert(code);
    return code;
}

//Zurückgeben der Szenennummer aus einem gegebenen Level-Code 
function entschluesseln_szene(code)
  {
	var szene = "-1";
	var a = code.charAt(code.length-1);
	var szene = a ^ 123;
	alert(szene);
	return szene;
  }

  
//Zurückgeben des Protagonistennames aus einem gegebenen Level-Code 
function entschluesseln_name(code)
  {
	  var protagonist = "-1";
	  var helper = code;
	 	 
      for (i=0; i<helper.length-1;i++)
	 	{
			var a = helper.charCodeAt(i);
			var b = a ^ 123;    // bitwise XOR with any number, e.g. 123
			protagonist = String.fromCharCode(b) + protagonist;
    }
	alert(protagonist);
    return protagonist;
  }