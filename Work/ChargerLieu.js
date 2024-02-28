
function chargerLieux() {



    const lieuxList = document.getElementById('lieux-list');


    const lieuxEnregistres = localStorage.getItem('lieuxEnregistres') || '';
    const lieuxEnregistresArray = lieuxEnregistres.split(',');


const chronoTabContainer = document.getElementById('ChronoTab').querySelector('.container');


    function parcourirArborescence(arbre, parent, niveau = 0) {
        for (const lieu in arbre) {
            const lieuItem = document.createElement('li');
            const icon = (Object.keys(arbre[lieu]).length > 0) ? '▶' : ' '; // Utilisation de "▶" pour indiquer un élément fermé
            const displayStyle = (niveau === 0) ? 'block' : 'none';

lieuItem.innerHTML = `
    <div class="place-card level-${niveau}" onclick="toggleNiveau(this, ${niveau})">
        <span class="pastille" data-texte="${lieu}" style="display:${displayStyle}">${icon} ${lieu}</span>
<button id="lancer-chrono-btn-${lieu}" data-lieu="${lieu}" onclick="ouvrirIframe('${lieu}')" style="width: 40px; height: 41px; position: absolute; top: -12px; right: -12px; border-radius: 8px; display: block;">
            <img src="chrono.png" alt="Icône chrono" style="width: 20px; height: 20px; position: absolute; bottom: 10px; right: 9px;">
        </button>
        <div class="iframe-container" id="iframe-container-${lieu}"></div>
    </div>`;


            parent.appendChild(lieuItem);

            const option = document.createElement('option');
            option.value = lieu;
            option.textContent = lieu;
 

            if (Object.keys(arbre[lieu]).length > 0) {
                const sousLieuxList = document.createElement('ul');
                // Ajout de "display: none" pour que la sous-liste soit initialement fermée
                sousLieuxList.style.display = 'none';
                lieuItem.appendChild(sousLieuxList);
                parcourirArborescence(arbre[lieu], sousLieuxList, niveau + 1);
            }
        }
    }

    parcourirArborescence(arborescence, lieuxList, 0);

    // Traitement des lieux enregistrés dans le localStorage

}
function toggleNiveau(element, niveau) {
    const ulElement = element.nextElementSibling;
    if (ulElement) {
        ulElement.style.display = (ulElement.style.display === 'none' || ulElement.style.display === '') ? 'block' : 'none';
        const iconElement = element.querySelector('.pastille');
        const texteElement = iconElement.getAttribute('data-texte');
        iconElement.innerHTML = (ulElement.style.display === 'none') ? '▶ ' + texteElement : '▼ ' + texteElement;

        // Ajoutez une vérification pour désactiver le bouton si le niveau est non cliquable
        const boutonLancerChrono = document.getElementById(`lancer-chrono-btn-${texteElement}`);
        if (boutonLancerChrono && element.classList.contains('non-cliquable')) {
            boutonLancerChrono.disabled = true;
        }

        if (ulElement.style.display === 'block') {
            const sousNiveaux = ulElement.querySelectorAll('.pastille');
            sousNiveaux.forEach(sousNiveau => {
                sousNiveau.style.display = 'block';
                const ulSousNiveau = sousNiveau.nextElementSibling;
                if (ulSousNiveau) {
                    ulSousNiveau.style.display = 'none';
                }
            });
        }
    }
}


let nombreChronosActifs = 0;

function ouvrirIframe(nomLieu) {

    toggleAnimations();

    nombreChronosActifs++;
    const chronoButton = document.getElementById('ChronoButton');
    chronoButton.textContent = `${nombreChronosActifs} Chrono${nombreChronosActifs !== 1 ? 's' : ''}`;


    const notificationMessage = "Chrono en cours sur : " + nomLieu;
    showNotification(notificationMessage, nomLieu);

    
    // Vérifier si une iframe avec la pastille "Actif - " existe déjà
// Récupérer l'état actuel de "TABUL" depuis le localStorage

    Restolieu(nomLieu);



    // Ajouter le titre et l'iframe au conteneur ChronoTab
    ajouterTitreEtIframe(nomLieu);
    dejacrée(nomLieu)

    const boutonLancerChrono = document.getElementById(`lancer-chrono-btn-${nomLieu}`);
if (boutonLancerChrono) {
    boutonLancerChrono.classList.add('non-cliquable');

    // Changer l'image du bouton
    const imageChrono = boutonLancerChrono.querySelector('img');
    if (imageChrono) {
        imageChrono.src = 'loupe.png'; // Remplacez 'nouvelle_image.png' par le chemin de votre nouvelle image
        imageChrono.alt = 'Nouvelle icône chrono'; // Remplacez 'Nouvelle icône chrono' par le nouvel texte alternatif
    }

    // Modifier le contenu de l'attribut "onclick" et mettre en surbrillance le chrono actif
    boutonLancerChrono.setAttribute('onclick', `dejacrée('${nomLieu}')`);
}

}

