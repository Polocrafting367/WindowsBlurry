window.onload = function() {
    // Fonction pour obtenir les paramètres de l'URL
    function getUrlParams() {
        const params = {};
        const queryString = window.location.search;
        if (queryString) {
            const pairs = queryString.substring(1).split("&");
            for (let i = 0; i < pairs.length; i++) {
                const pair = pairs[i].split("=");
                params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
            }
        }
        return params;
    }

    // Obtenez les paramètres de l'URL
    const params = getUrlParams();

    // Vérifiez si le paramètre 'user' est présent
    if (!params.user) {
        // Si le paramètre 'user' est absent, rediriger ou afficher un message
        alert("Nom d'utilisateur manquant dans l'URL !");
        window.location.href = '../log/index.html';
    } else {
        console.log("Utilisateur:", params.user);
        // Exécutez votre code normalement
    }
};

function chargerLieux() {
    const lieuxList = document.getElementById('lieux-list');
    const lieuxEnregistres = localStorage.getItem('lieuxEnregistres') || '';
    const lieuxEnregistresArray = lieuxEnregistres.split(',');

    const chronoTabContainer = document.getElementById('ChronoTab').querySelector('.container');

    function parcourirArborescence(arbre, parent, cheminParent = '', niveau = 0) {
        for (const lieu in arbre) {
            // Formater le chemin complet sans les numéros de ligne ni les '>'
            const cheminComplet = cheminParent + (cheminParent ? ' > ' : '') + lieu;

            // Utiliser directement le nom du lieu
            const nomLieuBrut = lieu.trim();

            const lieuItem = document.createElement('li');
            const icon = (Object.keys(arbre[lieu]).length > 0) ? '▶' : ' ';
            const displayStyle = (niveau === 0) ? 'block' : 'none';

            lieuItem.innerHTML = `
                <div class="place-card level-${niveau}" onclick="toggleNiveau(this, ${niveau})">
                    <span class="pastille" data-texte="${nomLieuBrut}" style="display:${displayStyle}">${icon} ${nomLieuBrut}</span>
                    <button id="lancer-chrono-btn-${nomLieuBrut}" data-lieu="${nomLieuBrut}" onclick="ouvrirIframe('${nomLieuBrut}')" style="width: 40px; height: 41px; position: absolute; top: -12px; right: -12px; border-radius: 8px; display: block;">
                        <img src="chrono.png" alt="Icône chrono" style="width: 20px; height: 20px; position: absolute; bottom: 10px; right: 9px;">
                    </button>
                    <div class="iframe-container" id="iframe-container-${nomLieuBrut}"></div>
                </div>`;

            parent.appendChild(lieuItem);

            if (Object.keys(arbre[lieu]).length > 0) {
                const sousLieuxList = document.createElement('ul');
                sousLieuxList.style.display = 'none';
                lieuItem.appendChild(sousLieuxList);
                parcourirArborescence(arbre[lieu], sousLieuxList, cheminComplet, niveau + 1);
            }
        }
    }

    parcourirArborescence(arborescence, lieuxList);
}

function toggleNiveau(element, niveau) {
    const ulElement = element.nextElementSibling;
    if (ulElement) {
        ulElement.style.display = (ulElement.style.display === 'none' || ulElement.style.display === '') ? 'block' : 'none';
        const iconElement = element.querySelector('.pastille');
        const texteElement = iconElement.getAttribute('data-texte');
        iconElement.innerHTML = (ulElement.style.display === 'none') ? '▶ ' + texteElement : '▼ ' + texteElement;

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
    }
}

function dejaCree(nomLieu) {
    const tabulValue = localStorage.getItem('TABUL');
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

    const iframe = document.createElement('iframe');
    iframe.id = `iframe-${nomLieu.replace(/\s+/g, '-')}`;
    
    let url = `chrono.html?lieu=${nomLieu}&theme=${localStorage.getItem('theme')}`;

    if (temps) {
        url += `&temps=${temps}&liste1=${liste1}&liste2=${liste2}&Text1=${Text1}&Text2=${Text2}&arret=${arret}`;
    }

    iframe.src = url;

    groupeContainer.appendChild(titreLieuContainer);
    groupeContainer.appendChild(iframe);

    chronosContainer.appendChild(groupeContainer);

    if (groupeContainer) {
        groupeContainer.appendChild(iframe);

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
