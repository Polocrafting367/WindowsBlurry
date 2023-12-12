document.addEventListener("DOMContentLoaded", function () {
    var typewriterElement = document.getElementById('typewriter');
    var targetElement = document.getElementById('logo');
    var text = typewriterElement.innerHTML;

    // Fonction pour décoder les entités HTML
    function decodeEntities(encodedString) {
        var textArea = document.createElement('textarea');
        textArea.innerHTML = encodedString;
        return textArea.value;
    }

    text = decodeEntities(text);

    // Séparer le texte en lignes en utilisant <br> comme délimiteur
    var lines = text.split('<br>');

    function typeText(lineIndex) {
        if (lineIndex < lines.length) {
            var currentLine = lines[lineIndex];

            // Ajouter la ligne actuelle avec <br> à la fin dans l'élément cible
            targetElement.innerHTML += currentLine + '<br>';

            lineIndex++;

            // Passer à la ligne suivante
            setTimeout(function() {
                typeText(lineIndex);
            }, 10); // Changer la valeur pour ajuster la vitesse de frappe
        }
    }

    // Démarrer l'effet de machine à écrire
    typeText(0);


        document.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            // Appel de la fonction à exécuter lorsque Enter est enfoncé
            executeCode();
        }
    });

    // Fonction à exécuter lorsque Enter est pressé
    function executeCode() {
        localStorage.setItem('Theme', "");
        localStorage.setItem('Boot', "");
        var myTextElement = document.getElementById('entert');
        myTextElement.classList.add('enterPressed');
    }
});

setTimeout(function() {
    var typewriterElement = document.getElementById('typewriter2');
    var targetElement = document.getElementById('indus');
    var text = typewriterElement.innerHTML;

    // Fonction pour décoder les entités HTML
    function decodeEntities2(encodedString) {
        var textArea = document.createElement('textarea');
        textArea.innerHTML = encodedString;
        return textArea.value;
    }

    text = decodeEntities2(text);

    // Séparer le texte en lignes en utilisant <br> comme délimiteur
    var lines = text.split('<br>');

    function typeText(lineIndex) {
        if (lineIndex < lines.length) {
            var currentLine = lines[lineIndex];

            // Ajouter la ligne actuelle avec <br> à la fin dans l'élément cible
            targetElement.innerHTML += currentLine + '<br>';

            lineIndex++;

            // Passer à la ligne suivante
            setTimeout(function() {
                typeText(lineIndex);
            }, 10); // Changer la valeur pour ajuster la vitesse de frappe
        }
    }

    // Démarrer l'effet de machine à écrire
    typeText(0);
}, 400);

setTimeout(function() {
   document.getElementById('logo').style.display = 'none'; 
   document.getElementById('indus').style.display = 'none';
   document.getElementById('entert').style.display = 'none';
}, 2300);

setTimeout(function() {
window.location.href = "../Boot/boot.html";
}, 3000);

