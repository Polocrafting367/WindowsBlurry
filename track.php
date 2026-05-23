<?php
// track.php (A la racine du site)

// AFFICHER LES ERREURS
ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// 1. Récupération des données
$input = file_get_contents("php://input");
$data = json_decode($input, true);

// Si pas de données, on log une erreur mais on ne plante pas tout de suite pour tester
if (!$data) {
    // Fallback pour test : si on appelle le fichier directement dans le navigateur sans données
    $data = ['page' => 'TEST_DIRECT', 'deviceId' => 'debug'];
}

// 2. Définition du chemin ABSOLU
// __DIR__ pointe vers le dossier où est ce fichier (la racine)
$targetDir = __DIR__ . '/contact/visit';

// Création du dossier
if (!is_dir($targetDir)) {
    if (!mkdir($targetDir, 0777, true)) {
        echo json_encode(['status' => 'error', 'message' => 'Droit écriture refusé sur le dossier contact']);
        exit;
    }
}

// 3. Construction du nom
$rawTitle = $data['page'] ?? 'Inconnu';
$cleanTitle = preg_replace('/[^a-zA-Z0-9_-]/', '', $rawTitle);
if (empty($cleanTitle)) $cleanTitle = "Page";

$dateStr = date('Y-m-d-H-i-s'); // Tirets partout, pas de deux-points !
$micro = sprintf("%03d", (microtime(true) - floor(microtime(true))) * 1000);
$rand = rand(100, 999);

$filename = "{$cleanTitle}_{$dateStr}_{$micro}_{$rand}.json";
$file = $targetDir . '/' . $filename;

// 4. Contenu
$entry = [
    'time' => date('Y-m-d H:i:s'),
    'ip' => $_SERVER['REMOTE_ADDR'] ?? 'Unknown',
    'device_id' => $data['deviceId'] ?? 'Inconnu',
    'page' => $rawTitle,
    'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown'
];

// 5. Écriture
if (file_put_contents($file, json_encode($entry, JSON_PRETTY_PRINT))) {
    echo json_encode(['status' => 'ok', 'file' => $filename]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Erreur file_put_contents']);
}
?>