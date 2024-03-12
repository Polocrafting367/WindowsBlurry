// Ajoutez cet événement au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    // Appelez updateLabels pour restaurer les valeurs lors du chargement de la page
    updateLabels();

    // Restaurer les valeurs des labels depuis le localStorage
    restoreLabelsFromLocalStorage();
    restoreStartWeek();
generateImage() ;
});


var letters = ['M', 'J', 'S', 'N', 'CA', 'RTT'];

function generateImage() {
    var month = document.getElementById('month').value;

    // Définir la taille de la toile initiale
    var initialCanvasWidth = 200;
    var initialCanvasHeight = 200;

    var canvas = document.createElement('canvas');
    canvas.width = 200; // Nouvelle largeur de la toile
    canvas.height = 200; // Nouvelle hauteur de la toile
    var context = canvas.getContext('2d');

    // Calculer les facteurs d'échelle pour ajuster la taille des éléments
    var scaleX = canvas.width / initialCanvasWidth;
    var scaleY = canvas.height / initialCanvasHeight;

    context.fillStyle = '#FFFFFF';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Ajuster la taille de la police en fonction des facteurs d'échelle
    context.font = '14px Arial';
    context.font = (14 * scaleX) + 'px Arial';

    context.fillStyle = '#000000';
    context.fillText(month, 70 * scaleX, 20 * scaleY); // Ajuster les positions en fonction des facteurs d'échelle

    updateSavedValues();

    var savedValuesTable = document.getElementById('savedValuesTable');
    var savedValuesHeader = document.getElementById('savedValuesHeader');
    var savedValuesBody = document.getElementById('savedValuesBody');
    var savedValuesTableHeight = savedValuesTable.offsetHeight;

    // Définir la taille des carrés initiaux
    var initialSquareWidth = 40;
    var initialSquareHeight = 22;

    // Définir l'espace entre les carrés
    var spacing = 0;

    for (var i = 0; i < savedValuesBody.children.length; i++) {
        for (var j = 0; j < savedValuesBody.children[i].children.length; j++) {
            var selectValue = savedValuesBody.children[i].children[j].textContent;
            var isWeekNumber = !isNaN(selectValue);

            var bgColor, textColor;

            if (isWeekNumber) {
                bgColor = '#000000';
                textColor = '#FFFFFF';
            } else {
                bgColor = getBackgroundColor(selectValue);
                textColor = getTextColor(bgColor, selectValue);
            }

            // Utiliser les mêmes coordonnées que pour les en-têtes, mais ajuster la taille des éléments
            var x = 20 * scaleX + j * (initialSquareWidth * scaleX + spacing);
            var y = 30 * scaleY + i * (initialSquareHeight * scaleY + spacing);

            context.strokeStyle = '#000000';
            context.lineWidth = 2;
            context.strokeRect(x, y, initialSquareWidth * scaleX, initialSquareHeight * scaleY);

            context.fillStyle = bgColor;
            context.fillRect(x, y, initialSquareWidth * scaleX, initialSquareHeight * scaleY);

            context.fillStyle = textColor;
            context.font = 'bold ' + (14 * scaleX) + 'px Arial'; // Ajuster la taille de la police

            var textX = x + (initialSquareWidth * scaleX - context.measureText(selectValue).width) / 2;
            var textY = y + (initialSquareHeight * scaleY + (14 * scaleX)) / 2;

            context.fillText(selectValue, textX, textY);
        }
    }



var customText = "M: 5h30 - 13h     J: 8h30 - 16h\nS: 12h - 19h30    N: 18h30 - 3h";
context.fillStyle = '#000000'; // Couleur du texte

// Ajuster la taille de la police en fonction des facteurs d'échelle
context.font = 'bold ' + (12 * scaleX) + 'px Arial'; 

// Diviser le texte en lignes séparées
var lines = customText.split('\n');

// Calculer la position du texte pour le centrer horizontalement
var customTextX = 20 * scaleX; // Ajuster les marges horizontales en fonction des facteurs d'échelle

// Ajuster la hauteur de départ du texte en fonction de la quantité d'espace vertical supplémentaire
var customTextY = (canvas.height - 20 * scaleY); // Ajuster la position verticale en fonction des facteurs d'échelle

// Ajuster la hauteur de chaque ligne de texte par rapport à l'image
var lineHeight = 16 * scaleY; // Ajuster la hauteur de ligne en fonction des facteurs d'échelle

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
                    return '#FFCCCC'; // Rouge pour le matin
                case 'J':
                    return '#FF0000'; // Gris clair pour la journée
                case 'S':
                    return '#BB0000'; // Blanc pour le soir
                case 'N':
                    return '#550000'; // Noir pour la nuit
                                    case 'CA':
                    return '#AAA'; // Noir pour la nuit
                                    case 'RTT':
                    return '#AAA'; // Noir pour la nuit
                default:
                    return '#FFFFFF'; // Blanc par défaut
            }
        }

