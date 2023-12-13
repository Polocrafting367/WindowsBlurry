
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
  const windowsz = document.querySelectorAll('.window,.window1, .window2,.window3, .windowsett,.bggene,.yout');
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
const windowsz = document.querySelectorAll('.window,.window1,.window2,.window3,.windowsett,.bggene,.yout');
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
  let highestZIndex = 0;
  const windowsz = document.querySelectorAll('.window,.window1, .window2,.window3, .windowsett,.bggene,.yout');
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

  // Créer une fonction qui augmente le z-index d'une fenêtre
function raiseWindow(window) {
  // Récupérer le z-index le plus élevé des autres fenêtres
  let highestZIndex = 0;
  const windowsz = document.querySelectorAll('.window,.window1, .window2,.window3, .windowsett,.bggene,.yout');
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


function cloneWindow(originalId, cloneClass) {
  const originalWindow = document.getElementById(originalId);
  const clone = originalWindow.cloneNode(true);
  clone.style.zIndex = 1;
  clone.classList.add(cloneClass);

  const header = clone.querySelector(`.${cloneClass}-header`);
  header.addEventListener('mousedown', dragStart);

  clone.querySelector('.close').addEventListener('click', () => clone.remove());

  document.body.appendChild(clone);
  clone.style.display = 'block';

  let initialX = 0, initialY = 0, currentX = 0, currentY = 0, xOffset = 0, yOffset = 0;

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

  raiseWindow(clone);
}

function raiseWindow(window) {
  const windows = document.querySelectorAll('.window, .window1, .window2, .window3, .windowsett, .bggene, .yout');
  const highestZIndex = Math.max(...Array.from(windows).map(w => parseInt(w.style.zIndex) || 0), 0);
  window.style.zIndex = highestZIndex + 1;
}

// Example usage
function NewWIN2() {
  cloneWindow('window3', 'window-cloned2');
}

function NewWIN3() {
  cloneWindow('yout', 'yout-cloned');
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





