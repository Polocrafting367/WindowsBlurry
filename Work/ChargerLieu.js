
function chargerLieux() {
    const lieuxList = document.getElementById('lieux-list');
    const lieuxDropdown = document.getElementById('lieuxDropdown');

    const lieuxEnregistres = localStorage.getItem('lieuxEnregistres') || '';
    const lieuxEnregistresArray = lieuxEnregistres.split(',');

    lieuxList.innerHTML = '';



    function parcourirArborescence(arbre, parent, niveau = 0) {
        for (const lieu in arbre) {
            const lieuItem = document.createElement('li');
            const icon = (Object.keys(arbre[lieu]).length > 0) ? '▶' : ' '; // Utilisation de "▶" pour indiquer un élément fermé
            const displayStyle = (niveau === 0) ? 'block' : 'none';
            lieuItem.innerHTML = `<div class="place-card level-${niveau}" onclick="toggleNiveau(this, ${niveau})">
                                    <span class="pastille" data-texte="${lieu}" style="display:${displayStyle}">${icon} ${lieu}</span>
                                      <button class="lancer-chrono-btn" onclick="ouvrirIframe('${lieu}')" style="width: 40px; height: 41px; position: absolute; top: -12px; right: -12px;     border-radius: 8px;">
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



function ouvrirIframe(nomLieu) {
    console.log('Clic sur le bouton pour ouvrir l\'iframe');

    const notificationMessage = "Chrono en cours sur : " + nomLieu;
    showNotification(notificationMessage, nomLieu);

    // Vérifier si une iframe avec la pastille "Actif - " existe déjà
    const pastille = document.querySelector(`[data-texte="${nomLieu}"]`);

    if (pastille && (pastille.innerHTML.trim() === `Actif - ${nomLieu}` || pastille.innerHTML.trim() === `▼ Actif - ${nomLieu}`)) {
        return;
    }
    // Créer une nouvelle iframe
    const iframe = document.createElement('iframe');

    // Définir le nom de l'iframe en lien avec le lieu
    iframe.name = `iframe-${nomLieu}`;

    // Concaténer le nom du lieu à l'URL
    iframe.src = `chrono.html?lieu=${nomLieu}`;

    const iframeContainer = document.getElementById(`iframe-container-${nomLieu}`);

    Restolieu(nomLieu);

    if (pastille) {
        // Ajouter "Actif - " suivi du nom du lieu au contenu de la pastille
        pastille.innerHTML = `▼ Actif - <span class="pastille" data-texte="${nomLieu}" style="display:none">${nomLieu}</span>`;
        pastille.dataset.active = "true"; // Marquer la pastille comme active
    }

    if (iframeContainer) {
        // Effacer le contenu existant
        iframeContainer.innerHTML = '';

        // Ajouter l'iframe à l'élément parent
        iframeContainer.appendChild(iframe);

        // Envoyer un message à toutes les iframes imbriquées
        const iframesImbriquées = document.querySelectorAll('iframe');
        for (let i = 0; i < iframesImbriquées.length; i++) {
            if (iframesImbriquées[i] !== iframe) {
                iframesImbriquées[i].contentWindow.postMessage('NouvelleIframeCréée', '*');
            }
        }
    } else {
        console.error(`Le conteneur iframe-container-${nomLieu} n'a pas été trouvé.`);
    }
}


