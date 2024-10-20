<?php
header('Content-Type: application/json');

// Vérifier si les données ont été envoyées
if (isset($_POST['user']) && isset($_POST['csvContent'])) {
    $user = $_POST['user'];
    $csvContent = $_POST['csvContent'];

    // Chemin vers le dossier utilisateur
    $userDir = 'user/';
    $filePath = $userDir . $user . '.csv';

    // Vérifier si le dossier utilisateur existe, sinon le créer
    if (!is_dir($userDir)) {
        mkdir($userDir, 0777, true);
    }

    // Vérifier si le fichier existe déjà
    $isNewFile = !file_exists($filePath);

    // Si le fichier est nouveau, on écrit le contenu entier, sinon on ajoute les nouvelles lignes sans l'en-tête
    if ($isNewFile) {
        // Écrire le contenu complet (avec en-tête)
        file_put_contents($filePath, $csvContent);
    } else {
        // Ajouter le contenu sans l'en-tête
        // On supprime la première ligne du contenu (l'en-tête)
        $lines = explode("\n", $csvContent);
        array_shift($lines);  // Retirer la première ligne
        $contentWithoutHeader = implode("\n", $lines);

        // Ajouter au fichier existant
        file_put_contents($filePath, $contentWithoutHeader, FILE_APPEND);
    }

    // Retourner une réponse de succès
    echo json_encode(['success' => true]);
} else {
    // Retourner une erreur si les données ne sont pas présentes
    echo json_encode(['success' => false, 'error' => 'Données manquantes.']);
}
?>
