


window.addEventListener('message', function(event) {
    // Vérifier si l'origine du message est autorisée, si nécessaire
    // if (event.origin !== 'http://exemple.com') return;

    const iframeData = event.data;

    if (iframeData.type === 'enregistrement') {
        const enregistrementsDiv = document.getElementById('enregistrements');
        let enregistrements = JSON.parse(getPrefixedItem('enregistrements')) || [];

        // Ajouter le nouvel enregistrement à la liste
        enregistrements.push(ajouterInformationsSupplementaires(iframeData.data));
        // Mettre à jour le stockage local avec la liste mise à jour
        setPrefixedItem('enregistrements', JSON.stringify(enregistrements));

        // Vérification de la variable TABUL dans le localStorage
        const tabulValue = getPrefixedItem('TABUL');
        if (tabulValue === "true") {
            // Code à exécuter si TABUL est égal à true
        } else {
            setTimeout(function () {
                openTab('interventions');
            }, 100);
        }

    } else if (iframeData.type === 'fermer') {
        // Recherche de l'iframe à l'intérieur de laquelle l'événement a été déclenché
        const iframeId = `iframe-${iframeData.data.replace(/\s+/g, '-')}`;
        const iframeASupprimer = document.getElementById(iframeId);

        const boutonLancerChrono = document.getElementById(`lancer-chrono-btn-${iframeData.data}`);
        if (boutonLancerChrono) {
            boutonLancerChrono.classList.remove('non-cliquable');

            // Changer l'image du bouton
            const imageChrono = boutonLancerChrono.querySelector('img');
            if (imageChrono) {
                imageChrono.src = 'chrono.png'; // Remplacer par l'image d'origine
                imageChrono.alt = 'Icône chrono'; // Texte alternatif pour l'image
            }

            // Modifier le contenu de l'attribut "onclick" pour revenir à la fonction d'origine
            boutonLancerChrono.setAttribute('onclick', `ouvrirIframe('${iframeData.data.replace(/-/g, ' ')}')`);

            // Réactiver les boutons de préconfiguration associés
            const preconfButtons = document.querySelectorAll(`[id^="relancer-preconf-btn-${iframeData.data}"]`);
            preconfButtons.forEach(button => {
                button.classList.remove('button-grise'); // Retire la classe qui grise les boutons
                button.disabled = false; // Réactive les boutons
            });
        }

        if (iframeASupprimer) {
            // Supprimer le conteneur lié à l'iframe
            const groupeContainer = iframeASupprimer.parentNode;
            if (groupeContainer) {
                supprimerRestolieu(iframeData.data);

                // Supprimer le conteneur
                groupeContainer.remove();

                nombreChronosActifs--;
                const chronoButton = document.getElementById('ChronoButton');
                chronoButton.textContent = `${nombreChronosActifs} Chrono${nombreChronosActifs !== 1 ? 's' : ''}`;

                // Supprimer l'iframe
                iframeASupprimer.remove();
            }
        }
    }     else if (iframeData.type === 'rename2') {
        // Récupérer les données du message rename2
        const [nouveauLieu, tempsAffiche, lieu, zoneTexteValue, zonePiecesValue, typeValue, causeValue, tempsArretValue] = iframeData.data.split(' - ');

        // Supprimer l'ancienne div correspondante
        gererFermetureIframe(lieu);

        // Relancer ouvrirIframe avec les nouvelles données
        ouvrirIframe(nouveauLieu, tempsAffiche, zoneTexteValue, "", typeValue, causeValue,  tempsArretValue);
    }


});

