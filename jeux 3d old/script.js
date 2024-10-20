
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



function setup() {
  createCanvas(window.innerWidth, window.innerHeight);

}


  

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




// Fonction pour changer la couleur selon le choix de l'utilisateur
function changeColor() {
  var newColor = document.createElement("input");
  newColor.type = "color";
  newColor.addEventListener("change", function() {
    var rgba = hexToRgba(newColor.value);
  });
  newColor.click();

}

// Fonction pour changer la couleur personnalisée
function changeCustomColor() {
  var newColor = document.createElement("input");
  newColor.type = "color";
  newColor.addEventListener("change", function() {
    var rgba = hexToRgba(newColor.value);
  });
  newColor.click();
}


// Fonction pour convertir une couleur hexadécimale en RGBA
function hexToRgba(hex) {
  var r = parseInt(hex.substr(1, 2), 16);
  var g = parseInt(hex.substr(3, 2), 16);
  var b = parseInt(hex.substr(5, 2), 16);

  return r + ", " + g + ", " + b;
}





function closesett(){

       sett.style.display = "none";
      settIsVisible = false;
      setTimeout(function() {
asett()
}, 30); // 1000 millisecondes = 1 seconde


}
function asett(){       sett.style.display = "block";
      settIsVisible = false;menu.style.display = "none";
      menuIsVisible = false;}

function closeBG(){

       bgclose.style.display = "none";
      bgcloseIsVisible = false;

    setTimeout(function() {
        window.location.href = 'https://polocrafting.fr'; // Remplacer par l'URL souhaité
    }, 30); // 30 millisecondes de délai

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
  const windowsz = document.querySelectorAll('.window, .window2, .windowsett,.bggene');
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
const windowsz = document.querySelectorAll('.window,.window2,.windowsett,.bggene');
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
     setTimeout(function() {
        window.location.href = 'https://polocrafting.fr/intervention'; // Remplacer par l'URL souhaité
        },30); // 1000 millisecondes = 1 seconde

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
  const windowsz = document.querySelectorAll('.window, .window2,.windowsett,.bggene');
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
const windowsz = document.querySelectorAll('.window,.window2,.windowsett,.bggene');
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
    
    setTimeout(function() {
        window.location.href = 'https://polocrafting.fr/jeux3D'; // Remplacer par l'URL souhaité
    }, 30); // 30 millisecondes de délai
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
  const windowsz = document.querySelectorAll('.window2, .window,.windowsett, .bggene');
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
const windowsz = document.querySelectorAll('.window2, .window,.windowsett,.bggene');
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
}



function setTranslate(xPos, yPos, el) {
  el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
}
    


    function makeWindowDraggable(windowElement, windowHeaderElement) {
  let isDragging = false;
  let currentX, currentY, initialX, initialY, xOffset = 0, yOffset = 0;

  windowHeaderElement.addEventListener("mousedown", dragStart);
  windowHeaderElement.addEventListener("touchstart", dragStart);

  window.addEventListener("mouseup", dragEnd);
  window.addEventListener("touchend", dragEnd);

  window.addEventListener("mousemove", drag);
  window.addEventListener("touchmove", drag);

  function dragStart(e) {
    if (e.type === "touchstart") {
      initialX = e.touches[0].clientX - xOffset;
      initialY = e.touches[0].clientY - yOffset;
    } else {
      initialX = e.clientX - xOffset;
      initialY = e.clientY - yOffset;
    }
    isDragging = true;
  }

  function dragEnd() {
    isDragging = false;
  }

  function drag(e) {
    if (isDragging) {
      e.preventDefault();
      if (e.type === "touchmove") {
        currentX = e.touches[0].clientX - initialX;
        currentY = e.touches[0].clientY - initialY;
      } else {
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
      }

      xOffset = currentX;
      yOffset = currentY;

      setTranslate(currentX, currentY, windowElement);
    }
  }
}
