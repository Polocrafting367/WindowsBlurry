setTimeout(function() {
    var maDiv = document.getElementById("tem");
    maDiv.style.display = "block";
}, 200);



    function changerFichierCSS367() {
        var styleSheet = document.getElementById("styleSheet");
        styleSheet.href = "../CSS/WB367.css"; // Remplacez "NouveauFichier.css" par le nom de votre nouveau fichier CSS
        var bouton = document.getElementById("download");
        bios.style.display = "none";


        localStorage.setItem('Theme', "../CSS/WB367.css");
        localStorage.setItem('Boot', "FichierCSS367");

 
        window.location.href = "../Boot/367boot.html";

    }



        function changerFichierCSSXP() {
        var styleSheet = document.getElementById("styleSheet");
        styleSheet.href = "../CSS/WXP.css"; // Remplacez "NouveauFichier.css" par le nom de votre nouveau fichier CSS
                var bouton = document.getElementById("download");
        bios.style.display = "none";


        localStorage.setItem('Theme', "../CSS/WXP.css");
        localStorage.setItem('Boot', "FichierCSSXP");

  
        window.location.href = "../Boot/XPboot.html";
    }


    function changerFichierCSS7() {
        var styleSheet = document.getElementById("styleSheet");
        styleSheet.href = "../CSS/W7.css"; // Remplacez "NouveauFichier.css" par le nom de votre nouveau fichier CSS
        var bouton = document.getElementById("download");
        bios.style.display = "none";


        localStorage.setItem('Theme', "../CSS/W7.css");
        localStorage.setItem('Boot', "FichierCSS7");

 
        window.location.href = "../Boot/367boot.html";

    }


        document.addEventListener("DOMContentLoaded", function() {
             //Vérifier si la valeur "Boot" est présente dans le stockage local
                 var bootValue = localStorage.getItem('Boot');

            if (bootValue && bootValue === "FichierCSS367") {
                    window.location.href = "367boot.html";
            }
            if (bootValue && bootValue === "FichierCSSXP") {
                    window.location.href = "XPboot.html";
            }
            if (bootValue && bootValue === "FichierCSS7") {
                    window.location.href = "7boot.html";
            }
        });

