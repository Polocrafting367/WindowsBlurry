
function Power(){
    rectangle.style.display = "none";
    rectangleimIsVisible = false;
  menu.style.display = "none";
    menuIsVisible = false;


function black() {
  var image = document.getElementById("off");
  image.classList.replace(image.className, "black-image");
  off.style.display = "block";
  offIsVisible = true;
}

setTimeout(black, 1000);

function changerImage() {
window.location.href = "bios.html";
}

setTimeout(changerImage, 1500);

function restart() {
  var image = document.getElementById("off");
  image.classList.replace(image.className, "black-image");
}

setTimeout(restart, 4000);

function glow() {
  var image = document.getElementById("off");
  image.classList.replace(image.className, "glow-image");
  slidingDiv.style.display = "block";





// Sélectionner tous les éléments qui ont la classe window
const windows = document.querySelectorAll('.window, .window1, .window2, .window3, .window4, .windowsett, .bggene, .yout');

// Fonction pour cacher les éléments
function hideElements(elements) {
  elements.forEach(function(element) {
    element.style.display = "none";
  });
}

// Cacher les éléments correspondants
hideElements(windows);



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

    }
    afficherHeureDate();
    setInterval(afficherHeureDate, 1000);









function closesett(){

       sett.style.display = "none";
      settIsVisible = false;



}


function asett() {
  // Afficher la fenêtre "sett"
  sett.style.display = "block";
  settIsVisible = false;

  // Cacher la fenêtre "menu"
  menu.style.display = "none";
  menuIsVisible = false;

  // Mettre la fenêtre "sett" au premier plan
  raiseWindow(sett);
}

// Ajouter un événement ou un déclencheur approprié pour appeler la fonction asett()
// par exemple, si vous avez un bouton qui déclenche l'affichage de la fenêtre "sett"
const buttonToShowSett = document.getElementById('par'); // Remplacez 'buttonToShowSett' par l'id de votre bouton

buttonToShowSett.addEventListener('click', asett);


function closeBG(){

       bgclose.style.display = "none";
      bgcloseIsVisible = false;



}


function aBG(){       
  bgclose.style.display = "block";
      bgcloseIsVisible = false;

      menu.style.display = "none";
      menuIsVisible = false;

      raiseWindow(window5);

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



function NouvelleFenetre(id, titre, lien, menu, menuIsVisible) {
  var div = document.getElementById("window");
  var clone = div.cloneNode(true);
  clone.style.zIndex = 1;

  // Changer l'ID de la div clonée
  clone.id = id;


  raiseWindow(clone);

  var header = clone.querySelector(".window-content");
  header.id = "window-content-" + id;

  clone.querySelector(".close").addEventListener("click", function() {
    clone.remove();
  });

  menu.style.display = "none";
  menuIsVisible = false;

  document.body.appendChild(clone);
  clone.style.display = "block";

  makeWindowDraggable(clone, clone.querySelector('.window-header'));

  var Lien = clone.querySelector("#Lien");
  Lien.src = lien;

  var Titre = clone.querySelector("#titrefn");
  Titre.textContent = titre;
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



