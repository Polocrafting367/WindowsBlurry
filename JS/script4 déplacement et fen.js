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
    if (menu.style.display === "none") {
        menu.style.display = "block";
        menuIsVisible = false;
    } else {
        menu.style.display = "none";
        menuIsVisible = true;
    }
});

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





function raiseWindow(window) {
  // Récupérer le z-index le plus élevé des autres fenêtres
  let highestZIndex = 0;
  const windowsz = document.querySelectorAll('.window, .window1, .window2, .window3, .window4, .windowsett, .bggene, .yout, .Message');
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
function makeWindowDraggable(windowElement, windowHeaderElement) {
  let isDragging = false;
  let initialX;
  let initialY;
  let xOffset = 0;
  let yOffset = 0;

  windowHeaderElement.addEventListener("mousedown", dragStart);
  windowHeaderElement.addEventListener("touchstart", dragStart, { passive: false });

  document.addEventListener("mouseup", dragEnd);
  document.addEventListener("touchend", dragEnd, { passive: false });

  document.addEventListener("mousemove", drag);
  document.addEventListener("touchmove", drag, { passive: false });

  function dragStart(e) {
    if (e.target === windowHeaderElement) {
      isDragging = true;
      raiseWindow(windowElement);
      if (e.type === "touchstart") {
        initialX = e.touches[0].clientX - xOffset;
        initialY = e.touches[0].clientY - yOffset;
      } else {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
      }
    }
  }

  function dragEnd() {
    isDragging = false;
  }

  function drag(e) {
    if (isDragging) {
      e.preventDefault();

      if (e.type === "touchmove") {
        xOffset = e.touches[0].clientX - initialX;
        yOffset = e.touches[0].clientY - initialY;
      } else {
        xOffset = e.clientX - initialX;
        yOffset = e.clientY - initialY;
      }

      setTranslate(xOffset, yOffset, windowElement);
    }
  }

  function setTranslate(xPos, yPos, el) {
    el.style.transform = `translate(${xPos}px, ${yPos}px)`;
  }
}





// Parcourir la liste des fenêtres
for (let window of windows) {
  // Ajouter un événement de souris "mousedown" pour chaque fenêtre
  const windowHeader = window.querySelector('.window-header'); // Remplacez '.window-header' par la classe ou l'élément de l'en-tête de la fenêtre
  makeWindowDraggable(window, windowHeader);
}


function loadContentWithObject(url, targetElement) {
    var objectElement = document.createElement('object');
    objectElement.data = url;
    targetElement.appendChild(objectElement);
}

function BlocNote() {
  NouvelleFenetre("BlocNote", "Bloc Notes", "../App/NotePad.html", menu, menuIsVisible, false);
}

function Calculatrice() {
  NouvelleFenetre("Calculatrice", "Calculatrice", "../App/Calc.html", menu, menuIsVisible, false);
}

function Yout() {
  NouvelleFenetre("Yout", "VM", "../index.html", menu, menuIsVisible, true);
}

function LOGO() {
  NouvelleFenetre("Yout", "Crédits", "../App/Logo.html", menu, menuIsVisible, false);
}

function Supp() {
  localStorage.setItem('MessageINFO', "Êtes-vous sûr de vouloir supprimer, cela redémarrera l'ordinateur sans sauvegarde des données ?");
  localStorage.setItem('B1', "Annuler");
  localStorage.setItem('B2', "Supprimer");

  NouvelleFenetre("Message", "Cookies", "../App/Message box.html", menu, menuIsVisible);
}

function FermerFenetre(windowClone, newButton) {
  windowClone.remove();
  newButton.remove();
}

function NouvelleFenetre(id, title, contentUrl, menu, menuIsVisible, Actualisation) {
  var windowDiv = document.getElementById("window");
  var windowClone = windowDiv.cloneNode(true);
  windowClone.style.zIndex = 1;
  windowClone.id = id;

  raiseWindow(windowClone);

  var header = windowClone.querySelector(".window-content");
  header.id = "window-content-" + id;

  if (menu) {
    menu.style.display = "none";
  }

  document.body.appendChild(windowClone);
  windowClone.style.display = "block";

  makeWindowDraggable(windowClone, windowClone.querySelector('.window-header'));

  var contentContainer = windowClone.querySelector(".window-content");

  loadContentWithObject(contentUrl, contentContainer);

  var reduceButton = windowClone.querySelector(".reduit");
  if (reduceButton) {
    reduceButton.addEventListener("click", function () {
      windowClone.style.display = "none";
    });
  }

  windowClone.querySelector(".close").addEventListener("click", function () {
    FermerFenetre(windowClone, newButton);
  });

  // Fonction à exécuter en cas de changement dans le localStorage
// Ajoutez cet écouteur d'événements pour détecter les changements de stockage local
window.addEventListener('storage', handleStorageChange);

function handleStorageChange(event) {
  localStorage.setItem('CloseFEN', 'CLOSEOPASOK');


  if (event.key === 'CloseFEN') {
    // La valeur de CloseFEN a changé, vous pouvez effectuer votre action ici
   
    FermerFenetre(windowClone, newButton);
  }


}


  var titleElement = windowClone.querySelector("#titrefn");
  if (titleElement) {
    titleElement.textContent = title;
  }

  var originalButton = document.getElementById("FenDEFF");
  var newButton = originalButton.cloneNode(true);
  newButton.innerHTML = title;
  newButton.style.display = "block";

  var taskbar = document.getElementById("taskbarre");
  taskbar.appendChild(newButton);

  newButton.addEventListener("click", function () {
    windowClone.style.display = "block";
    isWindowVisible = true;
    raiseWindow(windowClone);
  });

windowClone.querySelector(".close").addEventListener("click", function () {
    FermerFenetre(windowClone, newButton);
});


  var actualiserButton = windowClone.querySelector(".actualiser");
  if (actualiserButton) {
    // Check the value of Actualisation and set the display property accordingly
    actualiserButton.style.display = Actualisation ? "block" : "none";



 
    // Add an event listener only if the button is visible
    if (Actualisation) {
      actualiserButton.addEventListener("click", function () {
        contentContainer.innerHTML = ""; // Vide le conteneur
        loadContentWithObject(contentUrl, contentContainer); // Recharge le contenu
      });
    }
  }
}
