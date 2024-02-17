const initialRowColors = [getRandomColor(), getRandomColor(), getRandomColor()];
let initialColumnColors = [getRandomColor(), getRandomColor(), getRandomColor()];

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}



let level = 1; // Niveau initial
let gridSize = 3; // Taille initiale de la grille (3x3)

updateCubeSize();

function updateCubeSize() {
    // Augmente la taille de la grille

    // Génère de nouvelles couleurs pour toutes les lignes
    const newColors = Array.from({ length: gridSize }, getRandomColor);

    // Met à jour les couleurs des lignes
    initialRowColors.splice(0, gridSize, ...newColors);

    // Génère de nouvelles couleurs pour toutes les colonnes
    const newColumnColors = Array.from({ length: gridSize }, getRandomColor);
    initialColumnColors = newColumnColors;

    updateCube(); // Met à jour la taille du cube et des boutons
    updateStyles();
    fillUpperCube();


}




function generateCubeContainer(container, gridSize, isUpperCube = false) {
    container.innerHTML = '';

    for (let i = 0; i < gridSize; i++) {
        const rowOrColumn = document.createElement('div');
        rowOrColumn.className = 'row-or-column';

        for (let j = 0; j < gridSize; j++) {
            const cell = document.createElement('div');
            cell.className = `cell ${isUpperCube ? 'upper-cube-cell' : ''}`;
            rowOrColumn.appendChild(cell);
        }

        container.appendChild(rowOrColumn);
    }
}

function updateCube() {
  const cubeContainer = document.getElementById('cube-container');
    const upperCubeContainer = document.getElementById('upper-cube-container');
    const columnButtonsContainer = document.getElementById('column-buttons-container');


   if (cubeContainer) generateCubeContainer(cubeContainer, gridSize);
    if (upperCubeContainer) generateCubeContainer(upperCubeContainer, gridSize, true);
    if (columnButtonsContainer) {
        columnButtonsContainer.innerHTML = ''; // Efface le contenu actuel

        for (let i = 0; i < gridSize; i++) {
            const columnButton = document.createElement('button');
            columnButton.className = 'column-button';
            columnButton.textContent = `Column ${i + 1}`;
            // Assigne la couleur initiale ou génère une nouvelle couleur
            columnButton.style.backgroundColor = i < initialColumnColors.length
                ? initialColumnColors[i]
                : getRandomColor();
            columnButton.onclick = () => fillColumn(i);
            columnButtonsContainer.appendChild(columnButton);
        }
    }


    const rowButtonsContainer = document.getElementById('row-buttons-container');
 if (rowButtonsContainer) {
        rowButtonsContainer.innerHTML = ''; // Efface le contenu actuel

        for (let i = 0; i < gridSize; i++) {
            const rowButton = document.createElement('button');
            rowButton.className = 'row-button';
            rowButton.textContent = `Row ${i + 1}`;
            // Assigne la couleur initiale ou génère une nouvelle couleur
            rowButton.style.backgroundColor = i < initialRowColors.length
                ? initialRowColors[i]
                : getRandomColor();
            rowButton.onclick = () => fillRow(i);
            rowButtonsContainer.appendChild(rowButton);
        }
    }


    // Met à jour la taille du cube principal
    cubeContainer.innerHTML = ''; // Efface le contenu actuel
for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cubeContainer.appendChild(cell);
    }
}

    // Met à jour la taille de la zone supérieure
    upperCubeContainer.innerHTML = ''; // Efface le contenu actuel

    for (let i = 0; i < gridSize; i++) {
        const rowOrColumn = document.createElement('div');
        rowOrColumn.className = 'row-or-column';

        for (let j = 0; j < gridSize; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell upper-cube-cell';
            rowOrColumn.appendChild(cell);
        }

        upperCubeContainer.appendChild(rowOrColumn);
    }

    // Met à jour le nombre de boutons pour les colonnes
    columnButtonsContainer.innerHTML = ''; // Efface le contenu actuel

    for (let i = 0; i < gridSize; i++) {
        const columnButton = document.createElement('button');
        columnButton.className = 'column-button';
        columnButton.textContent = `Column ${i + 1}`;
        columnButton.style.backgroundColor = initialColumnColors[i];
        columnButton.onclick = () => fillColumn(i);
        columnButtonsContainer.appendChild(columnButton);
    }

    // Met à jour le nombre de boutons pour les lignes
    rowButtonsContainer.innerHTML = ''; // Efface le contenu actuel

    for (let i = 0; i < gridSize; i++) {
        const rowButton = document.createElement('button');
        rowButton.className = 'row-button';
        rowButton.textContent = `Row ${i + 1}`;
        rowButton.style.backgroundColor = initialRowColors[i];
        rowButton.onclick = () => fillRow(i);
        rowButtonsContainer.appendChild(rowButton);
    }
}


