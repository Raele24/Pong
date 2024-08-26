var myCanvas=document.querySelector("#myCanvas");    //variabile del canavas
var ctx = myCanvas.getContext("2d");                 //prendo il context
myCanvas.style.visibility =  "hidden";
//variabili per grafica
var starttext = document.getElementById("textstart");
var difficulty = document.getElementById("diff");


document.addEventListener("keydown", game, { once: true });      //qualsiasi tasto viene premuto inizia il gioco, e quando ciò accade la variabile di sistema once va a true permettendo l'inizio del codice sottostante

function game() {
//variabili per grafica
myCanvas.style.visibility =  "visible";
starttext.style.visibility =  "hidden";
difficulty.style.visibility =  "hidden";

// g = giocatore (manovriamo noi)
// a = avversario (bot)
var score_g=0;
var score_a=0;

//variabili per i suoni
var colpo = document.querySelector('#colpo');
var muro = document.querySelector('#muro');
var fine = document.querySelector('#fine');


var velX;                        //velocità sulla x
var velY;                        //velocità sulla y
var img = new Image();          
img.src = './img/pong.png';           //creo l'immagine della racchetta
var rete = new Image();
rete.src = './img/pong_game.png'      //creo l'immagine della rete
//misure
myCanvas.height = window.innerHeight / 1.3;          //setto le misure x del canvas
myCanvas.width = window.innerWidth / 1.3;            //setto le misure y del canvas
var ray = 12;                                   //raggio della pallina
var x,y;                      //posizioni del centro della pallina
var interval;                 //intervello della funzione update
//variabili movimento personaggio
var UP = false;
var DOWN =  false;
var UP2 = false;
var DOWN2 = false;
//variabili interno canvas
var pos_gY = myCanvas.height/2;                //posizione y del giocatore di sinistra da aggiornare
var pos_aY = myCanvas.height/2;                //posizione y del giocatore di destra da aggiornare
var height_g = myCanvas.height / 5.2;          //altezza delle racchette
var height_a = height_g;                    
var vel_a ;                            //ritardo che ha il bot nell'inseguire la pallina
//-------------------
setDiff();
function setDiff() {
    if(difficulty.value == "Normal") vel_a = 0.08;     
    if(difficulty.value == "Easy") vel_a = 0.06;
    if(difficulty.value == "Hard") vel_a = 0.1;
}
//------------------- il ritardo cambia in base alla difficoltà
var ball_speed = 12 ;                         //velocità fissa della pallina
var game_speed = 23;                          //velocità variabile del gioco
var g2 = false;                              //variabile di controllo se si sta giocando in solitaria o meno
var retry = false;                           //variaible di controllo se si è in fase di riprovare

ctx.beginPath();
ctx.font= "bold 40px PressStart2P";
ctx.fillStyle = "white";
ctx.textAlign = "center"
ctx.fillText("1 player", myCanvas.width/2, myCanvas.height/2-50);
ctx.fillText("2 players", myCanvas.width/2, myCanvas.height/2+50);
ctx.fill();
ctx.closePath();                                   //Disegno nel canvas i testi per la decisione di modalità


//-----------------------------
window.onresize = updateDimension;

function updateDimension () {
    myCanvas.height = window.innerHeight / 1.3;
    myCanvas.width = window.innerWidth / 1.3; 

    if( interval == null ) {
    ctx.beginPath();
    ctx.font= "bold 40px PressStart2P";
    ctx.fillStyle = "white";
    ctx.textAlign = "center"
    ctx.fillText("1 player", myCanvas.width/2, myCanvas.height/2-50);
    ctx.fillText("2 players", myCanvas.width/2, myCanvas.height/2+50);
    ctx.fill();
    ctx.closePath();   
    }
    if( retry ) {
        ctx.beginPath();
        ctx.font= "bold 40px PressStart2P";
        ctx.fillStyle = "white";
        ctx.textAlign = "center"
        ctx.fillText("Retry", myCanvas.width/2, myCanvas.height/2);
        ctx.fill();
    }

}                                                   
//----------------------------- ogni volta che la pagina cambia dimensione il canvas cambia di conseguenza




//---------------------------------
myCanvas.addEventListener('click',addEv );

function addEv (e) {
    if(!retry) 
    {
        if ( e.x > window.innerWidth/2-160 && e.x < window.innerWidth/2+160 && e.y > myCanvas.height/2 && e.y < myCanvas.height/2+70) 
        {
        loadGame(); 
        } 
        if ( e.x > window.innerWidth/2-180 && e.x < window.innerWidth/2+180 && e.y > myCanvas.height/2+70 && e.y < myCanvas.height/2+160) 
        {
        setg2(); 
        }
    }
    else
    {
        if ( e.x > window.innerWidth/2-130 && e.x < window.innerWidth/2+130 && e.y > myCanvas.height/2+40 && e.y < myCanvas.height/2+120) 
        {
        loadGame(); 
        }
    }
}
//-------------------------------se viene cliccata la posizione di "1 player" inizierà la modalità a un giocatore, caso opposto si inizierà in due
//se si è il fase di retry e viene premuto lo schermo sopra esso il gioco riparte




function random(min, max) {
    return Math.random() * (max - min + 1) + min;         //funzione ausiliari per generare un numero casuale tra un min e max
}

function setg2 () {
    g2 = true;                                //se si seleziona due giocatori il controllo viene messo a vero
    loadGame();                               
}

function loadGame(){ 
    myCanvas.removeEventListener("click",addEv);          //rimoso l'evento del click
    game_speed = 23;                                      //la velocità della pallina viene ripristinata dopo il il retry
    score_a = 0;                        //il punteggio di a viene ripristinato dopo il il retry
    score_g = 0;                       //il punteggio di g viene ripristinato dopo il il retry
    draw();                             //viene eseguito il primo disegno
    interval = setInterval(update,game_speed);    //inizia ad essere eseguita la funzione di update per la velocità del gioco

    //------------------------
    if( g2 ) {
    document.onkeydown = function(e) {
        if(e.keyCode == 87) UP = true;
        if(e.keyCode == 83) DOWN = true;
        if(e.keyCode == 38) UP2 = true;
        if(e.keyCode == 40) DOWN2 = true;
    }
    
    document.onkeyup = function(e) {
        if(e.keyCode == 87) UP = false;
        if(e.keyCode == 83) DOWN = false;
        if(e.keyCode == 38) UP2 = false;
        if(e.keyCode == 40) DOWN2 = false;
    }
    }
    //---------------------se ci sono due giocatori i tasti saranno WS a sinistra e ↑↓ per destra

    //----------------------
    if( !g2 ) {
        document.onkeydown = function(e) {
            if(e.keyCode == 38) UP = true;
            if(e.keyCode == 40) DOWN = true;
        }
        
        document.onkeyup = function(e) {
            if(e.keyCode == 38) UP = false;
            if(e.keyCode == 40) DOWN = false;
        }
    }
    //---------------se si è in solitaria ↑↓ saranno i tasti di movimento della racchetta a sinistra
}

function draw () {
    game_speed = 23;                    //ad ogni respawn della pallina la velocità viene diminuita
    ctx.beginPath(); 
    ctx.fillStyle="white";
    x=myCanvas.width/2;
    y=random( 0+ray, myCanvas.height-ray );
    velY=5
    if(random(0,2)>1) velX=10;                  //scelto casualmente se la pallina andrà verso destra o sinistra
    else velX=-10;
    ctx.arc(x,y,ray,0,Math.PI*2);               //respawn da una posizione casuale della rete
    ctx.font= "bold 40px PressStart2P";
    ctx.fillText(score_g, myCanvas.width/4, 40);
    ctx.fillText(score_a, myCanvas.width/2+myCanvas.width/4, 40);           //aggiorna i punteggi
    ctx.fill(); 
} //ridisegna la pallina


function update(){
    x+=velX;
    y+=velY;               //aggiorna le posizioni
    checkCollision();       //controlla se avviene una collisione
    if(x>=myCanvas.width+ray )      //se la pallina esce dal lato destro
    {
        draw();                     //ridisegnata la pallina
        score_g++;                  //+1 al punteggio di sinistra
        fine.play();                //viene emesso il suono della pallina che esce fuori
    }
    if(x<=-ray) {                  //se la pallina esce dal lato sinistro
        draw();                    //ridisegnata la pallina
        score_a++;                  //+1 al punteggio di destra
        fine.play();                //viene emesso il suono della pallina che esce fuori
    }
    if(y>=myCanvas.height-ray || y<=ray )         //se la pallina tocca i bordi alti
    {
        velY=-velY;                              //si inverte la sua velocità y
        muro.play();                              //viene emesso il suono di collisione con muro
    }
        if (!checkWin ())  {                      //fintanto che il gioco non è concluso
        updateGraphics();                         //viene aggiornata la grafica
        move();                                   //funzione per muovere le racchette 

        //-------------
        clearInterval(interval);                  
        interval = null;
        if ( interval == null ) {
            interval = setInterval(update,game_speed);  
        }
        //------------ gestione di aumento e rallentamento di velocità per evitare che cambino durante le fasi di gioco

    };
        
}

function checkCollision() {
    let collidePoint;
    let angleRad;
    let direction;
    if( x-ray<=40 && x-ray>=20 && y+ray>=pos_gY && y+ray<=pos_gY+height_g+20 ) {   //controlla la collisione con il lato destro del giocatore
        collidePoint = (y - (pos_gY + height_g/2));      //controlla dove la pallina colpisce il giocatore
        collidePoint = collidePoint / (height_g/2);     // normalizza il valore di collidePoint, dobbiamo ottenere numeri compresi tra -1 e 1, -player.height/2 < punto di collisione < player.height/2
        // quando la palla colpisce la parte superiore di un giocatore,  la palla prende un angolo di -45 gradi
        // quando la pallina colpisce il centro di un giocatore la pallina prende un angolo di 0 gradi
        // quando la pallina colpisce la parte inferiore di un giocatore, la pallina prende un angolo di 45 gradi
        // Math.PI/4 = 45 gradi
        angleRad = (Math.PI/4) * collidePoint;
        // cambia la velocità della pallina 
        direction = (x + ray < myCanvas.width/2) ? 1 : -1;   // ? : è come scrivere if...else
        velX = direction * ball_speed * Math.cos(angleRad);
        velY = ball_speed * Math.sin(angleRad);
        game_speed = 15;
        colpo.play();
    }     
    if( x+ray>=myCanvas.width-40 && y+ray>=pos_aY && y+ray<=pos_aY+height_a+20 ) {  //controlla la collisione con il lato sinistro dell'avversario
        collidePoint = (y - (pos_aY + height_a/2));     //controlla dove la pallina colpisce il giocatore
        collidePoint = collidePoint / (height_a/2);     // normalizza il valore di collidePoint, dobbiamo ottenere numeri compresi tra -1 e 1, -player.height/2 < punto di collisione < player.height/2
        // quando la palla colpisce la parte superiore di un giocatore,  la palla prende un angolo di -45 gradi
        // quando la pallina colpisce il centro di un giocatore la pallina prende un angolo di 0 gradi
        // quando la pallina colpisce la parte inferiore di un giocatore, la pallina prende un angolo di 45 gradi
        // Math.PI/4 = 45 gradi
        angleRad = (Math.PI/4) * collidePoint;    
        // cambia la velocità della pallina   
        direction = (x + ray < myCanvas.width/2) ? 1 : -1;    // ? : è come scrivere if...else
        velX = direction * ball_speed * Math.cos(angleRad);
        velY = ball_speed * Math.sin(angleRad);
        game_speed = 15;
        colpo.play();
    }    
    if( y+ray==pos_gY || y+ray==pos_aY || y+ray==pos_gY+height_g || y+ray==pos_aY+height_a) {velX =-velX; game_speed = 15; colpo.play();}    //controlla le collisioni con gli angoli e la parte superiore dei giocatori
    return false; 
}


function updateGraphics(){          //tutto viene ridisegnato

    ctx.clearRect(0,0,myCanvas.width,myCanvas.height);
    ctx.beginPath();
    ctx.fillStyle="white";
    ctx.arc(x,y,ray,0,Math.PI*2);
    ctx.font= "bold 30px PressStart2P";
    ctx.fillText(score_g, myCanvas.width/4, 40);
    ctx.fillText(score_a, myCanvas.width/2+myCanvas.width/4, 40);
    ctx.fill();
    ctx.drawImage(img,20,pos_gY, 20 ,height_g);
    if ( !g2 ) pos_aY += (y - (pos_aY+height_a/2)) * vel_a;      //se non si è in modalità 2 players il centro della racchetta comandata dal bot segue la pallina con un leggero ritardo
    ctx.drawImage(img,myCanvas.width-40,pos_aY, 20 , height_a);
    ctx.drawImage(rete,myCanvas.width/2,0, 20, myCanvas.height);
   
}                 


function move() {              //aumentano le posizioni alla pressione dei tasti
    if(UP) { 
		if(pos_gY>0) pos_gY -= 20;
	}
	if(DOWN) {
		if(pos_gY<myCanvas.height-100) pos_gY += 20;	  
    }        

    if( g2 ) {                  //solo se si è in modalità due giocatori
        if(UP2) { 
            if(pos_aY>0) pos_aY -= 20;
        }
        if(DOWN2) {
            if(pos_aY<myCanvas.height-100) pos_aY += 20;
    }
}

}


function checkWin () {
    if ( score_a >= 10 && score_g >= 10) {               //se si arriva in overtime
        if( score_g - score_a === 2) { clearInterval(interval);   ctx.clearRect(0,0,myCanvas.width,myCanvas.height);
            myCanvas.addEventListener('click',addEv );
            retry = true;
            ctx.beginPath();
            ctx.font= "bold 40px PressStart2P";
            ctx.fillStyle = "white";
            ctx.textAlign = "center"
            ctx.fillText("Retry", myCanvas.width/2, myCanvas.height/2);
            ctx.fillText("VITTORIA", myCanvas.width/4, 50);
            ctx.fillText("SCONFITTA", myCanvas.width/2+myCanvas.width/4, 50);
            ctx.fill();
          
            return true; }
        if( score_a - score_g === 2) { clearInterval(interval);  ctx.clearRect(0,0,myCanvas.width,myCanvas.height);
            myCanvas.addEventListener('click',addEv );
            retry = true;          
            ctx.beginPath();
            ctx.font= "bold 40px PressStart2P";
            ctx.fillStyle = "white";
            ctx.textAlign = "center"
            ctx.fillText("Retry", myCanvas.width/2, myCanvas.height/2);
            ctx.fillText("SCONFITTA", myCanvas.width/4, 50);
            ctx.fillText("VITTORIA", myCanvas.width/2+myCanvas.width/4, 50);
            ctx.fill();
            
            return true;}
    }
    else {                      //se uno dei due vince ai tempi regolamentari
    if ( score_g == 11 )   { clearInterval(interval);   ctx.clearRect(0,0,myCanvas.width,myCanvas.height); 
        myCanvas.addEventListener('click',addEv );
        retry = true;
        ctx.beginPath();
        ctx.font= "bold 40px PressStart2P";
        ctx.fillStyle = "white";
        ctx.textAlign = "center"
        ctx.fillText("Retry", myCanvas.width/2, myCanvas.height/2);
        ctx.fillText("VITTORIA", myCanvas.width/4, 50);
        ctx.fillText("SCONFITTA", myCanvas.width/2+myCanvas.width/4, 50);
        ctx.fill();
        
        return true;}
    if ( score_a == 11 )  { clearInterval(interval);   ctx.clearRect(0,0,myCanvas.width,myCanvas.height); 
        myCanvas.addEventListener('click',addEv );
        retry = true;
        ctx.beginPath();
        ctx.font= "bold 40px PressStart2P";
        ctx.fillStyle = "white";
        ctx.textAlign = "center"
        ctx.fillText("Retry", myCanvas.width/2, myCanvas.height/2);
        ctx.fillText("SCONFITTA", myCanvas.width/4, 50);
        ctx.fillText("VITTORIA", myCanvas.width/2+myCanvas.width/4, 50);
        ctx.fill();

        return true;}
    }
    //ritorna true così tutte le funzioni di aggiornamento grafica vengono fermate
}

}





 