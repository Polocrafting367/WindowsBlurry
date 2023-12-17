document.addEventListener("DOMContentLoaded", function() {
  //alert(localStorage.getItem('OPACITY') + "<br>" + localStorage.getItem('COLOR'))
  var color = localStorage.getItem('COLOR');
  var opacity = localStorage.getItem('OPACITY');
  var Blurr = localStorage.getItem('BLURR');
  var fond = localStorage.getItem('PICT');
  //alert(fond)
  // Vérifier si une couleur est stockée localement
  if (color) {
    // Changer la couleur de fond de la page avec la couleur stockée
    changeBackgroundColor(color, opacity); 
    document.getElementById("opacity-slider").value = opacity;
    document.getElementById("blur-slider").value = Blurr;
    changeBlur(Blurr);

  }

if (fond !== "") {
  document.body.style.backgroundImage = 'url(' + fond + ')';
}

});


document.getElementById('changer-arriere-plan').addEventListener('click', function() {
  var input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = function() {
    var file = this.files[0];
    var reader = new FileReader();
    reader.onload = function() {
      document.body.style.backgroundImage = 'url(' + reader.result + ')';
      localStorage.setItem('PICT', reader.result);
    };
    reader.readAsDataURL(file);
  };
  input.click();
});



var windows = document.querySelectorAll(".window");
var windows2 = document.querySelectorAll(".window2");
var windowssett = document.querySelectorAll(".windowsett");
var bggene = document.querySelectorAll(".bggene");

// Fonction pour changer la couleur selon le choix de l'utilisateur
function changeTransparency() {
  var rgba = localStorage.getItem('COLOR'); // Déclarer la variable rgba
  var opacity = document.getElementById("opacity-slider").value;
   localStorage.setItem('OPACITY', opacity);
    // alert(localStorage.getItem('OPACITY') + "<br>" + localStorage.getItem('COLOR'))
  changeBackgroundColor(rgba, opacity);
  console.log(opacity);
}

// Sélectionner tous les éléments qui ont la classe window


function changeColor() {
  var newColor = document.createElement("input");
  newColor.type = "color";
  newColor.addEventListener("change", function() {
    var rgba = hexToRgba(newColor.value);
    localStorage.setItem('COLOR', "rgba(" + rgba + ", ");
      //alert(localStorage.getItem('OPACITY') + "<br>" + localStorage.getItem('COLOR'))
    var opacity = document.getElementById("opacity-slider").value;
    changeBackgroundColor("rgba(" + rgba + ", ", opacity);
    console.log("rgba(" + rgba + ", " + opacity + ")");
  });
  newColor.click();
}


// Fonction pour changer la couleur de fond des éléments

function changeBackgroundColor(color, opcacite) {
  var windows = document.querySelectorAll(".window");
  windows.forEach(function (window) {
    var header = window.querySelector(".window-header");
    if (header) {
     header.style.backgroundColor = color + opcacite + ")";
    }
  });

  var windowssett = document.querySelectorAll(".windowsett");
  windowssett.forEach(function (window) {
    var window4 = document.getElementById("window4");
    if (window4) {
      window4.style.backgroundColor = color + opcacite + ")";
    }
  });

  var bggene = document.querySelectorAll(".bggene");
  bggene.forEach(function (window) {
    var bggeneTop = window.querySelector(".bggene-top");
    if (bggeneTop) {
      bggeneTop.style.backgroundColor = color + opcacite + ")";
    }
  });

  var rectangle = document.querySelector(".rectangle");
  if (rectangle) {
    rectangle.style.backgroundColor = color + opcacite * 1.2 + ")";
  }

  var menu = document.querySelector(".menu");
  if (menu) {
    menu.style.backgroundColor = color + opcacite + ")";
  }

  var bottomBar = document.querySelector(".bottom-bar");
  if (bottomBar) {
    bottomBar.style.backgroundColor = color + opcacite * 1.5 + ")";
  }
}



// Fonction pour changer la couleur selon le choix de l'utilisateur




// Fonction pour convertir une couleur hexadécimale en RGBA
function hexToRgba(hex) {
  var r = parseInt(hex.substr(1, 2), 16);
  var g = parseInt(hex.substr(3, 2), 16);
  var b = parseInt(hex.substr(5, 2), 16);

  return r + ", " + g + ", " + b;
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
localStorage.setItem('BLURR', value);
}
