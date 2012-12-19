//Initiert Dialog. Dialogauswahl nach ID (string)

/*
- unbedingt an den entscheidenden stellen prüfen, ob die entsprechenden objekte vorhanden sind
- gTalk als aktuellen dialog vielleicht übergeben statt global zu speichern
- positionierung des dialogfensters
- text sollte antialiasing oÄ erhalten
*/
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
	
	gTalk.SatzGerade++;
	
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
		
		if (text.length>0)
		{
			result.push(text)
		}//füge rest ran
		
		return result;
	}
	else
	{
		result.push(text);								//falls text kurz genug ist, mache nichts
	}
		
	return result;
}