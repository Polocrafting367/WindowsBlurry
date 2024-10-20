<?php
header('Content-Type: application/json'); // Indiquer que la réponse est du JSON

$archiveDir = 'Work/archive'; // Chemin vers le dossier des archives
$files = glob("$archiveDir/*.csv"); // Charger uniquement les fichiers CSV
$uniqueNames = [];

// Supprimer un fichier si une requête POST est envoyée
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['file'])) {
    $file = urldecode($_POST['file']); // Décoder le chemin du fichier
    if (file_exists($file)) {
        unlink($file); // Supprimer le fichier
        echo json_encode(['status' => 'success', 'message' => 'Fichier supprimé avec succès.']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Fichier introuvable.']);
    }
    exit; // Terminer le script après avoir traité la suppression
}

// Générer la liste des noms/prénoms pour le select
function generateNameOptions($files, &$uniqueNames) {
    $options = "";
    foreach ($files as $file) {
        $fileName = basename($file);
        // Expression régulière pour capturer le format YYYYMMDD_NOM Prénom__archive.csv
        // Inclure les accents dans le regex en utilisant \p{L} qui couvre les lettres accentuées
        if (preg_match('/(\d{8})_([A-Z]+ [\p{L}-]+)__archive\.csv/u', $fileName, $matches)) {
            $fullName = $matches[2]; // Le nom complet est "NOM Prénom"
            if (!in_array($fullName, $uniqueNames)) {
                $uniqueNames[] = $fullName;
                $options .= "<option value='$fullName'>$fullName</option>";
            }
        }
    }
    return $options;
}

// Générer la liste des fichiers (Date, Nom Prénom, et options pour télécharger/supprimer)
function generateFileList($files) {
    $fileList = "";
    foreach ($files as $file) {
        $fileName = basename($file);
        $filePath = $file; // Chemin complet du fichier
        // Expression régulière pour capturer le format YYYYMMDD_NOM Prénom__archive.csv
        // Inclure les accents dans le regex en utilisant \p{L} qui couvre les lettres accentuées
        if (preg_match('/(\d{8})_([A-Z]+ [\p{L}-]+)__archive\.csv/u', $fileName, $matches)) {
            $date = $matches[1]; // YYYYMMDD
            $fullName = $matches[2]; // NOM Prénom
            $fileList .= "<tr data-date='$date' data-fullname='$fullName'>
                            <td>$date</td>
                            <td>$fullName</td>
                            <td><a href='$filePath' download>Télécharger</a></td>
                            <td><button onclick='deleteFile(\"$filePath\")'>Supprimer</button></td>
                          </tr>";
        } else {
            // Si le fichier ne correspond pas au format attendu, on affiche un message d'erreur
            $fileList .= "<tr><td colspan='4'>Pas reconnu comme archive: $fileName</td></tr>";
        }
    }
    return $fileList;
}

// Appel des fonctions
$nameOptions = generateNameOptions($files, $uniqueNames);
$fileList = generateFileList($files);

// Sortie des résultats au format JSON
echo json_encode(['nameOptions' => $nameOptions, 'fileList' => $fileList]);
