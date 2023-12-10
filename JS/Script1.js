
    function changerFichierCSS367() {
        var styleSheet = document.getElementById("styleSheet");
        styleSheet.href = "CSS/WB367.css"; // Remplacez "NouveauFichier.css" par le nom de votre nouveau fichier CSS
                var bouton = document.getElementById("download");
        bios.style.display = "none";


        localStorage.setItem('Theme', "../CSS/WB367.css");
        localStorage.setItem('Boot', "FichierCSS367");
        location.reload(true);
        
    }
    function FichierCSS367() {
        var styleSheet = document.getElementById("styleSheet");
        styleSheet.href = "CSS/WB367.css"; // Remplacez "NouveauFichier.css" par le nom de votre nouveau fichier CSS
                var bouton = document.getElementById("download");
        bios.style.display = "none";
                localStorage.setItem('Theme', "../CSS/WB367.css");
        localStorage.setItem('Boot', "FichierCSS367");
    }


        function changerFichierCSSXP() {
        var styleSheet = document.getElementById("styleSheet");
        styleSheet.href = "CSS/WXP.css"; // Remplacez "NouveauFichier.css" par le nom de votre nouveau fichier CSS
                var bouton = document.getElementById("download");
        bios.style.display = "none";


        localStorage.setItem('Theme', "../CSS/WXP.css");
        localStorage.setItem('Boot', "FichierCSSXP");
        location.reload(true);

    }

        function FichierCSSXP() {
        var styleSheet = document.getElementById("styleSheet");
        styleSheet.href = "CSS/WXP.css"; // Remplacez "NouveauFichier.css" par le nom de votre nouveau fichier CSS
                var bouton = document.getElementById("download");
        bios.style.display = "none";
                localStorage.setItem('Theme', "../CSS/WXP.css");
        localStorage.setItem('Boot', "FichierCSSXP");

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

        styleSheet.href = "CSS/WP.css"; // Remplacez "NouveauFichier.css" par le nom de votre nouveau fichier CSS
        bts.style.display = "none";
        bios.style.display = "none";
        alert.style.display = "none";
        var bouton = document.getElementById("download");
}
 function Supp() {  
 var confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer, cela redémarrera la page sans sauvegarde ?");    
 if (confirmation) {
        // L'utilisateur a cliqué sur "OK"
            localStorage.setItem('Theme', "");
    localStorage.setItem('Boot', "");
    localStorage.setItem('editorContent', "");

location.reload(true);
        // Mettez ici le code que vous souhaitez exécuter si l'utilisateur a confirmé
    }  
}


var fonctionAExecuter = localStorage.getItem('Boot');

if (fonctionAExecuter !== null) {
    // La fonction existe, vous pouvez l'exécuter
    window[fonctionAExecuter](); 



function restart() {
  var image = document.getElementById("off");
  image.classList.replace(image.className, "changer-image");
}
setTimeout(restart, 0);


function glow() {
  var image = document.getElementById("off");
  image.classList.replace(image.className, "black-image");
  
}

setTimeout(glow, 2000);

function verr() {
  var image = document.getElementById("off");
  image.classList.replace(image.className, "glow-image");
  off.style.zIndex = "100";

}

setTimeout(verr, 3000);

} else {

}
