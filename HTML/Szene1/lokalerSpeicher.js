function lokalerspeicher_start(){

	//löscht den speicher
	localStorage.clear();

	lokalerspeicher_ladebilder(lokalerspeicher_lesebilderausxml());
	
	setTimeout("alert(localStorage.length+\" Elemente in localStorage gespeichert\")",5000);
}

function lokalerspeicher_lesebilderausxml(){
	//liest die pfade der zu ladenden bilder aus der xml datei
	var xmlpfad="./../../Bilder/bilder.xml";
	
	//xmlhttprequest muss auf der selben domain wie das skript ausgeführt werden, um xml-datei zu finden
	var httprequest = new XMLHttpRequest();
	httprequest.open("GET", xmlpfad, false);
	httprequest.setRequestHeader('Content-Type', 'text/xml');
	httprequest.send();
	
	//wenn anfrage erfolgreich war
	if (httprequest.readyState==4 && httprequest.status==200){
		//lese alle bild-elemente aus
		var bilder_xml=httprequest.responseXML.getElementsByTagName("bild");
		var bilder=new Array(bilder_xml.length);
		
		//lese die pfade aus und speichere sie im array
		for(var i=0; i<bilder_xml.length; i++){
			bilder[i]="./../../Bilder/"+bilder_xml[i].parentNode.getAttribute("name")+"/"+bilder_xml[i].getAttribute("name");
		}
	}else{
		alert("bilder xml-datei nicht geladen");
	}
	
	return bilder;
}

function lokalerspeicher_ladebilder(bilder){
	//erhält ein array aus pfadangaben zu den bildern
	for(var i=0; i<bilder.length; i++){
		var bild=new Image();
		bild.onload=function(){
			lokalerspeicher_speicherebild(this);
		}
		bild.src=bilder[i];
	}
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
	
	var org_bild=new Image();
	org_bild.onload=function(){
		context.drawImage(this,0,0);
		};
	org_bild.src=original;
	//schreibe in localstorage
	lokalerspeicher_speichere(bild.src,bild_url);
}

function lokalerspeicher_speichere(key, value){
//	alert("key: "+key+" value: "+value);
	localStorage.setItem(key,value);
//	alert(localStorage.getItem(key));
}