const _0x547ca9 = _0x5ab4;
(function(_0x5d3ac5, _0x579ec5) {
    const _0x22c7bb = _0x5ab4
      , _0x4fb1c7 = _0x5d3ac5();
    while (!![]) {
        try {
            const _0xcb254e = -parseInt(_0x22c7bb(0xb1)) / 0x1 * (parseInt(_0x22c7bb(0xa3)) / 0x2) + parseInt(_0x22c7bb(0x93)) / 0x3 + parseInt(_0x22c7bb(0xa2)) / 0x4 + -parseInt(_0x22c7bb(0x99)) / 0x5 + -parseInt(_0x22c7bb(0x9c)) / 0x6 + -parseInt(_0x22c7bb(0xa7)) / 0x7 * (-parseInt(_0x22c7bb(0x96)) / 0x8) + parseInt(_0x22c7bb(0x90)) / 0x9;
            if (_0xcb254e === _0x579ec5)
                break;
            else
                _0x4fb1c7['push'](_0x4fb1c7['shift']());
        } catch (_0x429358) {
            _0x4fb1c7['push'](_0x4fb1c7['shift']());
        }
    }
}(_0x5d05, 0x23c43));
let securePasswords = {};
fetch(_0x547ca9(0xae))[_0x547ca9(0x8b)](_0x13bafb => _0x13bafb[_0x547ca9(0xad)]())['then'](_0x56fb1e => {
    const _0x176927 = _0x547ca9;
    securePasswords = _0x56fb1e;
    const _0x3f568c = localStorage['getItem'](_0x176927(0x9d));
    _0x3f568c && securePasswords[_0x3f568c] && (document['getElementById'](_0x176927(0x9e))[_0x176927(0x97)] = _0x3f568c,
    document[_0x176927(0x8d)](_0x176927(0x8f))[_0x176927(0x97)] = localStorage[_0x176927(0xaa)]('rememberedPassword'),
    document[_0x176927(0x8d)](_0x176927(0xa1))[_0x176927(0x98)] = !![]);
}
);
function _0x5ab4(_0x234fe9, _0x62a063) {
    const _0x5d0529 = _0x5d05();
    return _0x5ab4 = function(_0x5ab415, _0x35edc7) {
        _0x5ab415 = _0x5ab415 - 0x89;
        let _0x23c28d = _0x5d0529[_0x5ab415];
        return _0x23c28d;
    }
    ,
    _0x5ab4(_0x234fe9, _0x62a063);
}
function hashPassword(_0x1541cb) {
    const _0x372419 = _0x547ca9;
    return CryptoJS[_0x372419(0x91)](_0x1541cb)[_0x372419(0xaf)]();
}
function _0x5d05() {
    const _0x575993 = ['click', 'Nom\x20d\x27utilisateur\x20ou\x20mot\x20de\x20passe\x20incorrect', 'href', '938lhOezR', 'Gestion', 'Gest.html?time=', 'getItem', 'getHours', 'getDate', 'json', 'XbGv89Lm.json', 'toString', 'loginBtn', '29NevnGb', 'getMonth', 'getSeconds', 'then', 'getFullYear', 'getElementById', 'getMinutes', 'password', '1743678XPbCSj', 'SHA256', 'addEventListener', '412314ksfnns', 'padStart', 'setItem', '2216sxcmOq', 'value', 'checked', '727610ZUmlHV', 'rememberedPassword', 'removeItem', '691410KAlthO', 'rememberedUser', 'username', 'Work/index.html?user=', 'location', 'remember', '295612jPUMtR', '2410EtWGyR'];
    _0x5d05 = function() {
        return _0x575993;
    };
    return _0x5d05();
}

