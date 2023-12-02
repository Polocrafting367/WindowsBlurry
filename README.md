<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Bureau de Windows 7</title>
    
    <!-- Ajout du css -->
    <link id="styleSheet" rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Polocrafting367/WindowsBlurry-1/BIOS.css">

    <!-- Ajout de la bibliothèque d'icônes -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  </head>
  


  <body>
<div class="bios" id="bios">Choisisez votre themes</div>

<div class="bts" id="bts" >
<button class="dual" onclick="changerFichierCSS367()">Démarrage en mode Windows367</button>
<button class="dual" onclick="changerFichierCSSXP()">Démarrage en mode WindowsXP</button>
<button class="dual" onclick="phone()">Démarrage en mode Téléphone</button>
<!-- Le reste de votre contenu -->
</div>

<script>
    function changerFichierCSS367() {
        var styleSheet = document.getElementById("styleSheet");
        styleSheet.href = "https://cdn.jsdelivr.net/gh/Polocrafting367/WindowsBlurry-1/WB367.css"; // Remplacez "NouveauFichier.css" par le nom de votre nouveau fichier CSS
                var bouton = document.getElementById("download");
        bios.style.display = "none";
        bts.style.display = "none";
    }
        function changerFichierCSSXP() {
        var styleSheet = document.getElementById("styleSheet");
        styleSheet.href = "https://cdn.jsdelivr.net/gh/Polocrafting367/WindowsBlurry-1/WXP.css"; // Remplacez "NouveauFichier.css" par le nom de votre nouveau fichier CSS
                var bouton = document.getElementById("download");
        bios.style.display = "none";
        bts.style.display = "none";
    }

    function phone(){
        off.style.display = "none";
        offIsVisible = false;
        slidingDiv.style.display = "none";
        rectangle.style.display = "block";
        rectangleIsVisible = false;
                ba.style.display = "none";
        B1IsVisible = false;
                        bb.style.display = "none";
        B2IsVisible = false;
        var styleSheet = document.getElementById("styleSheet");

        styleSheet.href = "https://cdn.jsdelivr.net/gh/Polocrafting367/WindowsBlurry-1/WP.css"; // Remplacez "NouveauFichier.css" par le nom de votre nouveau fichier CSS
        bts.style.display = "none";
        bios.style.display = "none";
        var bouton = document.getElementById("download");
}

</script>

<div id="slidingDiv"class="ombre">  
  <span id="heure2"></span>
    <span id="date2"></span>
<div class="info" id="info">Crée par polocrafting aidé par des IA tels que ChatGPT ou BingChat.
<br><br>Les image ébergé par https://www.zupimages.net/ peuvent parfoir être caprisieuse à chargé mais rien de bien grave.
<br><br>La page est toujours en développement, donc soyez compréhensif si vous rencontré un bug, bonne naviguation :) 
<br><br>V:310523-6</div>



<img src="https://www.svgrepo.com/download/175749/double-up-arrow.svg" class="image-animation" style="filter: invert(100%);" draggable="false" alt="Votre image">

  </div>


    <!-- Ajouter la bibliothèque d'icônes -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">


        </head><div class="rectangle" id="rectangle" style="display: none;">

<button id="Donwload" class="button" onclick="window.open('https://github.com/Polocrafting367/WindowsBlurry-1/releases/download/WindowsBlurry/A.telecharger.Windows.Blurry.dev.html')"><img src="https://icon-icons.com/icons2/692/PNG/512/seo-social-web-network-internet_12_icon-icons.com_61498.png" width="15" height="15">&nbsp;&nbsp;Télécharger le code HTML?</button>

<button id="guitt" class="button" onclick="window.open('https://github.com/Polocrafting367/WindowsBlurry-1')"><img src="https://seeklogo.com/images/G/github-logo-7880D80B8D-seeklogo.com.png" width="15" height="15">&nbsp;&nbsp;github</button>

      <button id="start-btn" class="button"><img src="https://zupimages.net/up/23/21/vmcp.png" width="15" height="15">&nbsp;&nbsp;Démarrer</button>

 <span id="heure"></span>
    <span id="date"></span>



    </div>

<div class="yout" id="yout" style="display: none;">
  <div class="yout-header">
    <div id="titrefn">Visioneur Youtube (BETA)</div>
  </div>

  <div class="close" onclick="closeYout()">
    <div class="line"></div>
    <div class="line"></div>
  </div>

  <div class="yout-content">


<form>
  <input type="text" placeholder="Rechercher" id="query">
  <button type="submit">Rechercher</button>
</form>
<div id="resultat"></div>


