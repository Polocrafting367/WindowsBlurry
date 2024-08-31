<?php
$filePath = 'users.json';
$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData, true);

if (!file_exists($filePath)) {
    file_put_contents($filePath, json_encode([]));  // Assurez-vous que le fichier existe
}

$users = json_decode(file_get_contents($filePath), true);

if (isset($data['action'], $data['username'])) {  // Vérification simplifiée pour couvrir la suppression sans mot de passe
    switch ($data['action']) {
        case 'create':
            if (!isset($users[$data['username']])) {
                // Utilisation de SHA-256 pour le hashage, si nécessaire
                $hashedPassword = hash('sha256', $data['password']);
                $users[$data['username']] = $hashedPassword;
                file_put_contents($filePath, json_encode($users, JSON_PRETTY_PRINT));
                echo json_encode(['success' => true]);
            } else {
                echo json_encode(['success' => false, 'error' => 'Utilisateur déjà existant.']);
            }
            break;
        
        case 'modify':
            if (isset($users[$data['username']])) {
                // Mise à jour du mot de passe avec hash SHA-256
                $hashedPassword = hash('sha256', $data['password']);
                $users[$data['username']] = $hashedPassword;
                file_put_contents($filePath, json_encode($users, JSON_PRETTY_PRINT));
                echo json_encode(['success' => true]);
            } else {
                echo json_encode(['success' => false, 'error' => 'Utilisateur non trouvé.']);
            }
            break;

        case 'delete':
            if (isset($users[$data['username']])) {
                unset($users[$data['username']]);
                file_put_contents($filePath, json_encode($users, JSON_PRETTY_PRINT));
                echo json_encode(['success' => true]);
            } else {
                echo json_encode(['success' => false, 'error' => 'Utilisateur non trouvé.']);
            }
            break;
        
        default:
            echo json_encode(['success' => false, 'error' => 'Action non spécifiée ou incorrecte.']);
            break;
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Données manquantes ou action non spécifiée.']);
}
?>