function gererFermetureIframe(lieu) {
    // Recherche de l'iframe à l'intérieur de laquelle l'événement a été déclenché
    const iframeId = `iframe-${lieu.replace(/\s+/g, '-')}`;
    const iframeASupprimer = document.getElementById(iframeId);

    const boutonLancerChrono = document.getElementById(`lancer-chrono-btn-${lieu}`);
    if (boutonLancerChrono) {
        boutonLancerChrono.classList.remove('non-cliquable');

        // Changer l'image du bouton
        const imageChrono = boutonLancerChrono.querySelector('img');
        if (imageChrono) {
            imageChrono.src = 'chrono.png'; // Remplacer par l'image d'origine
            imageChrono.alt = 'Icône chrono'; // Texte alternatif pour l'image
        }

        // Modifier le contenu de l'attribut "onclick" pour revenir à la fonction d'origine
        boutonLancerChrono.setAttribute('onclick', `ouvrirIframe('${lieu.replace(/-/g, ' ')}')`);

        // Réactiver les boutons de préconfiguration associés
        const preconfButtons = document.querySelectorAll(`[id^="relancer-preconf-btn-${lieu}"]`);
        preconfButtons.forEach(button => {
            button.classList.remove('button-grise'); // Retire la classe qui grise les boutons
            button.disabled = false; // Réactive les boutons
        });
    }

    if (iframeASupprimer) {
        // Supprimer le conteneur lié à l'iframe
        const groupeContainer = iframeASupprimer.parentNode;
        if (groupeContainer) {
            supprimerRestolieu(lieu);

            // Supprimer le conteneur
            groupeContainer.remove();

            nombreChronosActifs--;
            const chronoButton = document.getElementById('ChronoButton');
            chronoButton.textContent = `${nombreChronosActifs} Chrono${nombreChronosActifs !== 1 ? 's' : ''}`;

            // Supprimer l'iframe
            iframeASupprimer.remove();
        }
    }
}


function ouvrirBranchesPourLieu(lieu) {
    const lieuxList = document.getElementById('lieux-list');
    const lieuxItems = lieuxList.querySelectorAll('.place-card');

    // Parcourir la liste des lieux pour trouver celui correspondant à l'iframe
    for (const lieuItem of lieuxItems) {
        const lieuName = lieuItem.querySelector('.pastille').getAttribute('data-texte');

        if (lieu === lieuName) {
            // Ouvrir les branches jusqu'à cet élément
            let parent = lieuItem.parentElement;
            while (parent && parent !== lieuxList) {
                if (parent.tagName === 'UL') {
                    parent.style.display = 'block';
                }
                parent = parent.parentElement;
            }
            break; // Sortir de la boucle dès qu'on trouve le lieu correspondant
        }
    }
}

setTimeout(chargerIframesDepuisLocalStorage, 100);




function chargerIframesDepuisLocalStorage() {
    // Récupérer la liste des lieux depuis le localStorage
    const listeEnregistree = JSON.parse(getPrefixedItem('maListe')) || [];

    // Parcourir la liste des lieux et ouvrir une iframe pour chacun
    for (const lieu of listeEnregistree) {
        ouvrirIframe(lieu);
        ouvrirBranchesPourLieu(lieu);
    }

    // Ouvrir l'onglet "Créer" par défaut si la liste est vide
    if (listeEnregistree.length === 0) {
        openTab('creer');
           const chronoButton = document.getElementById('ChronoButton');
    const currentAnnimValue = chronoButton.getAttribute('annim');
    const newAnnimValue = 'true' ;
    chronoButton.setAttribute('annim', newAnnimValue);


    }
}

function ouvrirIframe(nomLieu, temps, liste1, liste2, Text1, Text2, arret) {
    toggleAnimations();

    nombreChronosActifs++;
    const chronoButton = document.getElementById('ChronoButton');
    chronoButton.textContent = `${nombreChronosActifs} Chrono${nombreChronosActifs !== 1 ? 's' : ''}`;

    Restolieu(nomLieu);

    ajouterTitreEtIframe(nomLieu, temps, liste1, liste2, Text1, Text2, arret);

    dejaCree(nomLieu);

    const boutonLancerChrono = document.getElementById(`lancer-chrono-btn-${nomLieu}`);
    if (boutonLancerChrono) {
        boutonLancerChrono.classList.add('non-cliquable');

        const imageChrono = boutonLancerChrono.querySelector('img');
        if (imageChrono) {
            imageChrono.src = 'loupe.png';
            imageChrono.alt = 'Nouvelle icône chrono';
        }

        boutonLancerChrono.setAttribute('onclick', `dejaCree('${nomLieu}')`);

        // Désactiver tous les boutons de préconfiguration pour ce lieu
        const preconfButtons = document.querySelectorAll(`[id^="relancer-preconf-btn-${nomLieu}"]`);
        preconfButtons.forEach(button => {
            button.classList.add('button-grise'); // Ajoute la classe qui grise les boutons
            button.disabled = true; // Désactive les boutons
        });
    }
}


