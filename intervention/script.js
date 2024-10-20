(function(_0x3c9a92, _0x5cfc9a) {
    const _0x5e5c37 = _0x30ee
      , _0x731548 = _0x3c9a92();
    while (!![]) {
        try {
            const _0x5ab420 = parseInt(_0x5e5c37(0xe5)) / 0x1 * (-parseInt(_0x5e5c37(0xd1)) / 0x2) + -parseInt(_0x5e5c37(0xce)) / 0x3 + parseInt(_0x5e5c37(0xc7)) / 0x4 + -parseInt(_0x5e5c37(0xbc)) / 0x5 * (parseInt(_0x5e5c37(0xdc)) / 0x6) + -parseInt(_0x5e5c37(0x100)) / 0x7 + -parseInt(_0x5e5c37(0xb8)) / 0x8 + parseInt(_0x5e5c37(0xb3)) / 0x9 * (parseInt(_0x5e5c37(0xe6)) / 0xa);
            if (_0x5ab420 === _0x5cfc9a)
                break;
            else
                _0x731548['push'](_0x731548['shift']());
        } catch (_0x4b8023) {
            _0x731548['push'](_0x731548['shift']());
        }
    }
}(_0x5e77, 0x5ea9b));
function checkDateTimeInURL() {
    const _0x3de654 = _0x30ee
      , _0x4e105c = new URLSearchParams(window[_0x3de654(0xae)]['search'])
      , _0x2b2da5 = _0x4e105c[_0x3de654(0xd5)](_0x3de654(0xcc));
    if (!_0x2b2da5) {
        alert('Erreur,\x20Merci\x20de\x20vous\x20connecter.'),
        window[_0x3de654(0xae)]['href'] = _0x3de654(0xfe);
        return;
    }
    const [_0x4787c2,_0x274867] = _0x2b2da5[_0x3de654(0xd0)]('_')
      , [_0x1f4044,_0x20672a,_0x4d15a4] = _0x4787c2[_0x3de654(0xd0)]('-')['map'](Number)
      , [_0x2e4f5d,_0x8c56d3,_0x4ee5e6] = _0x274867[_0x3de654(0xd0)](':')['map'](Number)
      , _0x585fcd = new Date(_0x1f4044,_0x20672a - 0x1,_0x4d15a4,_0x2e4f5d,_0x8c56d3,_0x4ee5e6)
      , _0x5225eb = new Date()
      , _0x4c77bf = Math[_0x3de654(0xfa)](_0x5225eb - _0x585fcd)
      , _0x26bd31 = _0x4c77bf / (0x3e8 * 0x3c);
    _0x26bd31 > 0x1 && (alert(_0x3de654(0xb9)),
    window[_0x3de654(0xae)][_0x3de654(0xde)] = _0x3de654(0xfe));
}
checkDateTimeInURL();
async function fetchUsers() {
    const _0x197a03 = _0x30ee;
    try {
        const _0x55772d = await fetch(_0x197a03(0xf9))
          , _0x3fcd7f = await _0x55772d['json']()
          , _0x16ec5d = Object[_0x197a03(0xe0)](_0x3fcd7f)['map'](_0x24ee31 => ({
            'username': _0x24ee31,
            'password': _0x3fcd7f[_0x24ee31]
        }));
        displayUsers(_0x16ec5d),
        populateUserSelect(_0x16ec5d);
    } catch (_0x40e010) {
        console[_0x197a03(0xda)](_0x197a03(0xc6), _0x40e010);
    }
}
async function displayUsers(_0x55513b) {
    const _0x167f3a = _0x30ee
      , _0x2de987 = document[_0x167f3a(0xc1)]('userSection');
    _0x2de987[_0x167f3a(0xf0)] = '';
    for (let _0x13046b of _0x55513b) {
        if (_0x13046b[_0x167f3a(0xe1)] !== _0x167f3a(0xf8))
            try {
                const _0xc6eab7 = await fetch('check_interventions.php?user=' + _0x13046b[_0x167f3a(0xe1)])
                  , _0x46d849 = await _0xc6eab7[_0x167f3a(0xd3)]()
                  , _0x437d59 = document[_0x167f3a(0xbb)]('div');
                _0x437d59[_0x167f3a(0xb0)] = _0x167f3a(0xcd),
                _0x437d59['innerHTML'] = _0x167f3a(0xaf) + _0x13046b[_0x167f3a(0xe1)] + _0x167f3a(0xcb) + _0x46d849[_0x167f3a(0xb6)] + _0x167f3a(0xea) + _0x13046b[_0x167f3a(0xe1)] + '\x27)\x22>Voir\x20interventions</button>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20id=\x22' + _0x13046b[_0x167f3a(0xe1)] + _0x167f3a(0xd8) + generateInterventionTable(_0x46d849[_0x167f3a(0xb5)]) + '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20',
                _0x2de987[_0x167f3a(0xdd)](_0x437d59);
            } catch (_0x467514) {
                console[_0x167f3a(0xda)](_0x167f3a(0xe8) + _0x13046b[_0x167f3a(0xe1)] + ':', _0x467514);
            }
    }
}
function generateInterventionTable(_0x6dad77) {
    const _0x2d80bf = _0x30ee;
    if (!_0x6dad77 || _0x6dad77[_0x2d80bf(0xf5)] === 0x0)
        return _0x2d80bf(0xca);
    let _0x10c576 = _0x2d80bf(0xd4);
    return _0x6dad77[_0x2d80bf(0xd9)](_0xb5ae47 => {
        const _0x3d39db = _0x2d80bf
          , _0x512234 = _0xb5ae47[_0x3d39db(0xd0)](',');
        _0x10c576 += '<tr>',
        _0x512234[_0x3d39db(0xd9)](_0x37a868 => {
            const _0x27cc17 = _0x3d39db;
            _0x10c576 += _0x27cc17(0xf7) + _0x37a868[_0x27cc17(0xf4)]() + _0x27cc17(0xc0);
        }
        ),
        _0x10c576 += _0x3d39db(0xe3);
    }
    ),
    _0x10c576 += '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</tbody>\x0a\x20\x20\x20\x20\x20\x20\x20\x20</table>\x0a\x20\x20\x20\x20',
    _0x10c576;
}
function toggleInterventions(_0x537b7c) {
    const _0x43851e = _0x30ee
      , _0x4a4a12 = document['getElementById'](_0x537b7c + _0x43851e(0xf6));
    _0x4a4a12[_0x43851e(0xc3)]['display'] = _0x4a4a12[_0x43851e(0xc3)][_0x43851e(0xb2)] === 'none' ? _0x43851e(0xd7) : 'none';
}
function _0x30ee(_0x288c1a, _0x3b796c) {
    const _0x5e7798 = _0x5e77();
    return _0x30ee = function(_0x30eed9, _0x3c908e) {
        _0x30eed9 = _0x30eed9 - 0xae;
        let _0x33bd4d = _0x5e7798[_0x30eed9];
        return _0x33bd4d;
    }
    ,
    _0x30ee(_0x288c1a, _0x3b796c);
}
function _0x5e77() {
    const _0x46cafd = ['display', '9RWFKgK', 'Échec\x20de\x20la\x20communication\x20avec\x20le\x20serveur', 'interventionsList', 'interventions', 'application/json', '5317528iVPKsB', 'Temps\x20de\x20connextion\x20dépassé.\x20Veuillez\x20vous\x20reconnecter.', 'value', 'createElement', '70235FxNTIR', 'feedback', 'Erreur\x20lors\x20de\x20la\x20modification', 'La\x20mise\x20à\x20jour\x20du\x20serveur\x20a\x20échoué', '</td>', 'getElementById', 'Vraiment\x20supprimé\x20?\x20cela\x20n\x27efface\x20pas\x20les\x20dernière\x20inter\x20et\x20les\x20archives', 'style', 'userSelect', 'action', 'Erreur\x20lors\x20de\x20la\x20récupération\x20des\x20utilisateurs:', '1855056eDAvaw', 'newUsername', 'manageUsers.php', '<p>Aucune\x20intervention\x20trouvée.</p>', '</h2>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<p>', 'time', 'user-window', '76389YiMbBW', 'success', 'split', '698894yBtXSb', 'Erreur:', 'json', '\x0a\x20\x20\x20\x20\x20\x20\x20\x20<table\x20class=\x22intervention-table\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<thead>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<tr>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<th>Date\x20intervention</th>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<th>Désignation\x20machine</th>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<th>Type\x20de\x20panne</th>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<th>Cause</th>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<th>Résumé\x20intervention</th>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<th>Durée\x20arrêt\x20(h)</th>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<th>Personnel</th>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<th>Nombre\x20d\x27heures</th>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</tr>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</thead>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<tbody>\x0a\x20\x20\x20\x20', 'get', 'confirm', 'block', '-interventions\x22\x20style=\x22display:none;\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20', 'forEach', 'error', 'Êtes-vous\x20sûr\x20de\x20vouloir\x20créer?', '270CeWaMZ', 'appendChild', 'href', 'delete', 'keys', 'username', 'create', '</tr>', 'Erreur\x20lors\x20de\x20la\x20création.', '2iykRoT', '23529250QBbDbE', 'textContent', 'Erreur\x20lors\x20de\x20la\x20récupération\x20des\x20interventions\x20pour\x20', 'option', '\x20interventions\x20depuis\x20le\x20dernier\x20export</p>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<button\x20onclick=\x22toggleInterventions(\x27', 'password', 'POST', 'interventions.php', 'Utilisateur\x20supprimé\x20avec\x20succès!', 'Erreur\x20lors\x20de\x20la\x20création\x20de\x20l’utilisateur:\x20', 'innerHTML', 'Content-Type', 'message', 'modify', 'trim', 'length', '-interventions', '<td>', 'Gestion', 'XbGv89Lm.json', 'abs', 'Modifier\x20le\x20mot\x20de\x20passe\x20?', 'Erreur\x20lors\x20de\x20la\x20modification:\x20', 'Nouvel\x20utilisateur\x20créé\x20!', '../index.html', 'Erreur\x20lors\x20de\x20la\x20suppression\x20de\x20l’utilisateur:\x20', '2854509PPOdkM', 'location', '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<h2>', 'className', 'stringify'];
    _0x5e77 = function() {
        return _0x46cafd;
    }
    ;
    return _0x5e77();
}
function populateUserSelect(_0x25f6d6) {
    const _0x445508 = _0x30ee
      , _0xc24739 = document[_0x445508(0xc1)]('userSelect');
    _0xc24739[_0x445508(0xf0)] = '',
    _0x25f6d6[_0x445508(0xd9)](_0x427063 => {
        const _0x2b6f21 = _0x445508;
        if (_0x427063[_0x2b6f21(0xe1)] !== 'Gestion') {
            const _0x7fb702 = document[_0x2b6f21(0xbb)]('option');
            _0x7fb702[_0x2b6f21(0xba)] = _0x427063[_0x2b6f21(0xe1)],
            _0x7fb702[_0x2b6f21(0xe7)] = _0x427063['username'],
            _0xc24739[_0x2b6f21(0xdd)](_0x7fb702);
        }
    }
    );
}
function populateUserSelect(_0x11a3d5) {
    const _0x3329e7 = _0x30ee
      , _0x54e766 = document[_0x3329e7(0xc1)](_0x3329e7(0xc4));
    _0x54e766[_0x3329e7(0xf0)] = '',
    _0x11a3d5[_0x3329e7(0xd9)](_0x23fcb4 => {
        const _0x55fd0b = _0x3329e7;
        if (_0x23fcb4['username'] !== 'Gestion') {
            const _0x43cb2c = document[_0x55fd0b(0xbb)](_0x55fd0b(0xe9));
            _0x43cb2c[_0x55fd0b(0xba)] = _0x23fcb4['username'],
            _0x43cb2c[_0x55fd0b(0xe7)] = _0x23fcb4[_0x55fd0b(0xe1)],
            _0x54e766['appendChild'](_0x43cb2c);
        }
    }
    );
}
async function modifierMotDePasse() {
    const _0x553f81 = _0x30ee
      , _0x36a5e7 = window['confirm'](_0x553f81(0xfb));
    if (!_0x36a5e7)
        return;
    const _0x3f9840 = document[_0x553f81(0xc1)](_0x553f81(0xc4))[_0x553f81(0xba)]
      , _0x4bbc41 = document[_0x553f81(0xc1)]('newPassword')[_0x553f81(0xba)]
      , _0x2e3d3c = document[_0x553f81(0xc1)](_0x553f81(0xbd));
    try {
        const _0x4a8536 = {};
        _0x4a8536['Content-Type'] = _0x553f81(0xb7);
        const _0x31ec16 = {};
        _0x31ec16[_0x553f81(0xc5)] = _0x553f81(0xf3),
        _0x31ec16[_0x553f81(0xe1)] = _0x3f9840,
        _0x31ec16[_0x553f81(0xeb)] = _0x4bbc41;
        const _0x29669e = await fetch('manageUsers.php', {
            'method': 'POST',
            'headers': _0x4a8536,
            'body': JSON[_0x553f81(0xb1)](_0x31ec16)
        });
        if (_0x29669e['ok']) {
            const _0x58fa08 = await _0x29669e[_0x553f81(0xd3)]();
            _0x58fa08[_0x553f81(0xcf)] ? (_0x2e3d3c[_0x553f81(0xe7)] = 'Mot\x20de\x20passe\x20modifié!',
            fetchUsers()) : _0x2e3d3c[_0x553f81(0xe7)] = _0x58fa08[_0x553f81(0xda)] || _0x553f81(0xbe);
        } else
            throw new Error(_0x553f81(0xbf));
    } catch (_0x3512f2) {
        console[_0x553f81(0xda)](_0x553f81(0xd2), _0x3512f2),
        _0x2e3d3c['textContent'] = _0x553f81(0xfc) + _0x3512f2[_0x553f81(0xf2)];
    }
}
async function creerUtilisateur() {
    const _0x110974 = _0x30ee
      , _0x38c7a3 = window[_0x110974(0xd6)](_0x110974(0xdb));
    if (!_0x38c7a3)
        return;
    const _0x556a1d = document[_0x110974(0xc1)](_0x110974(0xc8))[_0x110974(0xba)]
      , _0x3246b9 = document['getElementById']('createPassword')[_0x110974(0xba)]
      , _0x48d92c = document[_0x110974(0xc1)](_0x110974(0xbd));
    try {
        const _0x571890 = {};
        _0x571890[_0x110974(0xf1)] = 'application/json';
        const _0xdd1a3f = {};
        _0xdd1a3f[_0x110974(0xc5)] = _0x110974(0xe2),
        _0xdd1a3f[_0x110974(0xe1)] = _0x556a1d,
        _0xdd1a3f[_0x110974(0xeb)] = _0x3246b9;
        const _0x5d76d4 = await fetch(_0x110974(0xc9), {
            'method': _0x110974(0xec),
            'headers': _0x571890,
            'body': JSON[_0x110974(0xb1)](_0xdd1a3f)
        });
        if (_0x5d76d4['ok']) {
            const _0x56c918 = await _0x5d76d4[_0x110974(0xd3)]();
            _0x56c918[_0x110974(0xcf)] ? (_0x48d92c[_0x110974(0xe7)] = _0x110974(0xfd),
            fetchUsers()) : _0x48d92c['textContent'] = _0x56c918[_0x110974(0xda)] || _0x110974(0xe4);
        } else
            throw new Error(_0x110974(0xb4));
    } catch (_0x4691ab) {
        console[_0x110974(0xda)](_0x110974(0xd2), _0x4691ab),
        _0x48d92c[_0x110974(0xe7)] = _0x110974(0xef) + _0x4691ab[_0x110974(0xf2)];
    }
}
async function supprimerUtilisateur() {
    const _0x1d8efd = _0x30ee
      , _0x5c26e9 = window[_0x1d8efd(0xd6)](_0x1d8efd(0xc2));
    if (!_0x5c26e9)
        return;
    const _0x373f56 = document['getElementById'](_0x1d8efd(0xc4))[_0x1d8efd(0xba)]
      , _0x147f36 = document[_0x1d8efd(0xc1)]('feedback');
    try {
        const _0xf70770 = {};
        _0xf70770[_0x1d8efd(0xf1)] = _0x1d8efd(0xb7);
        const _0x175b39 = {};
        _0x175b39[_0x1d8efd(0xc5)] = _0x1d8efd(0xdf),
        _0x175b39[_0x1d8efd(0xe1)] = _0x373f56;
        const _0x368bf9 = await fetch('manageUsers.php', {
            'method': 'POST',
            'headers': _0xf70770,
            'body': JSON[_0x1d8efd(0xb1)](_0x175b39)
        });
        if (_0x368bf9['ok']) {
            const _0x5f003b = await _0x368bf9[_0x1d8efd(0xd3)]();
            _0x5f003b[_0x1d8efd(0xcf)] ? (_0x147f36[_0x1d8efd(0xe7)] = _0x1d8efd(0xee),
            fetchUsers()) : _0x147f36[_0x1d8efd(0xe7)] = _0x5f003b['error'] || 'Erreur\x20lors\x20de\x20la\x20suppression\x20de\x20l’utilisateur.';
        } else
            throw new Error('Échec\x20de\x20la\x20communication\x20avec\x20le\x20serveur');
    } catch (_0x4ea1b8) {
        console[_0x1d8efd(0xda)](_0x1d8efd(0xd2), _0x4ea1b8),
        _0x147f36['textContent'] = _0x1d8efd(0xff) + _0x4ea1b8[_0x1d8efd(0xf2)];
    }
}
fetchUsers();
function genererInterventions() {
    const _0x2d15e9 = _0x30ee;
    window['location'][_0x2d15e9(0xde)] = _0x2d15e9(0xed);
}
function genererInterventionstest() {
    const _0xcd4918 = _0x30ee;
    window[_0xcd4918(0xae)][_0xcd4918(0xde)] = 'interventionstest.php';
}
