//Prototyp/Klasse für die Position eines Bildes
function Position(x,y,z){
	this.x=x;
	this.y=y;
	this.z=z;
}

//Prototyp/Klasse für ein Bild
function Bild(name, pfad, position, daten){
	//Name des Bildes
	this.name=name;
	//Pfad zum Bild
	this.pfad=pfad;
	//Position-Objekt
	this.position=position;
	//base64-Repräsentation
	this.daten=daten;
}

//Prototyp/Klasse für eine Szene
function Szene(name, bilder, anzahl_bilder){
	//Name der Szene
	this.name=name;
	//assoziatives Array aus Bild-Objekten -> Objekt mit den Bildnamen als Eigenschaft (bilder[bild_name])
	this.bilder=bilder;
	this.anzahl_bilder=anzahl_bilder;
	//Namen der enthaltenen Bilder
	this.bilder_namen=new Array(anzahl_bilder);
}

//enthält alle Szenen-Objekte aus der XML-Datei
var szenen_global=new Array();
//Zähler zur Verfolgung des Ladevorgangs
var zu_ladende_bilder_global=0;
var geladene_bilder_global=0;
//Pfad zur XML-Datei
var xml_pfad_global="./../../Bilder/bilder.xml";
var bilder_stamm_ordner_global="./../../Bilder/";
var weiterleitung_global="./Szene1/Szene1.html";

//-------------------------------------------------------------------

//Eintrittsfunktion
function lokalerspeicher_initialisieren(xml_pfad, bilder_pfad){

	//ermöglicht es den Pfad zu überschreiben
	if(xml_pfad!=null){
		xml_pfad_global=xml_pfad;
	}
	
	if(bilder_pfad!=null){
		bilder_stamm_ordner_global=bilder_pfad;
	}

	//löscht den Speicher
	localStorage.clear();

	//beinhaltet später die Namen aller gespeicherten Szenen
	localStorage.setItem("gespeicherte_szenen", "");
	
	//liest Szenen und Bilder aus der XML-Datei aus
	lokalerspeicher_lesebilderausxml();
	
	//läd die Bilder und speichert alles
	lokalerspeicher_ladebilder();
	
	//Testfunktion
//	setTimeout("lokalerspeicher_get_bild('Hintergrund.jpg','Szene1')",5000);
}

function lokalerspeicher_lesebilderausxml(){
	//liest die pfade der zu ladenden bilder aus der xml datei	
	//xmlhttprequest muss auf der selben domain wie das skript ausgeführt werden, um xml-datei zu finden
	var httprequest = new XMLHttpRequest();
	httprequest.open("GET", xml_pfad_global, false);
	httprequest.setRequestHeader('Content-Type', 'text/xml');
	httprequest.send();
	
	//wenn anfrage erfolgreich war
	if (httprequest.readyState==4 && httprequest.status==200){
		//lese alle ordner-elemente aus -> ordner==szene
		//nur ein ordner-element pro szene !!
		var ordner_xml=httprequest.responseXML.getElementsByTagName("ordner");
		
		//initialisiert das globale Array mit x Elementen
		szenen_global=new Array(ordner_xml.length);
		
		//für alle Szenen
		for(var i=0; i<ordner_xml.length; i++){
			//erzeuge neues Szene-Objekt
			szenen_global[i]=new Szene(ordner_xml[i].getAttribute("name"), new Object(), ordner_xml[i].childElementCount);
			
			//für alle Bilder dieser Szene
			for(var j=0; j<ordner_xml[i].childElementCount; j++){
				
				//erzeuge neues Bild-Objekt
				var bild=new Bild(
				/*der name des Bilder*/
				ordner_xml[i].children[j].getAttribute("name"),
				/*der Pfad zum Bild: Stamm+Szenenname+Bildname*/
				bilder_stamm_ordner_global+ordner_xml[i].getAttribute("name")+"/"+ordner_xml[i].children[j].getAttribute("name"),
				/*die Startposition des Bildes als Position-Objekt*/
				new Position(
				ordner_xml[i].children[j].firstElementChild.getAttribute("x"),
				ordner_xml[i].children[j].firstElementChild.getAttribute("y"),
				ordner_xml[i].children[j].firstElementChild.getAttribute("z")),
				/*base64-Daten bleibt vorerst leer*/
				"");
				
				//speichere Bild im globalen Array
				szenen_global[i].bilder[bild.name]=bild;
				szenen_global[i].bilder_namen[j]=bild.name;
				//zähle die Anzahl der Bilder
				zu_ladende_bilder_global++;
			}
		}
	}else{
		alert("Bilder XML-Datei nicht geladen!");
	}
}

