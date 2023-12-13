
    function FichierCSS367() {
        var styleSheet = document.getElementById("styleSheet");
        styleSheet.href = "../CSS/WB367.css"; // Remplacez "NouveauFichier.css" par le nom de votre nouveau fichier CSS
                var bouton = document.getElementById("download");



        localStorage.setItem('Theme', "../CSS/WB367.css");
        localStorage.setItem('Boot', "FichierCSS367");
  
        
    }



        function FichierCSSXP() {
        var styleSheet = document.getElementById("styleSheet");
        styleSheet.href = "../CSS/WXP.css"; // Remplacez "NouveauFichier.css" par le nom de votre nouveau fichier CSS
                var bouton = document.getElementById("download");



        localStorage.setItem('Theme', "../CSS/WXP.css");
        localStorage.setItem('Boot', "FichierCSSXP");


    }

    function FichierCSS7() {
        var styleSheet = document.getElementById("styleSheet");
        styleSheet.href = "../CSS/W7.css"; // Remplacez "NouveauFichier.css" par le nom de votre nouveau fichier CSS
        var bouton = document.getElementById("download");



        localStorage.setItem('Theme', "../CSS/W7.css");
        localStorage.setItem('Boot', "FichierCSS7");

 


    }

        document.addEventListener("DOMContentLoaded", function() {
            // Vérifier si la valeur "Boot" est présente dans le stockage local
            var bootValue = localStorage.getItem('Boot');

            if (bootValue && bootValue === "FichierCSS367") {
        var styleSheet = document.getElementById("styleSheet");
        styleSheet.href = "../CSS/WB367.css";
            }
            if (bootValue && bootValue === "FichierCSSXP") {
       var styleSheet = document.getElementById("styleSheet");
        styleSheet.href = "../CSS/WXP.css";
            }
            if (bootValue && bootValue === "FichierCSS7") {
         var styleSheet = document.getElementById("styleSheet");
        styleSheet.href = "../CSS/W7.css";
            

            }



  setTimeout(function() {
  document.body.classList.add("background");
}, 400);


  setTimeout(function() {
          rectangle.style.display = "block";
    rectangleIsVisible = true;
}, 1500);

        });


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

        styleSheet.href = "../CSS/WP.css"; // Remplacez "NouveauFichier.css" par le nom de votre nouveau fichier CSS
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

window.location.href = "bios.html";
        // Mettez ici le code que vous souhaitez exécuter si l'utilisateur a confirmé
    }  
}

