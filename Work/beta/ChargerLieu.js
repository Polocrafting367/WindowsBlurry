
function chargerLieux() {
    const lieuxList = document.getElementById('lieux-list');
    const lieuxDropdown = document.getElementById('lieuxDropdown');

    const lieuxEnregistres = localStorage.getItem('lieuxEnregistres') || '';
    const lieuxEnregistresArray = lieuxEnregistres.split(',');

    lieuxList.innerHTML = '';

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
            lieuxDropdown.appendChild(option);

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

    const notificationMessage = "Chrono en cours sur : " + nomLieu;
    showNotification(notificationMessage, nomLieu);

    // Vérifier si une iframe avec la pastille "Actif - " existe déjà
    Restolieu(nomLieu);

    // Ajouter le titre et l'iframe au conteneur ChronoTab
    ajouterTitreEtIframe(nomLieu);




const niveauNonCliquable = true; // Remplacez par votre condition pour déterminer si le niveau est non cliquable
const boutonLancerChrono = document.getElementById(`lancer-chrono-btn-${nomLieu}`);

if (boutonLancerChrono && niveauNonCliquable) {
    boutonLancerChrono.classList.add('non-cliquable');
    boutonLancerChrono.disabled = true; // Ajoutez l'attribut disabled pour rendre le bouton non cliquable
}


}




function ajouterTitreEtIframe(nomLieu) {
    const chronosContainer = document.getElementById('chronosContainer');

    // Créer un nouveau conteneur div pour le titre et l'iframe
    const groupeContainer = document.createElement('div');
    groupeContainer.classList.add('groupe-container');

    // Créer un nouveau conteneur div pour le titre du lieu
    const titreLieuContainer = document.createElement('div');
    titreLieuContainer.classList.add('titre-lieu');
    titreLieuContainer.textContent = nomLieu;

    // Créer une nouvelle iframe
    const iframe = document.createElement('iframe');
    iframe.name = `iframe-${nomLieu}`;
    iframe.src = `chrono.html?lieu=${nomLieu}`;

    // Ajouter le titre et l'iframe au conteneur principal
    groupeContainer.appendChild(titreLieuContainer);
    groupeContainer.appendChild(iframe);

    // Ajouter le conteneur au conteneur ChronoTab
    chronosContainer.appendChild(groupeContainer);


   const chronoButton = document.getElementById('ChronoButton');

    if (chronoButton) {
        chronoButton.textContent = `${nombreChronosActifs} Chrono Actif${nombreChronosActifs !== 1 ? 's' : ''}`;
    
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