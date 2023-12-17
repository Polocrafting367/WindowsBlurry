
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



