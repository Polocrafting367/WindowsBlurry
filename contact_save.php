<?php
// contact_save.php (à la racine)
header('Content-Type: application/json');

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    echo json_encode(['success' => false, 'message' => 'Aucune donnée reçue']);
    exit;
}

// 1. Préparation
$appTitle = preg_replace('/[^a-zA-Z0-9_-]/', '', $data['appTitle'] ?? 'Defaut');
$type = preg_replace('/[^a-zA-Z0-9_-]/', '', $data['type'] ?? 'autre');
$date = date('Y-m-d');
$data['ip'] = $_SERVER['REMOTE_ADDR'] ?? 'Inconnu';

// 2. Chemin ABSOLU (plus sûr)
$targetDir = __DIR__ . '/contact/' . $appTitle . '/';

// 3. Création forcée
if (!is_dir($targetDir)) {
    mkdir($targetDir, 0777, true);
}

// 4. Nom de fichier (on évite les ":" car Windows les refuse)
$i = 1;
do {
    $filename = sprintf("%s-%s.%03d.json", $type, $date, $i);
    $fullPath = $targetDir . $filename;
    $i++;
} while (file_exists($fullPath));

if (file_put_contents($fullPath, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))) {
    echo json_encode(['success' => true, 'file' => $filename, 'debug_path' => $fullPath]);
} else {
    echo json_encode(['success' => false, 'message' => 'Erreur ecriture. Verifiez permissions.']);
}
?>