function checkEquality() {
    const cubeCells = cubeContainer.querySelectorAll('.cell');
    const upperCubeCells = upperCubeContainer.querySelectorAll('.upper-cube-cell');

    const gridSize = Math.sqrt(cubeCells.length);

    for (let i = 0; i < gridSize; i++) {
        // Vérifiez la première ligne du cube principal avec la première colonne du cube supérieur
        const cellIndex = i;
        const cubeColor = cubeCells[cellIndex].style.backgroundColor;
        const upperCubeColor = upperCubeCells[i * gridSize].style.backgroundColor;

        if (cubeColor !== upperCubeColor) {
            return false; // S'il y a une différence, les cubes ne sont pas identiques
        }
    }

    return true; // Toutes les couleurs sont identiques
}



// Fonction pour convertir la couleur RGB en format hexadécimal
function rgbToHex(rgb) {
    // Si la couleur est vide, retourne une chaîne vide
    if (!rgb) {
        return '';
    }

    // Extrait les valeurs de rouge, vert et bleu
    const values = rgb.match(/\d+/g);

    // Convertit les valeurs en hexadécimal
    const hex = values.map(val => {
        const hexValue = parseInt(val).toString(16);
        return hexValue.length === 1 ? '0' + hexValue : hexValue;
    });

    // Retourne la couleur hexadécimale
    return '#' + hex.join('');
}



// Fonction pour afficher la popup de félicitation
function showCongratulationsPopup() {
    alert("Félicitations ! Les cubes sont identiques.");
    updateLevelDisplay()
}

function updateLevelDisplay() {
    document.getElementById('current-level').textContent = level;
}

// Logique pour le bouton précédent
document.getElementById('previous-level').addEventListener('click', function() {
    if (level > 1) {
        level--;
        updateLevelDisplay();
         gridSize--;
        updateCubeSize()

    }
});

// Logique pour le bouton suivant
document.getElementById('next-level').addEventListener('click', function() {
    level++;
    updateLevelDisplay();
     gridSize++;
    updateCubeSize()
});



function reload() {
    gridSize++;
    updateCubeSize();
        gridSize--;    
        updateCubeSize();
}

const cubeContainer = document.getElementById('cube-container');
    const upperCubeContainer = document.getElementById('upper-cube-container');

// Modifier les fonctions fillRow et fillColumn pour appeler checkEquality après chaque mise à jour
function fillRow(row) {
    const cells = cubeContainer.querySelectorAll('.cell');
    const color = initialRowColors[row];
    const randomTimes = Math.floor(Math.random() * 5) + 1; // Random number of times to fill

    for (let k = 0; k < randomTimes; k++) {
        for (let i = row * gridSize; i < (row + 1) * gridSize; i++) {
            cells[i].style.backgroundColor = color;
        }
    }

    if (checkEquality()) {
        showCongratulationsPopup();
    }
}


function fillColumn(column) {
    const cells = cubeContainer.querySelectorAll('.cell');

    const color = initialColumnColors[column];
    const randomTimes = Math.floor(Math.random() * 5) + 1; // Random number of times to fill

    for (let k = 0; k < randomTimes; k++) {
        for (let i = column; i < cells.length; i += gridSize) {
            cells[i].style.backgroundColor = color;
        }
    }

    // Appeler la fonction de vérification après chaque mise à jour
    if (checkEquality()) {
        showCongratulationsPopup();
    }
}

function getInitialButtonColors() {


    const columnButtons = document.querySelectorAll('.row-button');
    const rowButtons = document.querySelectorAll('.column-button');


    const initialColors = {
        row: [],
        column: []
    };

    rowButtons.forEach(button => initialColors.row.push(button.style.backgroundColor));
    columnButtons.forEach(button => initialColors.column.push(button.style.backgroundColor));

    return initialColors;
}