<script>
  const form = document.querySelector('form');
  const input = document.querySelector('#query');
  const resultatDiv = document.querySelector('#resultat');
  const videoIframe = document.querySelector('#video');

  form.addEventListener('submit', event => {
    event.preventDefault();
    const query = input.value;
    // Effectuez une recherche YouTube avec la requête et mettez à jour l'URL de l'iframe avec le premier résultat
    var videoUrl = `${query}`;
    videoUrl = videoUrl.replace("watch?v=", "embed/");

    // Mettre à jour l'attribut "src" de l'iframe existante avec le nouvel URL
    videoIframe.setAttribute('src', videoUrl);

    // Afficher l'iframe dans la div "resultat"
    resultatDiv.appendChild(videoIframe);
  });

  const button = document.querySelector('button');

</script>




    </div>
  </div>
</div>


<div class="window" id="window1" style="display: none;">
  <div class="window-header"><div id="titrefn">Bloc Note</div></div>

      <div class="close" onclick="close()">
    <div class="line"></div>
    <div class="line"></div>
  </div>
  <div class="window-content">


 <iframe src="https://notepad-online.com/fr/" id="note" style="width: 99.5%; height: 99.5%;" style="overflow: hidden;"></iframe>



  </div>
</div>
<div class="bggene" id="window5" style="display: none;">
  <div class="bggene-top"><div id="titrefn">Générateur de fond d'écran</div></div>

      <div class="close" onclick="closeBG()">
    <div class="line"></div>
    <div class="line"></div>
  </div>
  <div class="bggene-content">
<button id="generate-btn" >Générer le fond (ça peut être long avec un grand écran)<br><br>La résolution de l’image dépend de la taille de la page actuelle et de son zoom<br>
Pour retiré la barre de navigation, téléchargez la page html (voir la barre des tâches)<br>
Actualisez la page pour d’autres couleurs/motifs</button>
   <button id="saveim" style="display: none;">Enregistrer l'image en local sur la machine (Actualiser la page (f5 ou ↻ pour actualiser))</button>

   <div id="image-container"></div>

<div class="loading-bar-container" id="charge">
  <div>  <img src="https://media.flixcar.com/delivery/static/inpage/9/images/loading.gif" alt="GIF animé" width="100%" height="100%"></div>
  <div id="textt">Création de l'image en cours ...</div>
</div>


  </div>  

  </div>

  </div>
  <div class="windowsett" id="window4" style="display: none;">
  <div class="windowsett-top"><div id="titrefn">Personnaliser</div></div>

      <div class="close" onclick="closesett()">
    <div class="line"></div>
    <div class="line"></div>
  </div>
  <div class="windowsett-content">
<div id="opp" class="opp">
  Changer l'opacité : &nbsp;
  <input type="range" min="0" max="1" step="0.01" value="0.1" id="opacity-slider" onchange="changeTransparency()" />
</div>

  <div id="blurr" class="blurr">


Flou  des fenêtres :  &nbsp;
<input type="range" min="0" max="50" value="10" id="blur-slider" oninput="changeBlur(this.value)">
</div>
<button id="changer-arriere-plan">Changer l'arrière-plan</button>

  <button class="button-color" id="button-color" onclick="changeColor()">Changer la couleur</button>
<button class="dark" id="dark" onclick="changeDarkMode()">Dark Mode</button>
<button class="light" id="light" onclick="changeLightMode()">Light Mode</button>
  </div>
  </div>

<div class="window2" id="window3" style="display: none;">
  <div class="window2-header"><div id="titrefn">Calculatrice</div></div>

      <div class="close" onclick="close()">
    <div class="line"></div>
    <div class="line"></div>
  </div>

  <div class="window2-content">

 <iframe src="https://www.desmos.com/fourfunction?lang=fr" id="calc" style="width: 99%; height: 99.5%;" style="overflow: hidden;"></iframe>
</div>

</div>

</div>



  


    <br>

  



<div id="menu" class="menu" style="display: none;">
  <div class="top-bar">
    <input type="text" placeholder="Chercher un élément ici">
  </div>

  


  <div class="bottom-bar">
    <div class="profil">
    <img src="https://yt3.ggpht.com/1Kmoh17x3yENxM4Xv0LSayWwIxdmqPn6eiRCwvV1DOvgrECifBI5twBpKoaWtETOaAt7uNqo=s176-c-k-c0x00ffffff-no-rj-mo" alt="Image de profil"> 

  </div>

    <div class="status-icon">
     <button id="POWERbu" onclick="Power()"><img id="POWER" src="https://zupimages.net/up/23/09/7351.png" alt="Image de profil" ></button>
     
    </div>


  </div>

  <button class="par" id="par" onclick="asett()">Personnaliser</button>



  <button class="newwind" id="newwind" onclick="NewWIN()">Bloc Note</button>

<button class="newwind2" id="newwind2" onclick="NewWIN2()">Calculatrice</button>
<button class="newwind3" id="newwind3" onclick="aBG()">Générateur de fond d'écran</button>
<button class="newwind4" id="newwind4" onclick="NewWIN3()">Visioneur Youtube (BETA)</button>

</div>

    <img id="off" class="fullscreen-image" draggable="false" src="https://cdn.dribbble.com/users/580/screenshots/2367300/spinkit3.gif" alt="Image en plein écran" >