function dejaCree(nomLieu) {
    const tabulValue = getPrefixedItem('TABUL');
    if (tabulValue === "true") {
        // Code à exécuter si TABUL est égal à true
    } else {
        openTab('Chrono');
    }

    const chronoContainer = document.getElementById(`lieu-${nomLieu.toLowerCase().replace(/\s+/g, '-')}`);

    const clignotements = 3;
    let clignotementCount = 0;

    if (chronoContainer) {
        function clignoter() {
            const isActive = chronoContainer.classList.contains('active');

            if (isActive) {
                chronoContainer.classList.remove('active');
            } else {
                chronoContainer.classList.add('active');
            }

            clignotementCount++;

            if (clignotementCount >= clignotements * 2) {
                clearInterval(clignotementInterval);
                setTimeout(() => {
                    chronoContainer.classList.remove('active');
                    chronoContainer.style.transition = 'none';
                }, 1000);
            }
        }

        const clignotementInterval = setInterval(clignoter, 250);

        chronoContainer.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
        });
    }
}

function ajouterTitreEtIframe(nomLieu, temps, liste1, liste2, Text1, Text2, arret) {
    const chronosContainer = document.getElementById('chronosContainer');

    const groupeContainer = document.createElement('div');
    groupeContainer.setAttribute('id', `lieu-${nomLieu.toLowerCase().replace(/\s+/g, '-')}`);
    groupeContainer.setAttribute('class', 'groupe-container');

    const titreLieuContainer = document.createElement('div');
    titreLieuContainer.setAttribute('class', 'titre-lieu');
    titreLieuContainer.textContent = nomLieu;

    // Ajouter le bouton "Modifier"
    const modifierButton = document.createElement('button');
    modifierButton.textContent = "Modifier";
    modifierButton.addEventListener('click', () => {
        // Ouvrir la modal ici
        ouvrirModalModifierLieu(nomLieu);
    });

    // Ajouter le bouton "Modifier" à côté du titre
    titreLieuContainer.appendChild(modifierButton);

    const iframe = document.createElement('iframe');
    iframe.id = `iframe-${nomLieu.replace(/\s+/g, '-')}`;
    
    let url = `chrono.html?lieu=${nomLieu}&theme=${getPrefixedItem('theme')}`;

    if (temps) {
        url += `&temps=${temps}&liste1=${liste1}&liste2=${liste2}&Text1=${Text1}&Text2=${Text2}&arret=${arret}`;
    }

    iframe.src = url;

    groupeContainer.appendChild(titreLieuContainer);
    groupeContainer.appendChild(iframe);

    chronosContainer.appendChild(groupeContainer);

    if (groupeContainer) {
        const iframesImbriquées = document.querySelectorAll('iframe');
        for (let i = 0; i < iframesImbriquées.length; i++) {
            if (iframesImbriquées[i] !== iframe) {
                iframesImbriquées[i].contentWindow.postMessage('NouvelleIframeCréée', '*');
            }
        }
    }
}



function toggleAnimations() {
    const chronoButton = document.getElementById('ChronoButton');
    const annimValue = chronoButton.getAttribute('annim');

    if (annimValue === 'true') {
        activateAnimations();
    } else {
        deactivateAnimations();
        chronoButton.setAttribute('annim', 'true');
    }
}

function activateAnimations() {
    const chronoButton = document.getElementById('ChronoButton');
    chronoButton.classList.add('active');
}

function deactivateAnimations() {
    const chronoButton = document.getElementById('ChronoButton');
    chronoButton.classList.remove('active');
}

function Restolieu(nomLieu) {
    // Récupérer la liste actuelle depuis le localStorage
    let listeEnregistree = JSON.parse(getPrefixedItem('maListe')) || [];

    // Vérifier si le lieu existe déjà dans la liste
    if (!listeEnregistree.includes(nomLieu)) {
        // Ajouter le nouveau lieu à la liste
        listeEnregistree.push(nomLieu);

        // Enregistrer la liste mise à jour dans le localStorage
        setPrefixedItem('maListe', JSON.stringify(listeEnregistree));

    } else {

    }
}

function supprimerRestolieu(lieuASupprimer) {
    // Vérifier si iframeData.data est un tableau

    let listeEnregistree = JSON.parse(getPrefixedItem('maListe')) || [];

    // Vérifier si le lieu existe dans la liste
    let index = listeEnregistree.indexOf(lieuASupprimer);
    if (index !== -1) {
        // Supprimer le lieu de la liste
        listeEnregistree.splice(index, 1);

        // Enregistrer la liste mise à jour dans le localStorage
        setPrefixedItem('maListe', JSON.stringify(listeEnregistree));


    } else {

    }
}

