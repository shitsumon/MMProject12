/*
loads all pictures from xml file when accessing the site
.get is given the xml path and return an XMLDocument object -> daten
determines type of returned object by "xml"
*/
function ladeBilder(force_load_common){
	
	force_load_common = force_load_common == null ? false : force_load_common;

	jQuery.get(gbilderXMLPfad,function(daten){
			verarbeiteBilderXML(daten, force_load_common);
    },"xml").fail(function(data){
			alert(data + " Fehler bilder.xml laden")
		});
}

//stores xml properties in global object gBilder
function verarbeiteBilderXML(daten, force_load_common){
	
	var id, animation;
	//get all picture elements corresponding to current scene
	var jquery_bilder = $(daten).find("bild[id*=szene"+ gcurrent_scene_counter +"]");
	//store element count
    gBilder.anzahl += jquery_bilder.length;
	
	//signal xml file has been loaded
	gpictureparser_xml_geladen = true;
	
	//compute pictures
	verarbeiteBilder(jquery_bilder);
	//load common files with first scene
	if((gcurrent_scene_counter == 1) || (force_load_common)){
		
		jquery_bilder = $(daten).find("bild[id*=allg_]");
		
		gBilder.anzahl += jquery_bilder.length;
		
		verarbeiteBilder(jquery_bilder);
	}
}

function verarbeiteBilder(bilder){

	var jquery_bilder = $(bilder);
	//for each picture
	jquery_bilder.each(function(index, bild) {
		//get picture id
		id = $(bild).attr("id");
		//create picture object from prototype
		gBilder[id] = new Bild(
								id,
								$(bild).attr("pfad"),/*picture path*/
								new Abmessungen(
									//picture dimensions
									parseInt($(bild).find("abmessungen").attr("height")),
									parseInt($(bild).find("abmessungen").attr("width"))
									),
								/*animated flag*/
								$(bild).attr("animiert") === "false" ? false : true
		);
		
		if(gBilder[id].animiert){
			//if picture is animated
			animation = $(bild).find("animation");
			
			gBilder[id].animationsmerkmale = new Animationsmerkmale(
				//create animation object from prototype
				parseFloat(animation.attr("fps")),
				parseInt(animation.attr("tile_anzahl")),	/*tile count*/
				parseInt(animation.attr("tile_width")),		/*tile width*/
				parseInt(animation.attr("tile_height"))		/*tile height*/
			)
		}
	});
}

//hook to display loading progess bar called by Image.onload in helper.js picture object
function aktualisiereLadebalken_Bilder(){
//	alert(gBilder.geladen+" von "+gBilder.anzahl+" geladen");
}

//hook to do something after loading finished
function statusPruefen_Bilder(){
	//compares loaded and to be loaded pictures
	if(gBilder.geladen == gBilder.anzahl){
//		alert("Alle Bilder geladen!");
	}
}
