function bewegePerson(){
		
	//Get objects of target and hero picture
    var hero	= $("canvas[id*=canvas_person]");
    var target	= $("#"+gTargetIdentifier);
	
	//x, y, z-Koordinaten der Zentren
	var heroPos		= new Array(3);
	var targetPos	= new Array(3);

	//Koordinaten erfassen
	heroPos[2]		= z2mult(parseInt(hero.css("z-index")));
	targetPos[2]	= z2mult(parseInt(target.css("z-index")));
	
	if(!gWegBerechnet){		
		//speichert die Abmessungen vor der Skalierung
		gStartAbmessungen[0] = hero.width();
		gStartAbmessungen[1] = hero.height();
		
		if(heroPos[2] <= targetPos[2]){
			//vergrößern		
			//hier muss der Canvas zu Beginn vergrößert werden damit das Bild nicht abgeschnitten wird
			skaliereHeld( targetPos[2] / heroPos[2], hero);
		}
		
		/*zeichnet die punkte des zentralpfades*/
		var hg=$("canvas[id*=canvas_bg_static]")[0].getContext("2d");
		hg.fillStyle = "rgb(255, 0, 0)";
		$.each(gWegPos,function(index, value){
			hg.fillRect( value[0], value[1], 10, 10 );
		});
		/**/
	}
	
	//berücksichtige den Zoomfaktor bei der Berechnung der Position, sodass die Figur nachher mittig auf dem Ziel landet
	heroPos[0] = hero.offset().left + (gStartAbmessungen[0] / 2.0);
	heroPos[1] = hero.offset().top + (gStartAbmessungen[1] / 2.0);
	
	targetPos[0] = target.offset().left + (target.width() / 2.0);
	targetPos[1] = target.offset().top + (target.height() / 2.0);
	
	//berechne die Bewegungsvektoren
	if(!gWegBerechnet){
		
		var wegindex = new Array(2);
		
		/*
			gWegPos als prozentuale Angabe und hier umrechnen!
		*/
		
		$.each(gWegPos, function(index, value){
			if(heroPos[2] == value[2]){
				//Zielposition - Startposition = Richtungsvektor
				//Richtungsvektor / Pixel pro Sekunde = Pixel pro Schritt
				gMoveVec[0][0] = (gWegPos[index][0] - heroPos[0]) / gPixelProAufruf;
				gMoveVec[0][1] = (gWegPos[index][1] - heroPos[1]) / gPixelProAufruf;
				gMoveVec[0][2] = heroPos[2];
				
				//erstes Laufziel, zum Zentralpfad
				gTargets[0][0] = gWegPos[index][0];
				gTargets[0][1] = gWegPos[index][1];
				
				wegindex[0] = index;
			}
			
			if(targetPos[2] == value[2]){
				gMoveVec[2][0] = (targetPos[0] - gWegPos[index][0]) / gPixelProAufruf;
				gMoveVec[2][1] = (targetPos[1] - gWegPos[index][1]) / gPixelProAufruf;
				gMoveVec[2][2] = targetPos[2];
				
				//zweites Laufziel, am Ende des Zentralpfades
				gTargets[1][0] = gWegPos[index][0];
				gTargets[1][1] = gWegPos[index][1];
				
				wegindex[1] = index;
			}
		});
		
		var zoomFaktor = targetPos[2] / heroPos[2];
		
		gMoveVec[1][0] = ((gWegPos[wegindex[1]][0] - (gStartAbmessungen[0] * zoomFaktor / 2.0))
			- (gWegPos[wegindex[0]][0] - (gStartAbmessungen[0] / 2.0))) / gPixelProAufruf;
		gMoveVec[1][1] = ((gWegPos[wegindex[1]][1] - (gStartAbmessungen[0] * zoomFaktor / 2.0))
			- (gWegPos[wegindex[0]][1] - (gStartAbmessungen[0] / 2.0))) / gPixelProAufruf;
		//berechne Schrittweite zwischen Start- und Zielabmessungen abhängig vom Z-Index
		//aktuelle Abmessungen / Startmultiplikator = reale Abmessungen * Zielmultiplikator = Zielabmessungen
		gMoveVec[1][2] = ( ((gStartAbmessungen[0] * gMoveVec[2][2] / gMoveVec[0][2])) - gStartAbmessungen[0]) / gPixelProAufruf;
		gMoveVec[1][3] = ( ((gStartAbmessungen[1] * gMoveVec[2][2] / gMoveVec[0][2])) - gStartAbmessungen[1]) / gPixelProAufruf;
		
		//drittes Laufziel, das eigentliche Ziel
		gTargets[2][0] = targetPos[0];
		gTargets[2][1] = targetPos[1];
		
		gWegBerechnet = true;
	}
	
	//bewege die Figur
	if(!zielErreicht(heroPos, gTargets[gAktuellesZiel])){
		
		//falls das Ziel noch nicht erreicht wurde, nutze den Bewegungsvektor
		hero.offset({
			left:	hero.offset().left	+ gMoveVec[gAktuellesZiel][0],
			top:	hero.offset().top	+ gMoveVec[gAktuellesZiel][1]
			});

		//skaliere
		if(gAktuellesZiel == 1){
		
			//gMoveVec[1][2] >=0 -> vergrößern, sonst verkleinern
			var skalierungsFaktor = new Array(
				(gStartAbmessungen[0] + gMoveVec[1][2]) / gStartAbmessungen[0],
				(gStartAbmessungen[1] + gMoveVec[1][3]) / gStartAbmessungen[1]
				);
			
			hero[0].getContext("2d").scale(skalierungsFaktor[0], skalierungsFaktor[1]);
			
			gStartAbmessungen[0] += gMoveVec[1][2];
			gStartAbmessungen[1] += gMoveVec[1][3];
		}		
	}else{
		
		//sobald wir in Reichweite des Ziels sind, setze den Helden genau auf dessen Koordinaten
		hero.offset({
			left:	gTargets[gAktuellesZiel][0] - (gStartAbmessungen[0] / 2.0),
			top:	gTargets[gAktuellesZiel][1] - (gStartAbmessungen[1] / 2.0)
			});

		//steuere das nächste Ziel an
		gAktuellesZiel++;
	}
	
	if(gAktuellesZiel < 3){
		//es können maximal drei Ziele sein, Held -> Wegpunkt 1 -> Wegpkt 2 -> Ziel
		setTimeout(function(){ bewegePerson() }, gIntervall);
	}else{
		
		hero.css("z-index", target.css("z-index"));
		
		if(heroPos[2] > targetPos[2]){
			//verkleinern		
			//hier muss der Canvas am Ende verkleinert werden damit das Bild ihn ausfüllt
			skaliereHeld(targetPos[2] / heroPos[2], hero);
		}
		
		//alles zurücksetzen
		gAktuellesZiel		= 0;
		heroPos				= new Array(3);
		targetPos			= new Array(3);
		gStartAbmessungen	= new Array(2);
		gMoveVec			= new Array(new Array(3), new Array(4), new Array(3));
		gWegBerechnet		= false;
	}
}

function zielErreicht(heroPos, targetPos){
	//berechnet den Abstand zum Ziel mithilfe des Vektorbetrags und vergleicht ihn mit dem Betrag des nächsten Schrittes
	var abstand, betrag;
	
	abstand	= Math.sqrt(Math.pow((heroPos[0] - targetPos[0]), 2) + Math.pow((heroPos[1] - targetPos[1]), 2));
	betrag	= Math.sqrt(Math.pow(gMoveVec[gAktuellesZiel][0], 2) + Math.pow(gMoveVec[gAktuellesZiel][1], 2));
	
	//das Ziel ist erreicht, wenn wir uns in seiner Umgebung befinden oder der Betrag des Bewegungsvektors gleich 0 ist
	if((abstand <= (betrag * 2)) || betrag == 0){
		
		return true;
	}else{
		
		return false;
	}
}

function skaliereHeld(faktor, canvas){
	
	canvas		= $(canvas);
	var context	= canvas[0].getContext("2d");
	var inhalt	= context.getImageData(0, 0, Math.round(gStartAbmessungen[0]), Math.round(gStartAbmessungen[1]));
	
	canvas[0].width	*= faktor;
	canvas[0].height*= faktor;
	
	context.putImageData(inhalt, 0, 0);
}