function lokalerspeicher_ladebilder(){
	//sorgt für das Laden aller Bilder
	for(var i=0; i<szenen_global.length; i++){
		for(var bild_name in szenen_global[i].bilder){
			lokalerspeicher_ladebild(i,bild_name);
		}
	}
}
function lokalerspeicher_ladebild(szene_nr, bild_name){
	/*läd ein Bild. Funktion muss extra aufgerufen werden, da die Übergabeparameter in der aufrufenden Funktion sonst beim Aufruf von bild.onload als call by reference statt call by value ausgewertet werden.*/
	
	//erzeugt ein neues Image-Objekt und legt die onload-Funktion fest
	var bild=new Image();
	bild.onload=function(){
		//speichere die base64-Repräsentation des Bildes im globalen Array
		szenen_global[szene_nr].bilder[bild_name].daten=lokalerspeicher_bild_zu_base64(this);
		
		//zähle die geladenenen Bilder mit
		geladene_bilder_global++;
		//sobald alle Bilder geladen wurden
		if(zu_ladende_bilder_global==geladene_bilder_global){
			//speichere im HTML5 localStorage
			lokalerspeicher_speichere();
		}else{
			lokalerspeicher_setze_ladebalken(geladene_bilder_global/zu_ladende_bilder_global);
		}
	}
	//starte den Ladevorgang des angegebenen Bildes
	bild.src=szenen_global[szene_nr].bilder[bild_name].pfad;
}

function lokalerspeicher_bild_zu_base64(bild){
	//erhält ein Image-Objekt und gibt es als canvas dataurl (prinzipiell base64) zurück
	//dazu wird ein unsichtbarer Canvas mit Platzhalter benötigt!
	
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
	
	return bild_url;
}

function lokalerspeicher_speichere(){
	//aufgerufen nachdem das letzte Bild geladen wurde
	//speichert die einzelnen Szenen als JSON-String im HTML5 localstorage
	//key=Szenenname, value=JSON-String des Szene-Objekts
	for(var i=0; i<szenen_global.length; i++){		
		localStorage.setItem(szenen_global[i].name,JSON.stringify(szenen_global[i]));
		//speichert zusätzlich die Namen aller Szenen
		localStorage.setItem("gespeicherte_szenen",localStorage.getItem("gespeicherte_szenen")+","+szenen_global[i].name);
	}
	
	//Weiterleitung
	document.location.href=weiterleitung_global;
}

function lokalerspeicher_get_szene(szene_name){
	//liest eine Szene aus dem localStorage
	var szene=localStorage.getItem(szene_name);
	
	if(szene!=null){
		//wandle JSON-String zurück
		szene=JSON.parse(szene);
	}else{
		alert("Szene '"+szene_name+"' nicht im Speicher gefunden!");
	}
	
	return szene;
}

function lokalerspeicher_get_bild(bild_name, szene_name){
	//liest ein Bild aus einer gegebenen Szene im localstorage
	var szene=lokalerspeicher_get_szene(szene_name);
	
	var bild;
	if(szene!=null){
		bild=szene.bilder[bild_name];
	}
	if(bild==null){
		alert("Bild '"+bild_name+"' nicht in Szene '"+szene_name+"' gefunden!");
	}
	
	return bild;
}

function lokalerspeicher_setze_ladebalken(prozent){
	//ändert die auslenkung des ladebalkens prozentual entsprechend den geladenen bildern
	var ladebalken=document.getElementById("ladebalken");
	
	ladebalken.setAttribute("width",ladebalken.parentNode.parentNode.clientWidth*prozent);
//	alert(prozent);
}