function dejacrée(nomLieu) {
const tabulValue = localStorage.getItem('TABUL');
if (tabulValue === "true") {
    // Code à exécuter si TABUL est égal à true
} else {
    openTab('Chrono');
}
    // Remplacer les espaces par des traits d'union dans le nom du lieu
    const nomLieuFormatte = nomLieu.toLowerCase().replace(/\s+/g, '-');

    // Construire l'ID de l'iframe avec le nom formaté
    const iframeId = `lieu-${nomLieuFormatte}`;
    const chronoContainer = document.getElementById(iframeId);

    const clignotements = 3;
    let clignotementCount = 0;

    if (chronoContainer) {
        // Fonction pour effectuer un clignotement
        function clignoter() {
            const isActive = chronoContainer.classList.contains('active');

            if (isActive) {
                chronoContainer.classList.remove('active');
            } else {
                chronoContainer.classList.add('active');
            }

            clignotementCount++;

            // Arrêter le clignotement après le nombre spécifié
            if (clignotementCount >= clignotements * 2) {
                clearInterval(clignotementInterval);
                setTimeout(() => {
                    // Retirer la classe active et réinitialiser le style après 1 seconde sans animation de fondu
                    chronoContainer.classList.remove('active');
                    chronoContainer.style.transition = 'none';
                }, 1000);
            }
        }

        // Clignoter toutes les 500 ms
        const clignotementInterval = setInterval(clignoter, 250);

        // Animer le scroll pour amener l'élément dans la vue visible même s'il est déjà visible
        chronoContainer.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
        });
    }
}




function ajouterTitreEtIframe(nomLieu) {
    const chronosContainer = document.getElementById('chronosContainer');

    // Créer un nouveau conteneur div pour le titre et l'iframe
    const groupeContainer = document.createElement('div');
    groupeContainer.setAttribute('id', `lieu-${nomLieu.toLowerCase().replace(/\s+/g, '-')}`); // Remplacer les espaces par des traits d'union
    groupeContainer.setAttribute('class', 'groupe-container'); // Ajouter une classe générale si nécessaire

    // Créer un nouveau conteneur div pour le titre du lieu
    const titreLieuContainer = document.createElement('div');
    titreLieuContainer.setAttribute('class', 'titre-lieu');
    titreLieuContainer.textContent = nomLieu;

    // Créer une nouvelle iframe
    const iframe = document.createElement('iframe');
    iframe.id = `iframe-${nomLieu.replace(/\s+/g, '-')}`; // Remplacer les espaces par des traits d'union
    iframe.src = `chrono.html?lieu=${nomLieu}&theme=${localStorage.getItem('theme')}`;

    // Ajouter le titre et l'iframe au conteneur principal
    groupeContainer.appendChild(titreLieuContainer);
    groupeContainer.appendChild(iframe);

    // Ajouter le conteneur au conteneur ChronoTab
    chronosContainer.appendChild(groupeContainer);



if (groupeContainer) {
    // Effacer le contenu existant


    // Ajouter l'iframe à l'élément parent
    groupeContainer.appendChild(iframe);

    // Envoyer un message à toutes les iframes imbriquées
    const iframesImbriquées = document.querySelectorAll('iframe');
    for (let i = 0; i < iframesImbriquées.length; i++) {
        if (iframesImbriquées[i] !== iframe) {
            iframesImbriquées[i].contentWindow.postMessage('NouvelleIframeCréée', '*');
        }
    }
}

}



// Fonction pour basculer les animations en fonction de l'attribut 'annim'
function toggleAnimations() {
    const chronoButton = document.getElementById('ChronoButton');
    const annimValue = chronoButton.getAttribute('annim');

    if (annimValue === 'true') {
        activateAnimations();
    } else {
        deactivateAnimations();
        chronoButton.setAttribute('annim', 'true'); // Mettre annim à true
    }
}


// Appel initial pour déterminer l'état des animations lors du chargement de la page

function activateAnimations() {
    const chronoButton = document.getElementById('ChronoButton');
    chronoButton.classList.add('active');
}

// Fonction pour désactiver les animations
function deactivateAnimations() {
    const chronoButton = document.getElementById('ChronoButton');
    chronoButton.classList.remove('active');
}