<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.js"> </script>
<script>




var slidingDiv = document.getElementById("slidingDiv");
var initialY = null;
var offsetY = 0;

// Gérer l'événement de clic de souris lorsqu'il commence
slidingDiv.addEventListener("mousedown", function(event) {
  initialY = event.clientY;
  slidingDiv.style.cursor = "grabbing";
});

// Gérer l'événement de déplacement de souris pendant le clic
window.addEventListener("mousemove", function(event) {
  if (initialY !== null) {
    offsetY = event.clientY - initialY;
    slidingDiv.style.top = offsetY + "px";

    // Calculer la hauteur minimale de l'écran à 80%
    var minHeight = -(window.innerHeight * 0.8);

    // Vérifier si la hauteur de la div atteint ou dépasse la hauteur minimale
    if (offsetY <= minHeight) {
      slidingDiv.style.display = "none"; // Cacher la div

        function desabl() {
        off.style.display = "none";
        offIsVisible = false;
}

setTimeout(desabl, 1000);

        function men() {
          rectangle.style.display = "block";
    rectangleIsVisible = true;
}

setTimeout(men, 2000);

    } 
  }
});

// Gérer l'événement de relâchement de souris
window.addEventListener("mouseup", function(event) {
  if (initialY !== null) {
    slidingDiv.style.cursor = "grab";
    initialY = null;
    offsetY = 0;

    // Récupérer la position initiale de la div
    var initialTop = 0;

    // Vérifier si la div n'a pas disparu et la ramener à la position initiale
    if (slidingDiv.style.display !== "none") {
      slidingDiv.style.top = initialTop + "px";
    }
       if (slidingDiv.style.display !== "block") {
      slidingDiv.style.top = initialTop + "px";
    }
  }
});




function Power(){
    rectangle.style.display = "none";
    rectangleimIsVisible = false;
  menu.style.display = "none";
    menuIsVisible = false;


function black() {
    var image = document.getElementById("off");
  image.src ="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACoCAMAAABt9SM9AAAAA1BMVEUAAACnej3aAAAAR0lEQVR4nO3BAQEAAACCIP+vbkhAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAO8GxYgAAb0jQ/cAAAAASUVORK5CYII=";
  off.style.display = "block";
   offIsVisible = true;}

setTimeout(black, 1000);


function changerImage() {
  var image = document.getElementById("off");
  image.src ="https://cdn.dribbble.com/users/3656783/screenshots/6713099/restrarting-window_02.gif";
}

setTimeout(changerImage, 1500);

function restart() {

  var image = document.getElementById("off");
  image.src ="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACoCAMAAABt9SM9AAAAA1BMVEUAAACnej3aAAAAR0lEQVR4nO3BAQEAAACCIP+vbkhAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAO8GxYgAAb0jQ/cAAAAASUVORK5CYII=";
}

setTimeout(restart, 4000);

function glow() {
  var image = document.getElementById("off");
  image.src ="https://cdn.dribbble.com/users/580/screenshots/2367300/spinkit3.gif";
  slidingDiv.style.display = "block";

// Sélectionner tous les éléments qui ont la classe window
var windows = document.querySelectorAll(".window");
var windows2 = document.querySelectorAll(".window2");
var windowssett = document.querySelectorAll(".windowsett");
var bggene = document.querySelectorAll(".bggene");

// Fonction pour cacher les éléments
function hideElements(elements) {
  elements.forEach(function(element) {
    element.style.display = "none";
  });
}

// Cacher les éléments correspondants
hideElements(windows);
hideElements(windows2);
hideElements(windowssett);
hideElements(bggene);


}

setTimeout(glow, 5000);


}

function charg(){

  ani.style.display = "block";
    aniIsVisible = false;

          génér.style.display = "none";
    générIsVisible = false;

}
function masqe(){
    saveim.style.display = "block";
    saveimIsVisible = false;
  ani.style.display = "none";
    aniIsVisible = false;


}


// Sélectionner tous les éléments qui ont la classe window
var windows = document.querySelectorAll(".window");
var windows2 = document.querySelectorAll(".window2");
var windowssett = document.querySelectorAll(".windowsett");