function fillUpperCube() {
    const upperCells = document.querySelectorAll('.upper-cube-cell');
    const initialColors = getInitialButtonColors();

    const rowColors = initialColors.row.slice();
    const colColors = initialColors.column.slice();

    const numIterations = Math.max(Math.floor(Math.random() * 30) + 1, 5 * gridSize);

    for (let k = 0; k < numIterations; k++) {
        const isRow = Math.random() < 0.5;
        const randomIndex = Math.floor(Math.random() * gridSize);

        for (let i = 0; i < upperCells.length; i++) {
            const index = isRow ? Math.floor(i / gridSize) : i % gridSize;
            const color = isRow ? rowColors[index] : colColors[index];

            if ((isRow && index === randomIndex) || (!isRow && index === randomIndex)) {
                upperCells[i].style.backgroundColor = color;
            }
        }
    }

    // Vérifier si toutes les cellules ont une couleur assignée
    const isEmpty = Array.from(upperCells).some(cell => cell.style.backgroundColor === "");
    if (isEmpty) {
        // Si une cellule est vide, vous pouvez ajouter un traitement ici
        fillUpperCube();
    }
}


// Appeler la fonction pour remplir le deuxième cube





function isPuzzleSolvable() {
    const initialColors = getInitialButtonColors();
    const rowSums = initialColors.row.map(color => colorToInt(color));
    const columnSums = initialColors.column.map(color => colorToInt(color));

    // Check if the sums of rows and columns are even
    const isSolvable = rowSums.every(sum => sum % 2 === 0) && columnSums.every(sum => sum % 2 === 0);

    return isSolvable;
}

function colorToInt(color) {
    // Convert hexadecimal color to an integer for sum calculation
    return parseInt(color.substr(1), 16);
}

// Function to update styles dynamically
// Function to update styles dynamically
function updateStyles() {
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;

    // Pourcentage de l'écran utilisé pour les cellules et les boutons
    const cellAndButtonPercentage = 1; // Ajustez ce pourcentage en fonction de vos besoins

    // Pourcentage d'espace laissé autour des cellules
    const spaceAroundPercentage = 0; // Ajustez ce pourcentage en fonction de vos besoins

    // Calculer la taille de chaque cellule en pourcentage de la hauteur de l'écran
    const cellPercentage = (cellAndButtonPercentage / gridSize) * (100 / (100 - spaceAroundPercentage));

    // Calculer la taille des boutons en pourcentage de la hauteur de l'écran
    const buttonPercentage = cellPercentage;

    // Calculer le margine en fonction de la taille de la cellule
    const buttonMarginPercentage = 0; // Ajustez ce pourcentage en fonction de vos besoins

    // Calculer la taille totale en pourcentage
    const totalSizePercentage = (gridSize * cellPercentage) + ((gridSize - 1) * buttonMarginPercentage);

    // Calculer le facteur de conversion pour que la taille totale soit égale à 100%
    const conversionFactor = 40 / totalSizePercentage;

    // Mettre à jour le style des boutons
    const buttonElements = document.querySelectorAll('.row-button');
    buttonElements.forEach((button) => {
        button.style.margin = `0`;
        button.style.height = `${cellPercentage * conversionFactor}vh`;
    });
        const buttonElementscolumn = document.querySelectorAll('.column-button');
    buttonElementscolumn.forEach((button) => {
        button.style.margin = `0`;
        button.style.width = `${cellPercentage * conversionFactor}vh`;
    });

    // Mettre à jour le style des cellules
    const cellElements = document.querySelectorAll('.cell, .upper-cube-cell');
    cellElements.forEach((cell) => {
        cell.style.width = `${cellPercentage * conversionFactor}vh`;
        cell.style.height = `${cellPercentage * conversionFactor}vh`;
    });

    // Mettre à jour le nombre de colonnes dans le cube principal
    const cubeContainer = document.getElementById('cube-container');
    cubeContainer.style.gridTemplateColumns = `repeat(${gridSize}, ${cellPercentage * conversionFactor}vh)`;

    // Mettre à jour la grille dans upper-cube-container
    const upperCubeContainer = document.getElementById('upper-cube-container');
    upperCubeContainer.style.gridTemplateColumns = `repeat(${gridSize}, ${cellPercentage * conversionFactor}vh)`;
}






// Call the function initially

// Attach the function to the window resize event
window.addEventListener('resize', updateStyles);