function getTextColor(bgColor, option) {
    if (option === 'CA' || option === 'RTT') {
        return '#000000'; // Forcer le texte en noir pour 'CA' et 'RTT'
    }

    var hex = bgColor.slice(1);
    var r = parseInt(hex.substring(0, 2), 16);
    var g = parseInt(hex.substring(2, 4), 16);
    var b = parseInt(hex.substring(4, 6), 16);
    var brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#FFFFFF';
}
function updateLabels() {
    var startWeekInput = document.getElementById('startWeek');


    var labelContainer = document.getElementById('labelContainer');
    var selectContainer = document.getElementById('selectContainer');
    labelContainer.innerHTML = '';
    selectContainer.innerHTML = '';

    for (var i = 0; i < 12; i++) {
        var label = document.createElement('label');
        label.textContent = startWeekInput.value ? (parseInt(startWeekInput.value) + i) + ': ' : ''; // Ajout du numéro de semaine avec un deux-points
        label.id = 'weekLabel' + i;
        labelContainer.appendChild(label);

        var select = document.createElement('select');
        select.id = 'select' + i;
        var selectedOption = localStorage.getItem('selectValue' + i);

        // Restaure la valeur de l'option sélectionnée
        if (selectedOption) {
            select.value = selectedOption;
        }

        for (var j = 0; j < letters.length; j++) {
            var option = document.createElement('option');
            option.value = letters[j];
            option.textContent = letters[j];
            select.appendChild(option);
        }
        selectContainer.appendChild(select);
    }
}

function saveLabelsToLocalStorage() {
    var labels = {};
    for (var i = 0; i < 12; i++) {
        var select = document.getElementById('select' + i);
        labels['select' + i] = select.value;
    }

    localStorage.setItem('labels', JSON.stringify(labels));
}

// Appelez cette fonction à un autre endroit pour restaurer la valeur startWeek
function restoreStartWeek() {
    var startWeekInput = document.getElementById('startWeek');
    var startWeekValue = localStorage.getItem('startWeekValue');

    // Restaure la valeur de l'input startWeek
    if (startWeekValue) {
        startWeekInput.value = startWeekValue;
    }
}

document.getElementById('selectContainer').addEventListener('change', function() {
    // Enregistrez les nouvelles valeurs des labels dans le localStorage
    saveLabelsToLocalStorage();
});

function restoreLabelsFromLocalStorage() {
    var savedLabels = localStorage.getItem('labels');
    if (savedLabels) {
        savedLabels = JSON.parse(savedLabels);
        for (var i = 0; i < 12; i++) {
            var select = document.getElementById('select' + i);
            if (select && savedLabels['select' + i]) {
                select.value = savedLabels['select' + i];
            }
        }
    }
}


// Mettez à jour le localStorage lors de tout changement
function updateLocalStorage() {
    var startWeekInput = document.getElementById('startWeek');
    var startWeekValue = startWeekInput.value;

    // Sauvegarde la valeur de l'input startWeek
    if (startWeekValue) {
        localStorage.setItem('startWeekValue', startWeekValue);
    }

    for (var i = 0; i < 12; i++) {
        var select = document.getElementById('select' + i);
        var selectValue = select.value;

        // Sauvegarde la valeur de l'option sélectionnée
        if (selectValue) {
            localStorage.setItem('selectValue' + i, selectValue);
        }
    }
}

// Attachez la fonction updateLocalStorage à l'événement d'entrée de l'input startWeek
document.getElementById('startWeek').addEventListener('input', function() {
    updateLabels();
    updateLocalStorage();
});

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

function generateAndDownloadImage() {
    generateImage(); // Appeler la fonction de génération d'image
   // Récupère l'élément img
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');

    // Récupère l'élément img
    var img = document.getElementById('generatedImage');

    // Ajuste la taille du canvas à celle de l'image
    canvas.width = img.width;
    canvas.height = img.height;

    // Dessine l'image sur le canvas
    context.drawImage(img, 0, 0, img.width, img.height);

    // Télécharge l'image depuis le canvas
    var link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'image.png';
    link.click();
}