var bggene = document.querySelectorAll(".bggene");
var yout = document.querySelectorAll(".yout");
// Fonction pour changer la couleur de fond des éléments
function changeTransparencycolors(red,green,blue,opacity) {
  // Changer la couleur des éléments ayant la classe "window"
  var windows = document.getElementsByClassName("window-header");
  for (var i = 0; i < windows.length; i++) {
    windows[i].style.backgroundColor = "rgba(" + red + ", " + green + ", " + blue + ", "+ opacity + ")";
  }
  var windows = document.getElementsByClassName("window-content");
  for (var i = 0; i < windows.length; i++) {
    windows[i].style.backgroundColor = "rgba(" + red + ", " + green + ", " + blue + ", "+ opacity*1.2 + ")";
  }
    var windows = document.getElementsByClassName("window2-header");
  for (var i = 0; i < windows.length; i++) {
    windows[i].style.backgroundColor = "rgba(" + red + ", " + green + ", " + blue + ", "+ opacity + ")";
  }
  var windows = document.getElementsByClassName("window2-content");
  for (var i = 0; i < windows.length; i++) {
    windows[i].style.backgroundColor = "rgba(" + red + ", " + green + ", " + blue + ", "+ opacity*1.2 + ")";
  }

  // Changer la couleur des éléments ayant la classe "windowsett"
  windowssett.forEach(function(window) {
    window.querySelector(".windowsett-top").style.backgroundColor = "rgba(" + red + ", " + green + ", " + blue + ", "+ opacity + ")";
    window.querySelector(".windowsett-content").style.backgroundColor = "rgba(" + red + ", " + green + ", " + blue + ", "+ opacity *1.2+ ")";
  });
  // Changer la couleur des éléments ayant la classe "windowsett"
  bggene.forEach(function(window) {
    window.querySelector(".bggene-top").style.backgroundColor = "rgba(" + red + ", " + green + ", " + blue + ", "+ opacity + ")";
    window.querySelector(".bggene-content").style.backgroundColor = "rgba(" + red + ", " + green + ", " + blue + ", "+ opacity *1.2+ ")";
  });
  yout.forEach(function(window) {
    window.querySelector(".yout-header").style.backgroundColor = "rgba(" + red + ", " + green + ", " + blue + ", "+ opacity + ")";
    window.querySelector(".yout-content").style.backgroundColor = "rgba(" + red + ", " + green + ", " + blue + ", "+ opacity *1.2+ ")";
  });

  // Changer la couleur des autres éléments
  document.querySelector(".rectangle").style.backgroundColor = "rgba(" + red + ", " + green + ", " + blue + ", "+ opacity *1.2+ ")";
  document.querySelector(".menu").style.backgroundColor = "rgba(" + red + ", " + green + ", " + blue + ", "+ opacity + ")";
  document.querySelector(".bottom-bar").style.backgroundColor = "rgba(" + red + ", " + green + ", " + blue + ", "+ opacity *1.5+ ")";
}

// Fonction pour changer la couleur selon le choix de l'utilisateur
function changeTransparency() {
  // Récupérer la valeur du slider
  var opacity = document.getElementById("opacity-slider").value;

var element = document.querySelector('.menu');
var style = getComputedStyle(element);
var backgroundColor = style.backgroundColor;
var matches = backgroundColor.match(/\d+/g);
var red = matches[0];
var green = matches[1];
var blue = matches[2];


//console.log(rgba);

  // Ajouter un écouteur d'événement sur l'élément <input type="color">

    // Récupérer la nouvelle couleur choisie par l'utilisateur


    // Appliquer la nouvelle couleur en fonction de l'opacité choisie par l'utilisateur
    //var color = "rgba(" + red + ", " + green + ", " + blue + ", "+ opacity + ")";
    changeTransparencycolors(red,green,blue,opacity);
//console.log(color);
  // Cliquer sur l'élément <input type="color> pour afficher la palette de couleurs

}



  const startBtn = document.getElementById("start-btn");
  const menu = document.getElementById("menu");
  let menuIsVisible = false;
  const fen = document.getElementById("window1");
   const fen2 = document.getElementById("window3");
   const can = document.getElementById("defaultCanvas0");
 const sett = document.getElementById("window4");
  const bgclose = document.getElementById("window5");
   const ani = document.getElementById("charge");
    const génér = document.getElementById("generate-btn");
    const saveim = document.getElementById("saveim");
        const rectangle = document.getElementById("rectangle");
        const off = document.getElementById("off");
                const ba = document.getElementById("Donwload");
        const bb = document.getElementById("guitt");
  startBtn.addEventListener("click", () => {
    if (menuIsVisible) {
      menu.style.display = "none";
      menuIsVisible = false;
    } else {
      menu.style.display = "block";
      menuIsVisible = true;
    }
  });
      menu.style.display = "none";
      menuIsVisible = false;
       fen.style.display = "none";
      fenIsVisible = false;
       fen2.style.display = "none";
      fen2IsVisible = false;



   menu.style.display = "none";
    menuIsVisible = false;

  ani.style.display = "none";
    aniIsVisible = false;


function setup() {
  createCanvas(window.innerWidth, window.innerHeight);

}