document[_0x547ca9(0x8d)](_0x547ca9(0xb0))[_0x547ca9(0x92)](_0x547ca9(0xa4), function() {
    const _0xbc9ad9 = _0x547ca9,
          _0x4aada8 = document[_0xbc9ad9(0x8d)]('username')['value'],
          _0x2c1677 = document[_0xbc9ad9(0x8d)](_0xbc9ad9(0x8f))[_0xbc9ad9(0x97)],
          _0x2ddf0b = hashPassword(_0x2c1677);

    if (securePasswords[_0x4aada8] && securePasswords[_0x4aada8] === _0x2ddf0b) {
        const _0x382342 = document[_0xbc9ad9(0x8d)](_0xbc9ad9(0xa1))[_0xbc9ad9(0x98)];

        // Si l'utilisateur veut se souvenir de ses informations
        if (_0x382342) {
            localStorage[_0xbc9ad9(0x95)]('rememberedUser', _0x4aada8);
            localStorage[_0xbc9ad9(0x95)]('rememberedPassword', _0x2c1677);
                        localStorage.setItem('AUTOUSER', _0x4aada8);

        } else {
            localStorage[_0xbc9ad9(0x9b)](_0xbc9ad9(0x9d));
            localStorage[_0xbc9ad9(0x9b)](_0xbc9ad9(0x9a));

        }

        if (_0x4aada8 === _0xbc9ad9(0xa8)) {

            const _0x181c94 = new Date(),
                  _0x459b7f = _0x181c94.getFullYear() + '-' + (_0x181c94.getMonth() + 1).toString().padStart(2, '0') + '-' + _0x181c94.getDate().toString().padStart(2, '0') + '_' + _0x181c94.getHours().toString().padStart(2, '0') + ':' + _0x181c94.getMinutes().toString().padStart(2, '0') + ':' + _0x181c94.getSeconds().toString().padStart(2, '0'),
                  _0x4073a2 = encodeURIComponent(_0x459b7f);
localStorage.removeItem('AUTOUSER');

            window.location.href = 'Gest.html?time=' + _0x4073a2;

        } else {
                // Récupérer l'URL actuelle
    const currentUrl = new URL(window.location.href);
    
    // Extraire le paramètre 'inter' de l'URL
    const params = new URLSearchParams(currentUrl.search);
            const interLieu = params.get('inter'); // Valeur par défaut 'lieu' si 'inter' n'est pas défini

    // Sélectionner l'élément avec la classe 'title-bar-text'

            if (interLieu) {
            window.location.href = _0xbc9ad9(0x9f) + encodeURIComponent(_0x4aada8) + '&inter=' + interLieu; 
        } else {
            window.location.href = _0xbc9ad9(0x9f) + encodeURIComponent(_0x4aada8) ; 

            }        
        }
    } else {
        alert('Nom d\'utilisateur ou mot de passe incorrect');
    }
});

window.onload = function() {
    // Change l'URL affichée dans la barre de navigation pour "intervention"

    // Récupérer l'URL actuelle
    const currentUrl = new URL(window.location.href);
    
    // Extraire le paramètre 'inter' de l'URL
    const params = new URLSearchParams(currentUrl.search);
    const interLieu = params.get('inter'); // Valeur par défaut 'lieu' si 'inter' n'est pas défini

    // Sélectionner l'élément avec la classe 'title-bar-text'
    const titleElement = document.getElementsByClassName('title-bar-text')[0]; // Accès au premier élément de la collection

    if (interLieu) {
        // Modifier le contenu de l'élément
        titleElement.innerHTML = `Connexion à intervention pour :<br>Crée intervention: '${interLieu}'<br> N'hésitez pas à cocher<br> "se souvenir de moi" <br>pour ne pas avoir à vous reconnecter.`;
    }
};


function openWebsite() {

    // Cache la modal
    var modal = document.getElementById("tutorialModal");
    modal.style.display = "none";
    
    // Effectue la redirection ou autre action
    // window.location.href = 'url_du_site_web'; // Rediriger vers une autre page si nécessaire

}

function openmodal() {
    loadPageInIframe("Work/tuto/index.html"); // Charger la page du tutoriel dans l'iframe
    var modal = document.getElementById("tutorialModal");

    // Affiche le fond gris semi-transparent et la modal
    modal.style.display = "block";
}    
function loadPageInIframe(url) {
        var iframeContainer = document.getElementById("iframeContainer");
        iframeContainer.innerHTML = '<iframe id="TUTORIEL" src="' + url + '"></iframe>';
    }