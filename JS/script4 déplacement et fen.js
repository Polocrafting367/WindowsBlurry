
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
      if (menu.style.display === "none")  {
      menu.style.display = "block";
      menuIsVisible = false;
    } else {
      menu.style.display = "none";
      menuIsVisible = true;
    }
  });




      menu.style.display = "none";
      menuIsVisible = false;





   menu.style.display = "none";
    menuIsVisible = false;

  ani.style.display = "none";
    aniIsVisible = false;


// Declare variables outside functions
let nouveauBoutonsett;
let nouveauBoutonbg;

function closesett() {
  sett.style.display = "none";
  settIsVisible = false;
  // Remove the button
  if (nouveauBoutonsett) {
    nouveauBoutonsett.remove();
  }
}

function asett() {
  sett.style.display = "block";
  settIsVisible = false;
  menu.style.display = "none";
  menuIsVisible = false;
  raiseWindow(sett);

  var boutonOriginal = document.getElementById("FenDEFF");

  nouveauBoutonsett = boutonOriginal.cloneNode(true);
  nouveauBoutonsett.innerHTML = "Paramètres";
  nouveauBoutonsett.style.display = "block";
  var taskbarre = document.getElementById("taskbarre");
  taskbarre.appendChild(nouveauBoutonsett);
  
  nouveauBoutonsett.addEventListener("click", function () {
    sett.style.display = "block";
    settIsVisible = true;
    raiseWindow(sett);
  });
}

function closeBG() {
  bgclose.style.display = "none";
  bgcloseIsVisible = false;
  // Remove the button
  if (nouveauBoutonbg) {
    nouveauBoutonbg.remove();
  }
}


function aBG() {
  bgclose.style.display = "block";
  bgcloseIsVisible = false;
  menu.style.display = "none";
  menuIsVisible = false;
  raiseWindow(window5);

  var boutonOriginal = document.getElementById("FenDEFF");

  nouveauBoutonbg = boutonOriginal.cloneNode(true);
  nouveauBoutonbg.innerHTML = "Générateur...";
  nouveauBoutonbg.style.display = "block";
  var taskbarre = document.getElementById("taskbarre");
  taskbarre.appendChild(nouveauBoutonbg);
  
  nouveauBoutonbg.addEventListener("click", function () {
    bgclose.style.display = "block";
    bgcloseIsVisible = true;
    raiseWindow(bgclose);
  });
}

// Add an event listener for the button to trigger the asett function





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
  const windowsz = document.querySelectorAll('.window, .window1,.window2,.window3,.window4, .windowsett,.bggene,.yout');
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
const windowsz = document.querySelectorAll('.window, .window1,.window2,.window3,.window4, .windowsett,.bggene,.yout');
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

function makeWindowDraggable(windowElement, windowHeaderElement) {
  let isDragging = false;
  let currentX;
  let currentY;
  let initialX;
  let initialY;
  let xOffset = 0;
  let yOffset = 0;

  document.addEventListener("mousedown", dragStart);
  document.addEventListener("mouseup", dragEnd);
  document.addEventListener("mousemove", drag);

  function dragStart(e) {
    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;

    if (e.target === windowHeaderElement) {
      isDragging = true;
      raiseWindow(windowElement); // Appeler la fonction pour augmenter le z-index de la fenêtre au clic
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

  // Fonction pour définir la translation de la fenêtre
  function setTranslate(xPos, yPos, el) {
    el.style.transform = `translate(${xPos}px, ${yPos}px)`;
  }
}

// Récupérer toutes les fenêtres avec la classe "window"


// Parcourir la liste des fenêtres
for (let window of windows) {
  // Ajouter un événement de souris "mousedown" pour chaque fenêtre
  const windowHeader = window.querySelector('.window-header'); // Remplacez '.window-header' par la classe ou l'élément de l'en-tête de la fenêtre
  makeWindowDraggable(window, windowHeader);
}




function BlocNote() {
NouvelleFenetre("BlocNote", "Bloc Notes", "../App/NotePad.html", menu, menuIsVisible);

}
function Calculatrice() {
  NouvelleFenetre("Calculatrice", "Calculatrice", "../App/Calc.html", menu, menuIsVisible);
}
function Yout() {
  NouvelleFenetre("Yout", "Youtube PLayer", "../App/yout.html", menu, menuIsVisible);
}



function NouvelleFenetre(id, titre, lien, menu) {
  var div = document.getElementById("window");
  var clone = div.cloneNode(true);
  clone.style.zIndex = 1;

  // Changer l'ID de la div clonée
  clone.id = id;

  raiseWindow(clone);

  var header = clone.querySelector(".window-content");
  header.id = "window-content-" + id;

 clone.querySelector(".close").addEventListener("click", function () {
    // Supprimer la fenêtre clonée
    clone.remove();

    // Supprimer le bouton de duplication
    nouveauBouton.remove();
  });

  var boutonReduc = clone.querySelector(".reduit");
  if (boutonReduc) {
    boutonReduc.addEventListener("click", function () {
      clone.style.display = "none";
    });
  }

  // Assurez-vous que "menu" est défini avant de manipuler son style
  if (menu) {
    menu.style.display = "none";
  }

  document.body.appendChild(clone);
  clone.style.display = "block";

  makeWindowDraggable(clone, clone.querySelector('.window-header'));

  var Lien = clone.querySelector("#Lien");
  if (Lien) {
    Lien.src = lien;
  }

  var Titre = clone.querySelector("#titrefn");
  if (Titre) {
    Titre.textContent = titre;
  }

    var boutonReduc = clone.querySelector(".reduit");


// Sélectionnez le bouton original
var boutonOriginal = document.getElementById("FenDEFF");

// Clonez le bouton original avec tous ses descendants
var nouveauBouton = boutonOriginal.cloneNode(true);

// Modifiez le texte du nouveau bouton
nouveauBouton.innerHTML = titre;
nouveauBouton.style.display = "block";
// Ajoutez le nouveau bouton à la div avec l'ID "taskbarre"
var taskbarre = document.getElementById("taskbarre");
taskbarre.appendChild(nouveauBouton);

  nouveauBouton.addEventListener("click", function () {

      clone.style.display = "block";
      isWindowVisible = true;

raiseWindow(clone)

  });
}