document.getElementById("generate-btn").addEventListener("click", function() {
  charg();
  setTimeout(function() {

    let bleu, jaune, vert, rouge;
    bleu = color(0, 32, 46);
  jaune = color(50, 50, 0);
  vert = color(0, 50, 0);
  rouge = color(50, 0, 0);
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let t = map(x, 0, width, 0, 1);
      let c1 = lerpColor(bleu, jaune, t);
      let c2 = lerpColor(vert, rouge, t);
      let u = map(y, 0, height, 0, 1);
      let c = lerpColor(c1, c2, u);
      set(x, y, c);
    }
  }
  updatePixels();
  smooth();
  translate(width/2, height/2);
  let taille = 80;
  let espace = 10;
  rectMode(CENTER);
  noStroke();
  blendMode(ADD);
  fill(255, 79, 24);
  rect(-taille/2 - espace, -taille/2 - espace, taille, taille);
  fill(90, 187, 0);
  rect(taille/2 + espace, -taille/2 - espace, taille, taille);
  fill(0, 165, 242);
  rect(-taille/2 - espace, taille/2 + espace, taille, taille);
  fill(255, 186, 0);
  rect(taille/2 + espace, taille/2 + espace, taille, taille);
  stroke(255, 50);
  for (let i = 0; i < 100; i++) {
    fill(noise(i/10.0) * 255, noise(i/10.0 + 100) * 255, noise(i/10.0 + 200) * 255, 50);
    rotate(noise(i/10.0 + 300) * TWO_PI);
    scale(noise(i/10.0 + 400) * 2 + 0.5);
    rect(-taille/2 - espace, -taille/2 - espace, taille, taille);
    rect(taille/2 + espace, -taille/2 - espace, taille, taille);
    rect(-taille/2 - espace, taille/2 + espace, taille, taille);
    rect(taille/2 + espace, taille/2 + espace, taille, taille);
  }
  let canvas = document.querySelector("canvas");
let dataURL = canvas.toDataURL();
document.body.style.backgroundImage = `url(${dataURL})`;
masqe()
document.querySelector("canvas").style.display = "none";



    let img = document.createElement("img");
    img.src = dataURL;
    img.style.width = "100%";

    document.getElementById("image-container").appendChild(img);

    masqe()
    document.querySelector("canvas").style.display = "none";

  }, 1000);
});
  



  

  function afficherHeureDate() {
      var maintenant = new Date();
      var heure = maintenant.getHours();
      var minute = maintenant.getMinutes();

      var jour = maintenant.getDate();
      var mois = maintenant.getMonth() + 1;
      var annee = maintenant.getFullYear();
      var heureAffichee = heure + ':' + (minute < 10 ? '0' : '') + minute ;
      var dateAffichee = jour + '/' + mois + '/' + annee;
      document.getElementById("heure").innerHTML = heureAffichee;
      document.getElementById("date").innerHTML = dateAffichee;
       document.getElementById("heure2").innerHTML = heureAffichee;
      document.getElementById("date2").innerHTML = dateAffichee;
    }
    afficherHeureDate();
    setInterval(afficherHeureDate, 1000);




// Définir les couleurs
var darkColor = "rgba(0, 0, 0, ";
var lightColor = "rgba(255, 255, 255, ";

// Sélectionner tous les éléments qui ont la classe window
var windows = document.querySelectorAll(".window");
var windows2 = document.querySelectorAll(".window2");
var windowssett = document.querySelectorAll(".windowsett");
var bggene = document.querySelectorAll(".bggene");


// Fonction pour changer la couleur de fond des éléments

function changeBackgroundColor(color) {
  var opacity = document.getElementById("opacity-slider").value;
    console.log(opacity);
  console.log(color);
  var windows = document.querySelectorAll(".window, .window-cloned");
  windows.forEach(function(window) {
    window.querySelector(".window-header").style.backgroundColor = color + opacity+ ")";
    window.querySelector(".window-content").style.backgroundColor = color + opacity*1.2+")";
  });
  var windows2 = document.querySelectorAll(".window2, .window-cloned2");
  windows2.forEach(function(window) {
    window.querySelector(".window2-header").style.backgroundColor = color + opacity+")";
    window.querySelector(".window2-content").style.backgroundColor = color + opacity*1.2+")";
  });
    var windowssett = document.querySelectorAll(".windowsett");
  windowssett.forEach(function(window) {
    window.querySelector(".windowsett-top").style.backgroundColor = color +opacity+ ")";
    window.querySelector(".windowsett-content").style.backgroundColor = color +opacity*1.2+ ")";
  });
      var bggene = document.querySelectorAll(".bggene");
  bggene.forEach(function(window) {
    window.querySelector(".bggene-top").style.backgroundColor = color +opacity+ ")";
    window.querySelector(".bggene-content").style.backgroundColor = color +opacity*1.2+ ")";
  });
        var yout = document.querySelectorAll(".yout");
  yout.forEach(function(window) {
    window.querySelector(".yout-header").style.backgroundColor = color +opacity+ ")";
    window.querySelector(".yout-content").style.backgroundColor = color +opacity*1.2+ ")";
  });

  document.querySelector(".rectangle").style.backgroundColor = color +opacity*1.2+ ")";
  document.querySelector(".menu").style.backgroundColor = color +opacity+ ")";
  document.querySelector(".bottom-bar").style.backgroundColor = color +opacity*1.5+ ")";
}



