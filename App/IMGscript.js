       var letters = ['M', 'J', 'S', 'N'];


function generateImage() {
    var month = document.getElementById('month').value;

    var canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200; // Ajustez la hauteur du canevas selon vos besoins
    var context = canvas.getContext('2d');

    context.fillStyle = '#FFFFFF';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.font = '14px Arial';
    context.fillStyle = '#000000';
    context.fillText(month, 70, 20);



    updateSavedValues();

var savedValuesTable = document.getElementById('savedValuesTable');
var savedValuesHeader = document.getElementById('savedValuesHeader');
var savedValuesBody = document.getElementById('savedValuesBody');
var savedValuesTableHeight = savedValuesTable.offsetHeight;

// Définir la largeur et la hauteur des carrés
var squareWidth = 40;
var squareHeight = 22;

// Définir l'espace entre les carrés
var spacing = 0;

for (var i = 0; i < savedValuesBody.children.length; i++) {
    for (var j = 0; j < savedValuesBody.children[i].children.length; j++) {
        var selectValue = savedValuesBody.children[i].children[j].textContent;

        // Vérifier si selectValue est un nombre (numéro de semaine)
        var isWeekNumber = !isNaN(selectValue);

        var bgColor, textColor;

        if (isWeekNumber) {
            // Si c'est un numéro de semaine, appliquer les couleurs appropriées
            bgColor = '#333333'; // Gris foncé pour les numéros de semaine
            textColor = '#FFFFFF'; // Texte blanc
        } else {
            // Si ce n'est pas un numéro de semaine, utiliser les fonctions existantes
            bgColor = getBackgroundColor(selectValue);
            textColor = getTextColor(bgColor);
        }

        // Utilisez les mêmes coordonnées que pour les en-têtes
        var x = 20 + j * (squareWidth + spacing);
        var y = 30 + i * (squareHeight + spacing);

        // Dessiner un contour noir autour du carré
        context.strokeStyle = '#000000'; // Couleur du contour noir
        context.lineWidth = 2; // Épaisseur du contour
        context.strokeRect(x, y, squareWidth, squareHeight);

        // Remplir le carré avec la couleur de fond
        context.fillStyle = bgColor;
        context.fillRect(x, y, squareWidth, squareHeight);

        // Appliquer le style de texte
        context.fillStyle = textColor;
        context.font = 'bold 14px Arial'; // Texte en gras, taille 14px, police Arial

        // Calculer la position du texte pour le centrer
        var textX = x + (squareWidth - context.measureText(selectValue).width) / 2;
        var textY = y + (squareHeight + 14) / 2; // Ajouter la moitié de la hauteur du texte pour le centrer verticalement

        // Dessiner le texte centré
        context.fillText(selectValue, textX, textY);
    }
}

var customText = "M: 5h30 - 13h     J: 8h30 - 16h\nS: 12h - 19h30    N: 18h30 - 3h";
context.fillStyle = '#000000'; // Couleur du texte
context.font = 'bold 12px Arial'; // Texte en gras, taille 12px, police Arial

// Diviser le texte en lignes séparées
var lines = customText.split('\n');

// Calculer la position du texte pour le centrer horizontalement
var customTextX = (canvas.width - context.measureText(lines[0]).width) / 2;

// Ajuster la hauteur de départ du texte en fonction de la quantité d'espace vertical supplémentaire
var customTextY = canvas.height - 20;

// Ajuster la hauteur de chaque ligne de texte par rapport à l'image
var lineHeight = 16;

// Dessiner chaque ligne de texte
for (var i = 0; i < lines.length; i++) {
    context.fillText(lines[i], customTextX, customTextY + (i * lineHeight));
}

// Mettre à jour l'image
document.getElementById('generatedImage').src = canvas.toDataURL();
}










        function getBackgroundColor(time) {
            switch (time) {
                case 'M':
                    return '#FF0000'; // Rouge pour le matin
                case 'J':
                    return '#E0E0E0'; // Gris clair pour la journée
                case 'S':
                    return '#FFFFFF'; // Blanc pour le soir
                case 'N':
                    return '#000000'; // Noir pour la nuit
                default:
                    return '#FFFFFF'; // Blanc par défaut
            }
        }

        function getTextColor(bgColor) {
            var hex = bgColor.slice(1);
            var r = parseInt(hex.substring(0, 2), 16);
            var g = parseInt(hex.substring(2, 4), 16);
            var b = parseInt(hex.substring(4, 6), 16);
            var brightness = (r * 299 + g * 587 + b * 114) / 1000;
            return brightness > 128 ? '#000000' : '#FFFFFF';
        }

        function updateLabels() {
            var startWeek = parseInt(document.getElementById('startWeek').value) || 0;
            var labelContainer = document.getElementById('labelContainer');
            var selectContainer = document.getElementById('selectContainer');
            labelContainer.innerHTML = '';
            selectContainer.innerHTML = '';

            for (var i = 0; i < 12; i++) {
                var label = document.createElement('label');
                label.textContent = startWeek + i;
                label.id = 'weekLabel' + i;
                labelContainer.appendChild(label);

                var select = document.createElement('select');
                select.id = 'select' + i;
                for (var j = 0; j < letters.length; j++) {
                    var option = document.createElement('option');
                    option.value = letters[j];
                    option.textContent = letters[j];
                    select.appendChild(option);
                }
                selectContainer.appendChild(select);
            }
        }

function updateSavedValues() {
    var startWeek = parseInt(document.getElementById('startWeek').value) || 0;
    var savedValuesHeader = document.getElementById('savedValuesHeader');
    var savedValuesBody = document.getElementById('savedValuesBody');
    savedValuesHeader.innerHTML = '';
    savedValuesBody.innerHTML = '';

    // Ajoutez une colonne pour le mois actuel en ligne 1
    var thCurrentMonth = document.createElement('th');

    for (var i = 0; i < 3; i++) {
        // Ajoutez une ligne pour les numéros de semaine
        var weekTr = document.createElement('tr');
        for (var j = 0; j < 4; j++) {
            var thWeek = document.createElement('th');



            var tdWeek = document.createElement('td');
            tdWeek.textContent = startWeek + (i * 4 + j);
            weekTr.appendChild(tdWeek);
        }
        savedValuesBody.appendChild(weekTr);

        // Ajoutez une ligne pour les valeurs des éléments select
        var selectTr = document.createElement('tr');
        for (var j = 0; j < 4; j++) {
            var tdSelect = document.createElement('td');
            var selectElement = document.getElementById('select' + (i * 4 + j));

            // Vérifiez si l'élément existe avant d'accéder à sa propriété 'value'
            if (selectElement !== null) {
                var selectValue = selectElement.value;
                tdSelect.textContent = selectValue;
            }

            selectTr.appendChild(tdSelect);
        }
        savedValuesBody.appendChild(selectTr);
    }
}

