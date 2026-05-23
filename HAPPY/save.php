<?php
header('Content-Type: application/json');

$json = file_get_contents('php://input');
$payload = json_decode($json, true);

if (!$payload || !isset($payload['user']) || !isset($payload['data'])) {
    echo json_encode(["status" => "error", "message" => "Données invalides"]);
    exit;
}

// MODIFICATION : On ajoute l'espace " " dans la liste des caractères autorisés
// Note le petit espace juste après le tiret \-
$user = preg_replace('/[^a-zA-Z0-9_\- ]/', '', $payload['user']); 

// On nettoie les espaces en début/fin pour éviter des dossiers invisibles
$user = trim($user);

$baseDir = "../G-MAPP/data/{$user}_";

if (!file_exists($baseDir)) {
    // Utilisation de 0755 (plus sécurisé que 0777 si ton serveur le permet)
    mkdir($baseDir, 0755, true);
}

foreach ($payload['data'] as $key => $value) {
    // Sécurité supplémentaire : on nettoie aussi la clé pour éviter l'injection de chemin
    $safeKey = preg_replace('/[^a-zA-Z0-9_\-]/', '', $key);
    $filePath = "{$baseDir}/happ_{$safeKey}";
    
    if ($value === null) {
        if (file_exists($filePath)) unlink($filePath);
    } else {
        file_put_contents($filePath, $value);
    }
}

echo json_encode(["status" => "success"]);