// Fonction pour changer la couleur selon le choix de l'utilisateur
function changeColor() {
  var newColor = document.createElement("input");
  newColor.type = "color";
  newColor.addEventListener("change", function() {
    var rgba = hexToRgba(newColor.value);
    changeBackgroundColor("rgba(" + rgba + ", ");
  });
  newColor.click();

}

// Fonction pour changer la couleur personnalisée
function changeCustomColor() {
  var newColor = document.createElement("input");
  newColor.type = "color";
  newColor.addEventListener("change", function() {
    var rgba = hexToRgba(newColor.value);
    changeBackgroundColor("rgba(" + rgba + ", ");
  });
  newColor.click();
}

// Fonction pour changer en mode sombre
function changeDarkMode() {
  changeBackgroundColor(darkColor);
}

// Fonction pour changer en mode clair
function changeLightMode() {
  changeBackgroundColor(lightColor);
}

// Fonction pour convertir une couleur hexadécimale en RGBA
function hexToRgba(hex) {
  var r = parseInt(hex.substr(1, 2), 16);
  var g = parseInt(hex.substr(3, 2), 16);
  var b = parseInt(hex.substr(5, 2), 16);

  return r + ", " + g + ", " + b;
}



document.getElementById('changer-arriere-plan').addEventListener('click', function() {
  var input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = function() {
    var file = this.files[0];
    var reader = new FileReader();
    reader.onload = function() {
      document.body.style.backgroundImage = 'url(' + reader.result + ')';
    };
    reader.readAsDataURL(file);
  };
  input.click();
});

function closesett(){

       sett.style.display = "none";
      settIsVisible = false;



}
function asett(){       sett.style.display = "block";
      settIsVisible = false;menu.style.display = "none";
      menuIsVisible = false;}

function closeBG(){

       bgclose.style.display = "none";
      bgcloseIsVisible = false;



}
function aBG(){       bgclose.style.display = "block";
      bgcloseIsVisible = false;menu.style.display = "none";
      menuIsVisible = false;}

function makeWindowDraggable(windowElement, windowHeaderElement) {
  let isDragging = false;
  let currentX;
  let currentY;
  let initialX;
  let initialY;
  let xOffset = 0;
  let yOffset = 0;

  windowHeaderElement.addEventListener("mousedown", dragStart);
  window.addEventListener("mouseup", dragEnd);
  window.addEventListener("mousemove", drag);

  function dragStart(e) {
    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;

    if (e.target === windowHeaderElement) {
      isDragging = true;
    }
  }

  function dragEnd() {
    isDragging = false;
  }

  function drag(e) {
    if (isDragging) {
      e.preventDefault();

      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;

      xOffset = currentX;
      yOffset = currentY;

      setTranslate(currentX, currentY, windowElement);
    }
  }
}

const window2Element = document.querySelector('.windowsett');
const window2HeaderElement = window2Element.querySelector('.windowsett-top');
makeWindowDraggable(window2Element, window2HeaderElement);

const bggeneWindowElement = document.querySelector('.bggene');
const bggeneWindowHeaderElement = bggeneWindowElement.querySelector('.bggene-top');
makeWindowDraggable(bggeneWindowElement, bggeneWindowHeaderElement);

 // Créer une fonction qui augmente le z-index d'une fenêtre
function raiseWindow(window) {
  // Récupérer le z-index le plus élevé des autres fenêtres
  let highestZIndex = 0;
  const windowsz = document.querySelectorAll('.window, .window2, .windowsett,.bggene,.yout');
  for (let w of windowsz) {
    if (w !== window) {
      let zIndex = parseInt(w.style.zIndex);
      if (zIndex > highestZIndex) {
        highestZIndex = zIndex;
      }
    }
  }
  // Attribuer un z-index supérieur à la fenêtre sélectionnée
  window.style.zIndex = highestZIndex + 1;
}

// Récupérer toutes les fenêtres avec la classe "window"
const windowsz = document.querySelectorAll('.window,.window2,.windowsett,.bggene,.yout');
// Parcourir la liste des fenêtres
for (let w of windowsz) {
  // Ajouter un événement de souris "mousedown" pour chaque fenêtre
  w.addEventListener('mousedown', () => {
    // Appeler la fonction pour augmenter le z-index de la fenêtre
    raiseWindow(w);
    menu.style.display = "none";
    menuIsVisible = false;
  });
}



