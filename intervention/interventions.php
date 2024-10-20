<?php
// Configuration des dossiers
$userDir = 'Work/user';
$archiveDir = 'Work/archive';

// Crée le dossier d'archive s'il n'existe pas
if (!is_dir($archiveDir)) {
    mkdir($archiveDir, 0777, true);
}

// Liste des fichiers CSV dans le dossier utilisateur
$csvFiles = glob("$userDir/*.csv");

// Vérifiez s'il y a des fichiers à traiter
if (empty($csvFiles)) {
    echo json_encode(['error' => 'Aucun fichier CSV trouvé dans le dossier utilisateur.']);
    exit;
}

// Préparer la sortie consolidée
$finalCsvData = [];
$totalInterventions = 0;
$headerAdded = false;

foreach ($csvFiles as $file) {
    // Ouvrir le fichier CSV
    $handle = fopen($file, 'r');
    if ($handle === false) {
        continue; // Ignorer les fichiers qui ne peuvent pas être ouverts
    }

    // Lire l'encodage du fichier
    $bom = fread($handle, 3);
    if ($bom != "\xEF\xBB\xBF") {
        rewind($handle); // Pas de BOM, revenir au début du fichier
    }

    // Lire la première ligne (en-tête)
    $header = fgetcsv($handle, 0, ';');

    // Ajouter l'en-tête une seule fois
    if (!$headerAdded && $header !== false) {
        $finalCsvData[] = implode(';', $header);
        $headerAdded = true;
    }

    // Lire les autres lignes du fichier CSV
    while (($row = fgetcsv($handle, 0, ';')) !== false) {
        // Convertir en UTF-8 chaque cellule si nécessaire
        $row = array_map(function($cell) {
            return mb_convert_encoding($cell, 'UTF-8', 'auto');
        }, $row);

        // Ajouter la ligne au fichier final
        $finalCsvData[] = implode(';', $row);
        $totalInterventions++;
    }

    fclose($handle);
}

// Générer le nom du fichier final
$dateDuJour = date('Ymd');
$nbFichiers = count($csvFiles);
$nomFichier = "{$dateDuJour}_{$nbFichiers}_tech_{$totalInterventions}_inter.csv";
$consolidatedFilePath = "$userDir/$nomFichier";

// Écrire le fichier consolidé avec l'encodage UTF-8 et ajouter un BOM pour Excel
file_put_contents($consolidatedFilePath, "\xEF\xBB\xBF" . implode("\n", $finalCsvData));

// Déplacer les fichiers utilisés vers l'archive
foreach ($csvFiles as $file) {
$newName = $archiveDir . '/' . $dateDuJour . '_' . basename($file, '.csv') . "__archive.csv";

    rename($file, $newName);
}

// Envoyer le fichier consolidé au client pour téléchargement
header('Content-Type: application/csv; charset=UTF-8');
header('Content-Disposition: attachment; filename="' . basename($nomFichier) . '";');
header('Pragma: no-cache');
header('Expires: 0');
readfile($consolidatedFilePath);

// Supprimer le fichier consolidé après téléchargement
unlink($consolidatedFilePath);

exit;
?>
