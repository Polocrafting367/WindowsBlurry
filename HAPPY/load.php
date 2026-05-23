<?php
header('Content-Type: application/json');

// MODIFICATION : Ajout de l'espace " " dans le preg_replace et ajout du trim()
$user = isset($_GET['user']) ? trim(preg_replace('/[^a-zA-Z0-9_\- ]/', '', $_GET['user'])) : null;

if (!$user) {
    echo json_encode(["error" => "Utilisateur non spécifié ou invalide"]);
    exit;
}

$baseDir = "../G-MAPP/data/{$user}_";
$data = [];

if (file_exists($baseDir)) {
    // On récupère tous les fichiers commençant par happ_
    $files = glob("{$baseDir}/happ_*");
    
    if ($files) {
        foreach ($files as $file) {
            // Extraction de la clé (on enlève le préfixe happ_)
            $key = str_replace("happ_", "", basename($file));
            $content = file_get_contents($file);
            
            // On tente de décoder si c'est du JSON, sinon on laisse en string brute
            $jsonDecoded = json_decode($content, true);
            $data[$key] = (json_last_error() === JSON_ERROR_NONE) ? $jsonDecoded : $content;
        }
    }
}

// Toujours renvoyer l'objet data (vide ou rempli)
echo json_encode($data);