function NewWIN() {
  // Créer une nouvelle fenêtre en clonant la première fenêtre
  var div = document.getElementById("window1");
  var clone = div.cloneNode(true);
   // Ajouter la classe "window-cloned" à chaque nouvelle fenêtre clonée
  clone.classList.add("window-cloned");
  clone.style.zIndex =  1;


  // Ajouter un événement de souris "mousedown" à la barre de titre de la nouvelle fenêtre
  var header = clone.querySelector('.window-header');
  header.addEventListener('mousedown', dragStart);

  clone.querySelector('.close').addEventListener('click', function() {
    clone.remove(); // Supprimer l'élément cloné de la page


  });
       menu.style.display = "none";
      menuIsVisible = false;

  // Ajouter la nouvelle fenêtre au corps du document
  document.body.appendChild(clone);


  // Afficher la nouvelle fenêtre
  clone.style.display = "block";


  // Définir les positions initiales de la nouvelle fenêtre
  var initialX = 0;
  var initialY = 0;
  var currentX = 0;
  var currentY = 0;
  var xOffset = 0;
  var yOffset = 0;

  function dragStart(e) {
    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;

    if (e.target === header) {
      document.addEventListener('mousemove', drag);
      document.addEventListener('mouseup', dragEnd);
    }
  }

  function drag(e) {
    currentX = e.clientX - initialX;
    currentY = e.clientY - initialY;

    xOffset = currentX;
    yOffset = currentY;

    setTranslate(currentX, currentY, clone);
  }

  function dragEnd() {
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', dragEnd);
  }

  // Créer une fonction qui augmente le z-index d'une fenêtre
function raiseWindow(window) {
  // Récupérer le z-index le plus élevé des autres fenêtres
  let highestZIndex = 0;
  const windowsz = document.querySelectorAll('.window, .window2,.windowsett,.bggene,.yout');
  for (let w of windowsz) {
    if (w !== window) {
      let zIndex = parseInt(w.style.zIndex);
      if (zIndex > highestZIndex) {
        highestZIndex = zIndex;
      }
    }
  }
  // Attribuer un z-index supérieur à la fenêtre sélectionnée
  window.style.zIndex = highestZIndex + 1;
}

// Récupérer toutes les fenêtres avec la classe "window"
const windowsz = document.querySelectorAll('.window,.window2,.windowsett,.bggene,.yout');
// Parcourir la liste des fenêtres
for (let w of windowsz) {
  // Ajouter un événement de souris "mousedown" pour chaque fenêtre
  w.addEventListener('mousedown', () => {
    // Appeler la fonction pour augmenter le z-index de la fenêtre
    raiseWindow(w);
    menu.style.display = "none";
    menuIsVisible = false;
  });
}

}


function NewWIN2() {

// Créer une nouvelle fenêtre en clonant la première fenêtre
  var div = document.getElementById("window3");
  var clone = div.cloneNode(true);
clone.style.zIndex = 1;
   // Ajouter la classe "window-cloned" à chaque nouvelle fenêtre clonée
  clone.classList.add("window-cloned2");


  // Ajouter un événement de souris "mousedown" à la barre de titre de la nouvelle fenêtre
  var header = clone.querySelector('.window2-header');
  header.addEventListener('mousedown', dragStart);

  clone.querySelector('.close').addEventListener('click', function() {
    clone.remove(); // Supprimer l'élément cloné de la page


  });
       menu.style.display = "none";
      menuIsVisible = false;

  // Ajouter la nouvelle fenêtre au corps du document
  document.body.appendChild(clone);


  // Afficher la nouvelle fenêtre
  clone.style.display = "block";




  // Définir les positions initiales de la nouvelle fenêtre
  var initialX = 0;
  var initialY = 0;
  var currentX = 0;
  var currentY = 0;
  var xOffset = 0;
  var yOffset = 0;

  function dragStart(e) {
    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;

    if (e.target === header) {
      document.addEventListener('mousemove', drag);
      document.addEventListener('mouseup', dragEnd);
    }
  }

  function drag(e) {
    currentX = e.clientX - initialX;
    currentY = e.clientY - initialY;

    xOffset = currentX;
    yOffset = currentY;

    setTranslate(currentX, currentY, clone);
  }

  function dragEnd() {
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', dragEnd);
  }

  // Créer une fonction qui augmente le z-index d'une fenêtre
function raiseWindow(window2) {
  // Récupérer le z-index le plus élevé des autres fenêtres
  let highestZIndex = 0;
  const windowsz = document.querySelectorAll('.window2, .window,.windowsett, .bggene,.yout');
  for (let w of windowsz) {
    if (w !== window2) {
      let zIndex = parseInt(w.style.zIndex);
      if (zIndex > highestZIndex) {
        highestZIndex = zIndex;
      }
    }
  }
  // Attribuer un z-index supérieur à la fenêtre sélectionnée
  window2.style.zIndex = highestZIndex + 1;
}

// Récupérer toutes les fenêtres avec la classe "window"
const windowsz = document.querySelectorAll('.window2, .window,.windowsett,.bggene,.yout');
// Parcourir la liste des fenêtres
for (let w of windowsz) {
  // Ajouter un événement de souris "mousedown" pour chaque fenêtre
  w.addEventListener('mousedown', () => {
    // Appeler la fonction pour augmenter le z-index de la fenêtre
    raiseWindow(w);
    menu.style.display = "none";
    menuIsVisible = false;
  });
}

}









  function NewWIN3() {
    // Cloner la fenêtre "yout"
    var div = document.getElementById("yout");
    var clone = div.cloneNode(true);



    // Ajouter la classe "yout-cloned" à la nouvelle fenêtre clonée
    clone.classList.add("yout-cloned");

    // Ajouter un événement de souris "mousedown" à la barre de titre de la nouvelle fenêtre
    var header = clone.querySelector(".yout-header");
    header.addEventListener("mousedown", dragStart);

    // Ajouter un événement de clic à la croix de la nouvelle fenêtre
    var closeButton = clone.querySelector(".close");
    closeButton.addEventListener("click", function () {
      clone.remove(); // Supprimer l'élément cloné de la page
    });

    // Ajouter la nouvelle fenêtre au corps du document
    document.body.appendChild(clone);

    // Afficher la nouvelle fenêtre
    clone.style.display = "block";

    
  var initialX = 0;
  var initialY = 0;
  var currentX = 0;
  var currentY = 0;
  var xOffset = 0;
  var yOffset = 0;

  function dragStart(e) {
    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;

    if (e.target === header) {
      document.addEventListener('mousemove', drag);
      document.addEventListener('mouseup', dragEnd);
    }
  }

  function drag(e) {
    currentX = e.clientX - initialX;
    currentY = e.clientY - initialY;

    xOffset = currentX;
    yOffset = currentY;

    setTranslate(currentX, currentY, clone);
  }

  function dragEnd() {
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', dragEnd);
  }

  // Créer une fonction qui augmente le z-index d'une fenêtre
function raiseWindow(window2) {
  // Récupérer le z-index le plus élevé des autres fenêtres
  let highestZIndex = 0;
  const windowsz = document.querySelectorAll('.window2, .window,.windowsett, .bggene,.yout');
  for (let w of windowsz) {
    if (w !== window2) {
      let zIndex = parseInt(w.style.zIndex);
      if (zIndex > highestZIndex) {
        highestZIndex = zIndex;
      }
    }
  }
  // Attribuer un z-index supérieur à la fenêtre sélectionnée
  window2.style.zIndex = highestZIndex + 1;
}

// Récupérer toutes les fenêtres avec la classe "window"
const windowsz = document.querySelectorAll('.window2, .window,.windowsett,.bggene,.yout');
// Parcourir la liste des fenêtres
for (let w of windowsz) {
  // Ajouter un événement de souris "mousedown" pour chaque fenêtre
  w.addEventListener('mousedown', () => {
    // Appeler la fonction pour augmenter le z-index de la fenêtre
    raiseWindow(w);
    menu.style.display = "none";
    menuIsVisible = false;
  });
}

}


