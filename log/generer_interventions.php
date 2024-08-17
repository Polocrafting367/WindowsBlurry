<?php
// Dossier des fichiers utilisateur
$userDir = 'Work/user';
$archiveDir = 'Work/archive';

// Vérifie si les dossiers existent
if (!is_dir($userDir) || !is_dir($archiveDir)) {
    die("Le dossier utilisateur ou archive n'existe pas.");
}

// Variables pour compter les utilisateurs et les interventions
$utilisateurs = [];
$totalInterventions = 0;

// Compter le nombre de fichiers CSV dans le dossier utilisateur
$csvFiles = glob("$userDir/*.csv");

// Parcours des fichiers CSV des utilisateurs pour collecter les informations
foreach ($csvFiles as $file) {
    $handle = fopen($file, 'r');

    // Détecter et ignorer les BOM (Byte Order Mark) si présent
    $bom = fread($handle, 3);
    if ($bom != "\xEF\xBB\xBF") {
        rewind($handle);  // Pas de BOM, revenir au début du fichier
    }

    // Ignore la première ligne si c'est l'en-tête
    fgetcsv($handle, 0, ';');

    // Lire et compter les lignes dans chaque fichier
    while (($data = fgetcsv($handle, 0, ';')) !== false) {
        // Détecter l'encodage de chaque ligne
        $encoding = mb_detect_encoding(implode('', $data), ['UTF-8', 'ISO-8859-1', 'Windows-1252'], true);

        // Convertir en UTF-8 si nécessaire
        if ($encoding !== 'UTF-8') {
            $data = array_map(function($value) use ($encoding) {
                return mb_convert_encoding($value, 'UTF-8', $encoding);
            }, $data);
        }

        // Comptage des interventions
        $totalInterventions++;

        // Comptage des utilisateurs (personnel)
        $personnel = $data[6];  // Supposant que la colonne "Personnel" est à l'index 6
        if (!empty($personnel) && !in_array($personnel, $utilisateurs)) {
            $utilisateurs[] = $personnel;
        }
    }

    fclose($handle);
}

// Nombre total d'utilisateurs distincts
$nbPersonnes = count($utilisateurs);

// Génération du nom de fichier avec le nombre de fichiers CSV et d'interventions
$dateDuJour = date('dmY');
$nomFichier = "{$dateDuJour}_{$nbPersonnes}_Techn_{$totalInterventions}_Inter.csv";

// Création du fichier CSV consolidé
$outputHandle = fopen($nomFichier, 'w');

// Entête du fichier CSV
$header = ["Date intervention", "Désignation machine", "Type de panne", "Cause", "Résumé intervention", "Durée arrêt (h)", "Personnel", "Nombre d'heures"];
fputcsv($outputHandle, $header, ';');

// Parcours des fichiers CSV des utilisateurs pour écrire dans le fichier consolidé
foreach ($csvFiles as $file) {
    $handle = fopen($file, 'r');

    // Détecter et ignorer les BOM (Byte Order Mark) si présent
    $bom = fread($handle, 3);
    if ($bom != "\xEF\xBB\xBF") {
        rewind($handle);  // Pas de BOM, revenir au début du fichier
    }

    // Ignore la première ligne si c'est l'en-tête
    fgetcsv($handle, 0, ';');

    // Lire et écrire les lignes dans le fichier de sortie
    while (($data = fgetcsv($handle, 0, ';')) !== false) {
        // Détecter l'encodage de chaque ligne
        $encoding = mb_detect_encoding(implode('', $data), ['UTF-8', 'ISO-8859-1', 'Windows-1252'], true);

        // Convertir en UTF-8 si nécessaire
        if ($encoding !== 'UTF-8') {
            $data = array_map(function($value) use ($encoding) {
                return mb_convert_encoding($value, 'UTF-8', $encoding);
            }, $data);
        }

        fputcsv($outputHandle, $data, ';');
    }

    fclose($handle);

    // Renomme le fichier original en le déplaçant vers le dossier archive avec la date d'aujourd'hui
    $newName = $archiveDir . '/' . basename($file, '.csv') . '_' . date('Ymd') . '_archive.csv';
    rename($file, $newName);
}

// Ferme le fichier de sortie
fclose($outputHandle);

// Force le téléchargement du fichier consolidé avec le nom personnalisé
header('Content-Type: application/csv; charset=UTF-8');
header('Content-Disposition: attachment; filename="' . basename($nomFichier) . '";');
header('Pragma: no-cache');
header('Expires: 0');
readfile($nomFichier);

// Supprime le fichier après téléchargement
unlink($nomFichier);
?>
