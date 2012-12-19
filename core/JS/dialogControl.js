//Globale Variable die alle Einstellungen für Dialoge Abspeichert

//gTalk - (soll keine schleichwerbung sein, sondern einfach nur kurz).
var gTalk			=new Object();
gTalk.bild_id 		="null";			//MUSS mit dialogSettings(...) initialisiert
gTalk.canvas_id		="null";			//MUSS mit dialogSettings(...) initialisiert
gTalk.font_color	="white";			//kann mit dialogSettings(...) verändert werden
gTalk.font_style	="bold 16px Arial"; //kann mit dialogSettings(...) verändert werden
gTalk.lineletters   =40;				//kann mit dialogSettings(...) verändert werden
gTalk.line_distance =15;				//kann mit dialogSettings(...) verändert werden
gTalk.dialog_id		="null";
gTalk.SatzGerade	=0;			
gTalk.SatzMax		=0;

//Initiert Dialog. Dialogauswahl nach ID (string)
function dialogStart(dialog_id)
{

//wähle Dialog aus

var Dialog=gDialoge[dialog_id];
var Laenge=(Dialog.saetze).length;

gTalk.SatzGerade	=0;
gTalk.SatzMax		=Laenge;
gTalk.dialog_id		=dialog_id;

dialog_zeichneDialog();

}

//muss einmal aufgerufen werden
//Einstellungen für alle späteren DialogAufrufe
//Sollte Vielleicht in helper.js verschoben werden?

function dialogSettings(bild_id,canvas_id,font_color,font_style,lineletters,line_distance)
{
gTalk.bild_id		=bild_id;			//Hintergrundbild
gTalk.canvas_id		=canvas_id;			//CSS-Objekt-Name
gTalk.font_color	=font_color;		//Schriftfarbe
gTalk.font_style	=font_style;		//Schriftart (format: "flags size type"). z.B: "bold 16px Arial");
gTalk.lineletters	=lineletters		//Zahl der Buchstaben bis Zeilenumbruch
gTalk.line_distance	=line_distance		//Zeilenabstand
}

function dialog_zeichneDialog()
{
	//Greife auf Dialogdaten zu

	var Dialog=gDialoge[gTalk.dialog_id];
	var Satz=Dialog.saetze[gTalk.SatzGerade];
	var Text=Satz.inhalt;
	
	//Prinzip von pictureAnimation.js übernommen.
	
	var canvas=$("#"+gTalk.canvas_id)[0];	
	var ctx=canvas.getContext("2d");
	
	//Leere Inahlt des Bereiches (löscht alten text etc)
	
	ctx.clearRect ( 0, 0, canvas.width, canvas.height);

	//Zeichne die Textbox
	
	ctx.drawImage(gBilder[gTalk.bild_id].bild,0,0);
	
	//Zeichne Protagonistenbild ein
	
	//TODO: Fix scaling bug bug!
	
	ctx.drawImage(gBilder[Satz.bild_id].bild,10,20,50,110);
	
	//Initiere Einstellungen für Text
	
	ctx.fillStyle = gTalk.font_color;
	ctx.font = 		gTalk.font_style;
	
	//Breche Text in Zeilen
	
	var text=dialog_SatzZeilenBruch(Satz.inhalt);
	
	//Fülle Box mit Text Zeilenweise aus
	
	for (var i=0; i<text.length; i++)
	{
	ctx.fillText(text[i], 75, 35+gTalk.line_distance*i);
	};
	
	//Inkrementiere Satzcounter
	
	gTalk.SatzGerade=gTalk.SatzGerade+1;
	
	//Erstelle einen Mouse-onClickListener für übergang zum nächstem Satz
	//Zerstöre danach eigenes Binding
	//Falls letzter Satz erreicht wurde, erstelle kein Binding und lösche Dialogbox (Dialogende)
	
	canvas.addEventListener('click', function() 
		{ 
			//überprüfe ob Dialogende erreicht wurde
			if(gTalk.SatzGerade<gTalk.SatzMax)
				{
				dialog_zeichneDialog(); 	//rekursiver Aufruf
				}
			else
				{
				ctx.clearRect ( 0, 0, canvas.width, canvas.height);
				}
		this.removeEventListener('click',arguments.callee,false); 
		}, false);
}

//Diese Funktion bricht längere Text in Zeilen auf
//Die Maximiale Zeilenlänge wird in gTalk.lineletters definiert

function dialog_SatzZeilenBruch(text)
{
var subtext="";
var result=new Array();
var search=0;

if (text.length>gTalk.lineletters)
	{
		while(text.length>gTalk.lineletters)			//falls text zu lange...
		{
		subtext=	text.substr(0,gTalk.lineletters);	//nimm maximale-länge string
		search=		subtext.lastIndexOf(" ")+1;			//suche nach letztem Space
		result.push (text.substr(0,search));			//speichere String als Zeile
		text=		text.substr(search,text.length);	//mach das so lange weiter bis alles rein passt
		}
		if (text.length>0){result.push(text)};			//füge rest ran
        return result;
	}
	else result.push(text);								//falls text kurz genug ist, mache nichts
	
return result;
}