function changeBlur(value) {

  var windows = document.getElementsByClassName("window-header");
  for (var i = 0; i < windows.length; i++) {
    windows[i].style.backdropFilter = "blur(" + value + "px)";
  }
  var windows = document.getElementsByClassName("window-content");
  for (var i = 0; i < windows.length; i++) {
    windows[i].style.backdropFilter = "blur(" + value*5 + "px)";
  }
    var windows = document.getElementsByClassName("window2-header");
  for (var i = 0; i < windows.length; i++) {
    windows[i].style.backdropFilter = "blur(" + value + "px)";
  }
  var windows = document.getElementsByClassName("window2-content");
  for (var i = 0; i < windows.length; i++) {
    windows[i].style.backdropFilter = "blur(" + value*5 + "px)";
  }
  var menus = document.getElementsByClassName("menu");
  for (var i = 0; i < menus.length; i++) {
    menus[i].style.backdropFilter = "blur(" + value + "px)";
  }

  var rectangles = document.getElementsByClassName("rectangle");
  for (var i = 0; i < rectangles.length; i++) {
    rectangles[i].style.backdropFilter = "blur(" + value + "px)";
  }

    var windows = document.getElementsByClassName("windowsett-top");
  for (var i = 0; i < windows.length; i++) {
    windows[i].style.backdropFilter = "blur(" + value + "px)";
  }
  var windows = document.getElementsByClassName("windowsett-content");
  for (var i = 0; i < windows.length; i++) {
    windows[i].style.backdropFilter = "blur(" + value*5 + "px)";
  }
      var windows = document.getElementsByClassName("bggene-top");
  for (var i = 0; i < windows.length; i++) {
    windows[i].style.backdropFilter = "blur(" + value + "px)";
  }
  var windows = document.getElementsByClassName("bggene-content");
  for (var i = 0; i < windows.length; i++) {
    windows[i].style.backdropFilter = "blur(" + value*5 + "px)";

  }
        var windows = document.getElementsByClassName("yout");
  for (var i = 0; i < windows.length; i++) {
    windows[i].style.backdropFilter = "blur(" + value + "px)";
  }

}



function setTranslate(xPos, yPos, el) {
  el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
}
    saveim.addEventListener("click", saveImage);
    function saveImage() {

      let a = document.createElement("a");

      let url = canvas.toDataURL("image/png");

      a.href = url;
      a.download = "image.png";

      a.click();
    }

    </script>
  

</body></html>
