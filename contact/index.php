<?php
session_start();
set_time_limit(300); 

// --- CONFIGURATION ---
$PASSWORD = "Qefe47722002"; 
$BASE_PATH = dirname(__DIR__); 
$CONTACT_DIR = str_replace('\\', '/', realpath($BASE_PATH) . '/contact/');
$VISIT_DIR   = str_replace('\\', '/', $CONTACT_DIR . 'visit/');
$CACHE_DIR   = str_replace('\\', '/', $CONTACT_DIR . 'cache/');

if (!is_dir($CACHE_DIR)) mkdir($CACHE_DIR, 0755, true);

// --- FONCTION PARSING USER AGENT ---
function parseUserAgent($ua) {
    $os = "Autre";
    $browser = "Inconnu";

    if (empty($ua)) return ['os' => $os, 'browser' => $browser];

    // 1. DÉTECTION ROBOTS
    if (preg_match('/(bot|crawl|spider|slurp|facebookexternalhit|ahrefs)/i', $ua)) {
        $os = "Robot";
        if (preg_match('/([a-zA-Z0-9]*Bot|crawler|spider)/i', $ua, $matches)) {
             $browser = $matches[1];
        } else {
             $browser = "Robot Générique";
        }
        return ['os' => $os, 'browser' => $browser];
    }

    // 2. DÉTECTION OS
    if (preg_match('/Windows NT ([\d\.]+)/i', $ua, $matches)) {
        $v = $matches[1];
        if ($v == '10.0') $os = (strpos($ua, 'Windows 11') !== false) ? "Windows 11" : "Windows 10";
        elseif ($v == '6.3') $os = "Windows 8.1";
        elseif ($v == '6.2') $os = "Windows 8";
        elseif ($v == '6.1') $os = "Windows 7";
        else $os = "Windows NT $v";
    } elseif (preg_match('/Android\s([0-9\.]+)/i', $ua, $matches)) {
        $os = "Android " . $matches[1];
    } elseif (preg_match('/iPhone OS\s([0-9_]+)/i', $ua, $matches)) {
        $os = "iOS " . str_replace('_', '.', $matches[1]);
    } elseif (preg_match('/Mac OS X\s([0-9_]+)/i', $ua, $matches)) {
        $os = "macOS " . str_replace('_', '.', $matches[1]);
    } elseif (preg_match('/X11; Linux/i', $ua)) {
        $os = "Linux (Desktop)";
    } elseif (preg_match('/Linux/i', $ua)) {
        $os = "Linux";
    }

    // 3. DÉTECTION NAVIGATEUR
    if (preg_match('/Edg\/([\d\.]+)/i', $ua, $matches)) $browser = "Edge " . intval($matches[1]);
    elseif (preg_match('/Chrome\/([\d\.]+)/i', $ua, $matches)) $browser = "Chrome " . intval($matches[1]);
    elseif (preg_match('/Firefox\/([\d\.]+)/i', $ua, $matches)) $browser = "Firefox " . intval($matches[1]);
    elseif (preg_match('/Safari\/([\d\.]+)/i', $ua, $matches) && strpos($ua, 'Chrome') === false) $browser = "Safari " . intval($matches[1]);

    return ['os' => $os, 'browser' => $browser];
}

// --- FONCTIONS DE COMPRESSION DES LOGS ---
function compressVisits($flatArray) {
    $lexP = []; $lexO = []; $lexB = []; $lexU = [];
    $data = [];
    foreach ($flatArray as $v) {
        $p = $v['page'] ?? 'Inconnu';
        if (!isset($lexP[$p])) $lexP[$p] = count($lexP);
        $o = $v['os_parsed'] ?? 'Autre';
        if (!isset($lexO[$o])) $lexO[$o] = count($lexO);
        $b = $v['browser_parsed'] ?? 'Inconnu';
        if (!isset($lexB[$b])) $lexB[$b] = count($lexB);
        $u = $v['user_agent'] ?? '';
        if (!isset($lexU[$u])) $lexU[$u] = count($lexU);
        $data[] = [
            $v['time'], $v['ip'] ?? '-', $v['device_id'] ?? '',
            $lexP[$p], $lexU[$u], $lexO[$o], $lexB[$b]
        ];
    }
    return [
        'l' => ['p' => array_keys($lexP), 'o' => array_keys($lexO), 'b' => array_keys($lexB), 'u' => array_keys($lexU)],
        'd' => $data
    ];
}

function decompressVisits($data) {
    if (!isset($data['l'], $data['d'])) return is_array($data) ? $data : [];
    $flat = []; $lex = $data['l'];
    foreach ($data['d'] as $row) {
        $flat[] = [
            'time' => $row[0], 'ip' => $row[1], 'device_id' => $row[2],
            'page' => $lex['p'][$row[3]] ?? 'Inconnu', 'user_agent' => $lex['u'][$row[4]] ?? '',
            'os_parsed' => $lex['o'][$row[5]] ?? 'Autre', 'browser_parsed' => $lex['b'][$row[6]] ?? 'Inconnu'
        ];
    }
    return $flat;
}

// --- LOGIN ---
if (isset($_POST['login'])) {
    if ($_POST['pass'] === $PASSWORD) $_SESSION['logged_in'] = true;
}
if (isset($_GET['logout'])) {
    session_destroy();
    header("Location: index.php");
    exit;
}
if (!isset($_SESSION['logged_in'])) {
    echo '<!DOCTYPE html><html><head><title>Login</title><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>body{background:#0f172a;color:white;display:flex;justify-content:center;align-items:center;height:100vh;font-family:sans-serif;margin:0;}form{background:#1e293b;padding:40px;border-radius:16px;width:90%;max-width:350px;box-shadow:0 20px 25px -5px rgba(0,0,0,0.5);border:1px solid #334155;}input,button{padding:14px;width:100%;margin-bottom:20px;border-radius:8px;border:none;box-sizing:border-box;font-size:1rem;}input{background:#0f172a;color:white;border:1px solid #334155;}button{background:#8b5cf6;color:white;cursor:pointer;font-weight:bold;transition:0.3s;}button:hover{background:#7c3aed;}</style></head><body><form method="post"><h2 style="margin:0 0 30px 0;text-align:center;">Connexion Admin</h2><input type="password" name="pass" placeholder="Mot de passe" autofocus><button type="submit" name="login">Entrer</button></form></body></html>';
    exit;
}

// --- AJAX ACTIONS ---
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    header('Content-Type: application/json');

    // 1. GÉNÉRATION CACHE
    if ($_POST['action'] === 'build_cache') {
        $filesByYear = [];
        $totalFiles = 0;
        
        if (is_dir($VISIT_DIR)) {
            $files = glob($VISIT_DIR . '*.json');
            foreach ($files as $f) {
                $content = file_get_contents($f);
                $json = json_decode($content, true);
                
                if (!$json || !isset($json['time'])) { @unlink($f); continue; }
                
                $year = substr($json['time'], 0, 4);
                $uaInfo = parseUserAgent($json['user_agent'] ?? '');
                $json['os_parsed'] = $uaInfo['os'];
                $json['browser_parsed'] = $uaInfo['browser'];

                $filesByYear[$year][] = ['path' => $f, 'data' => $json];
                $totalFiles++;
            }
        }

        $globalSuccess = true;
        foreach ($filesByYear as $year => $items) {
            $cachePath = $CACHE_DIR . "visits_$year.json";
            $existingData = [];
            if (file_exists($cachePath)) {
                $existingContent = file_get_contents($cachePath);
                $decoded = json_decode($existingContent, true);
                if (is_array($decoded)) $existingData = decompressVisits($decoded);
            }
            $newEntries = array_column($items, 'data');
            $mergedData = array_merge($existingData, $newEntries);
            
            // Compression avant enregistrement
            $compressed = compressVisits($mergedData);
            $encoded = json_encode($compressed, JSON_UNESCAPED_UNICODE | JSON_PARTIAL_OUTPUT_ON_ERROR);
            
            if (file_put_contents($cachePath, $encoded) !== false) {
                foreach ($items as $item) { if (file_exists($item['path'])) unlink($item['path']); }
            } else {
                $globalSuccess = false;
            }
        }
        echo json_encode(['success' => $globalSuccess, 'count' => $totalFiles]);
        exit;
    }

    // 2. MESSAGES
    if ($_POST['action'] === 'toggle' || $_POST['action'] === 'delete') {
        $file = $_POST['file'];
        if (strpos($file, '..') !== false) die(json_encode(['success'=>false]));
        $fullPath = $CONTACT_DIR . $file;
        if ($_POST['action'] === 'toggle' && file_exists($fullPath)) {
            $data = json_decode(file_get_contents($fullPath), true);
            $data['status'] = ($data['status'] ?? 'new') === 'done' ? 'new' : 'done';
            file_put_contents($fullPath, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
            echo json_encode(['success' => true, 'newStatus' => $data['status']]);
        } elseif ($_POST['action'] === 'delete' && file_exists($fullPath)) {
            unlink($fullPath);
            echo json_encode(['success' => true]);
        }
    } elseif ($_POST['action'] === 'delete_all_user') {
        $deviceId = $_POST['deviceId'];
        if (is_dir($CONTACT_DIR)) {
            $iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($CONTACT_DIR));
            foreach ($iterator as $file) {
                if ($file->isFile() && $file->getExtension() === 'json' && strpos($file->getPathname(), '/visit/') === false) {
                    $content = json_decode(file_get_contents($file->getPathname()), true);
                    if (($content['deviceId'] ?? '') === $deviceId) unlink($file->getPathname());
                }
            }
        }
        echo json_encode(['success' => true]);
    }
    exit;
}

// =========================================================
// LECTURE DONNÉES (MULTI-MODE)
// =========================================================
$viewMode = $_GET['mode'] ?? 'month'; 
$selectedMonth = $_GET['m'] ?? date('Y-m');
$selectedYear = $_GET['y'] ?? date('Y');

// AUTO-ASSIMILATION : S'il y a des fichiers dans le dossier visit, on active la reconstruction
$needsBuild = false;
if (is_dir($VISIT_DIR)) {
    $pendingFiles = glob($VISIT_DIR . "*.json");
    if (count($pendingFiles) > 0) $needsBuild = true;
}

$allAvailableMonths = [];
$availableYears = [];

// 1. Inventaire des fichiers cache
$cacheFiles = glob($CACHE_DIR . "visits_*.json");

foreach($cacheFiles as $cf) {
    $y = preg_replace('/[^0-9]/', '', basename($cf));
    if(!in_array($y, $availableYears)) $availableYears[] = $y;
    for($i=1; $i<=12; $i++) {
        $m = sprintf("%04d-%02d", $y, $i);
        if($m <= date('Y-m')) $allAvailableMonths[] = $m; 
    }
}
rsort($allAvailableMonths);
rsort($availableYears);

// 2. Détermination des fichiers à charger
$filesToLoad = [];
if ($viewMode === 'all') {
    $filesToLoad = $cacheFiles;
} else {
    $targetYear = ($viewMode === 'month') ? substr($selectedMonth, 0, 4) : $selectedYear;
    $f = $CACHE_DIR . "visits_$targetYear.json";
    if (file_exists($f)) $filesToLoad[] = $f;
}

// 3. Extraction de TOUS les logs pour filtrage puissant côté JavaScript
$allLogs = [];
$pagesList = [];
$datesSet = [];

foreach ($filesToLoad as $f) {
    $visitsRaw = json_decode(file_get_contents($f), true);
    if (!$visitsRaw) continue;
    $visits = decompressVisits($visitsRaw);

    foreach ($visits as $v) {
        $time = $v['time'];
        
        // Filtres temporels PHP pour alléger l'envoi
        if ($viewMode === 'month' && substr($time, 0, 7) !== $selectedMonth) continue;
        if ($viewMode === 'year' && substr($time, 0, 4) !== $selectedYear) continue;

        $dateKey = ($viewMode === 'month') ? substr($time, 0, 10) : substr($time, 0, 7);
        $page = $v['page'] ?? 'Inconnu';
        
        if (!isset($datesSet[$dateKey])) $datesSet[$dateKey] = true;
        if (!in_array($page, $pagesList)) $pagesList[] = $page;
        
        // Assainissement minimal
        $v['ip'] = $v['ip'] ?? '-';
        $v['date_key'] = $dateKey; // Utilisé par JS
        $allLogs[] = $v;
    }
}
ksort($datesSet);
sort($pagesList);
usort($allLogs, function($a, $b) { return strcmp($b['time'], $a['time']); }); // Tri chronologique inverse

// --- MESSAGES (Commentaires) ---
$messages = []; $userCounts = []; $msgApps = [];
if (is_dir($CONTACT_DIR)) {
    $iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($CONTACT_DIR));
    foreach ($iterator as $file) {
        $filePath = str_replace('\\', '/', $file->getPathname());
        if ($file->isFile() && $file->getExtension() === 'json' && strpos($filePath, '/visit/') === false && strpos($filePath, '/cache/') === false) {
            $content = json_decode(file_get_contents($filePath), true);
            if (!$content) continue;
            $content['_path'] = str_replace($CONTACT_DIR, '', $filePath);
            $content['status'] = $content['status'] ?? 'new';
            $dId = $content['deviceId'] ?? 'Inconnu';
            $appTitle = $content['appTitle'] ?? 'App';
            $parsedUA = parseUserAgent($content['userAgent'] ?? $content['user_agent'] ?? '');
            $content['os_details'] = $parsedUA['os'];
            if (!in_array($appTitle, $msgApps)) $msgApps[] = $appTitle;
            $userCounts[$dId] = ($userCounts[$dId] ?? 0) + 1;
            $messages[] = $content;
        }
    }
}
usort($messages, function($a, $b) { return ($b['timestamp'] ?? 0) - ($a['timestamp'] ?? 0); });
sort($msgApps);
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Admin Dashboard Pro</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root { 
            --bg: #0b1121; --card: #151e32; --text: #e2e8f0; --text-muted: #94a3b8; 
            --accent: #6366f1; --accent-glow: rgba(99, 102, 241, 0.3);
            --success: #10b981; --danger: #f43f5e; --border: #1e293b; --hover: #1e293b;
        }
        body { background: var(--bg); color: var(--text); font-family: 'Segoe UI', system-ui, sans-serif; margin: 0; padding: 0; font-size: 14px; overflow-x: hidden; }
        
        #loader {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: var(--bg); z-index: 9999;
            display: flex; flex-direction: column; align-items: center; justify-content: center; transition: opacity 0.5s;
        }
        .ip-cell.active-filter {
            background: var(--accent) !important;
            color: white !important;
            border-radius: 4px;
        }
        .spinner { width: 50px; height: 50px; border: 5px solid var(--card); border-top-color: var(--accent); border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }

        .top-bar { padding: 15px 20px; background: rgba(11, 17, 33, 0.95); backdrop-filter: blur(12px); display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 100;}
        .tabs { display: flex; background: var(--card); border-bottom: 1px solid var(--border); padding: 0 10px; gap: 10px; overflow-x: auto; scrollbar-width: none; white-space: nowrap; -webkit-overflow-scrolling: touch;}
        .tab-btn { background: transparent; border: none; color: var(--text-muted); padding: 18px 15px; font-size: 0.95rem; cursor: pointer; position: relative; transition: 0.3s; font-weight: 600; white-space: nowrap; flex-shrink: 0; }
        .tab-btn.active { color: var(--accent); }
        .tab-btn.active::after { content:''; position: absolute; bottom: 0; left: 0; width: 100%; height: 3px; background: var(--accent); border-radius: 3px 3px 0 0; box-shadow: 0 -2px 10px var(--accent-glow); }
        
        .container { padding: 15px; max-width: 1600px; margin: 0 auto; }
        .section { display: none; opacity: 0; transition: opacity 0.3s; } 
        .section.active { display: block; opacity: 1; }
        
        .grid-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 20px; margin-bottom: 25px; }
        .card { background: var(--card); border-radius: 16px; padding: 20px; border: 1px solid var(--border); box-shadow: 0 4px 20px rgba(0,0,0,0.2); display: flex; flex-direction: column; }
        .card h3 { margin: 0 0 20px 0; font-size: 1.1rem; display: flex; align-items: center; gap: 10px; color: var(--text); }
        .card-full { grid-column: 1 / -1; }
        
        .scroll-x { display: flex; flex-wrap: wrap; overflow-x: auto; gap: 10px; padding-bottom: 10px; -webkit-overflow-scrolling: touch; }
        .scroll-x::-webkit-scrollbar { height: 4px; }
        .scroll-x::-webkit-scrollbar-track { background: var(--border); border-radius: 2px; }
        .scroll-x::-webkit-scrollbar-thumb { background: var(--text-muted); border-radius: 2px; }

        .kpi { flex: 1 1 150px; background: linear-gradient(145deg, #1e293b, #161f30); padding: 20px; border-radius: 16px; border: 1px solid var(--border); position: relative; overflow: hidden; }
        .kpi::before { content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: var(--accent); }
        .kpi span { display: block; font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
        .kpi b { font-size: 2rem; font-weight: 700; color: white; }

        .toolbar { flex-wrap: wrap; background: var(--card); padding: 15px; border-radius: 12px; margin-bottom: 20px; display: flex; align-items: center; border: 1px solid var(--border); gap: 15px;}
        select, input, .btn { background: #0b1121; color: white; border: 1px solid var(--border); padding: 10px 14px; border-radius: 8px; outline: none; font-size: 0.9rem; transition: 0.2s; cursor: pointer; }
        select:focus, input:focus { border-color: var(--accent); box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2); }
        .btn { background: var(--hover); display: inline-flex; align-items: center; gap: 8px;}
        .btn:hover { background: var(--border); }
        .btn.primary { background: var(--accent); border-color: var(--accent); }
        .btn.primary:hover { background: #4f46e5; }
        .btn.danger { background: rgba(244, 63, 94, 0.1); color: var(--danger); border-color: rgba(244, 63, 94, 0.3); }
        .btn.danger:hover { background: var(--danger); color: white; }

        .checkbox-group { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; flex: 1; border-left: 1px solid var(--border); padding-left: 15px;}
        .checkbox-item { display: flex; align-items: center; gap: 6px; background: #1e293b; padding: 6px 12px; border-radius: 8px; border: 1px solid transparent; font-size: 0.85rem; cursor: pointer; user-select: none; transition: 0.2s; }
        .checkbox-item:hover { background: #273549; }
        .checkbox-item.active { border-color: var(--accent); background: rgba(99, 102, 241, 0.1); }
        .checkbox-item input { display: none; }

        /* TABLEAU LOGS AVANCÉ */
        .table-container { max-height: 600px; overflow-y: auto; overflow-x: auto; border-radius: 12px; border: 1px solid var(--border); }
        .data-table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
        .data-table th { background: #151e32; position: sticky; top: 0; z-index: 10; color: var(--text-muted); font-weight: 600; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; padding: 14px 15px; text-align: left; border-bottom: 2px solid var(--border); cursor: pointer;}
        .data-table td { padding: 12px 15px; border-bottom: 1px solid var(--border); }
        .data-table tr:hover td { background: rgba(255,255,255,0.02); }
        .ip-cell { font-family: monospace; color: var(--accent); font-weight: bold; cursor: pointer; transition: 0.2s; }
        .ip-cell:hover { color: white; background: var(--accent); border-radius: 4px; }

        /* TAGS */
        .tag { display: inline-block; padding: 4px 8px; border-radius: 6px; font-size: 0.75rem; font-weight: bold; background: rgba(255,255,255,0.1); color: #cbd5e1; white-space: nowrap; }
        .tag.Android { background: rgba(16, 185, 129, 0.15); color: #10b981; }
        .tag.iOS { background: rgba(244, 63, 94, 0.15); color: #f43f5e; }
        .tag.Windows { background: rgba(59, 130, 246, 0.15); color: #3b82f6; }
        .tag.Robot { background: transparent; color: var(--text-muted); border: 1px solid var(--border); }

        /* IP FILTER BANNER */
        .filter-banner { display: none; background: rgba(99, 102, 241, 0.1); border: 1px solid var(--accent); padding: 12px 20px; border-radius: 12px; margin-bottom: 20px; align-items: center; justify-content: space-between; }
        .filter-banner.active { display: flex; animation: slideDown 0.3s ease-out; }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }

        .msg-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 20px; }
        .msg-item { background: var(--card); padding: 20px; border-radius: 16px; border: 1px solid var(--border); transition: 0.3s; position: relative; }
        .msg-item.done { filter: grayscale(0.6) opacity(0.7); border-color: var(--success); }
        .actions { margin-top: 15px; padding-top: 15px; border-top: 1px solid var(--border); display: flex; justify-content: flex-end; gap: 10px; }
        
        @media (max-width: 768px) { 
            .grid-stats { grid-template-columns: 1fr; }
            .checkbox-group { border-left: none; padding-left: 0; width: 100%; }
        }
    </style>
</head>
<body>

    <div id="loader" class="<?= $needsBuild ? '' : 'hidden' ?>" style="display: <?= $needsBuild ? 'flex' : 'none' ?>">
        <div class="spinner"></div>
        <h3 style="margin-top:20px; font-weight:400;">Assimilation des données...</h3>
        <div style="color:var(--text-muted); font-size:0.9rem; margin-top:5px;">Mise à jour en cours, veuillez patienter.</div>
    </div>

    <div class="top-bar">
        <h2 style="margin:0;"><i class="fas fa-layer-group" style="color:var(--accent); margin-right:10px;"></i>ADMIN <span style="font-weight:300; opacity:0.7;">PANEL</span></h2>
        <div style="display:flex; gap:10px; align-items:center;">
            <button class="btn" onclick="forceRebuild()" title="Forcer le re-scan complet"><i class="fas fa-sync-alt"></i></button>
            <a href="?logout" class="btn danger" title="Déconnexion"><i class="fas fa-power-off"></i></a>
        </div>
    </div>

    <div class="tabs">
        <button class="tab-btn active" onclick="showTab('tab-stats')">Vue Globale</button>
        <button class="tab-btn" onclick="showTab('tab-logs')">Connexions (Logs)</button>
        <button class="tab-btn" onclick="showTab('tab-msgs')">Commentaires (<?=count($messages)?>)</button>
    </div>

    <div class="container">
        
        <!-- SECTION STATS -->
        <div id="tab-stats" class="section active">
            
            <!-- KPIs -->
            <div class="scroll-x" style="margin-bottom: 25px;">
                <div class="kpi"><span>Visites Totales</span><b id="kpiVisits">0</b></div>
                <div class="kpi"><span>Appareils Uniques</span><b id="kpiDevices">0</b></div>
                <div class="kpi"><span>Systèmes OS</span><b id="kpiOS">0</b></div>
                <div class="kpi"><span>Pic d'affluence</span><b id="kpiPeakHour">-</b></div>
            </div>

            <!-- Toolbar Graphiques -->
            <div class="toolbar">
                <select onchange="updateViewMode(this.value)" style="font-weight:bold;">
                    <option value="month" <?=$viewMode==='month'?'selected':''?>>Vue Mensuelle</option>
                    <option value="year" <?=$viewMode==='year'?'selected':''?>>Vue Annuelle</option>
                    <option value="all" <?=$viewMode==='all'?'selected':''?>>Tout l'historique</option>
                </select>

                <?php if($viewMode === 'month'): ?>
                    <select onchange="location.href='?mode=month&m='+this.value">
                        <?php foreach ($allAvailableMonths as $m): ?>
                            <option value="<?=$m?>" <?=$m==$selectedMonth?'selected':''?>><?=date('F Y', strtotime($m."-01"))?></option>
                        <?php endforeach; ?>
                    </select>
                <?php elseif($viewMode === 'year'): ?>
                    <select onchange="location.href='?mode=year&y='+this.value">
                        <?php foreach ($availableYears as $y): ?>
                            <option value="<?=$y?>" <?=$y==$selectedYear?'selected':''?>><?=$y?></option>
                        <?php endforeach; ?>
                    </select>
                <?php endif; ?>

                <div class="checkbox-group">
                    <button id="btnToggleAll" class="btn" onclick="toggleAllPages()" style="padding: 6px 10px; font-size: 0.8rem;">
                        <i class="fas fa-eye-slash"></i> <span>Tout masquer</span>
                    </button>
                    <?php foreach($pagesList as $p): ?>
                    <label class="checkbox-item active">
                        <input type="checkbox" checked value="<?=htmlspecialchars($p)?>" onchange="updateDashboard()">
                        <?=htmlspecialchars($p)?>
                    </label>
                    <?php endforeach; ?>
                </div>
            </div>

            <div class="grid-stats">
                <!-- CHART 1: TRAFIC -->
                <div class="card card-full">
                    <h3><i class="fas fa-chart-area" style="color:var(--accent);"></i> Flux de Trafic <span style="font-size:0.8rem;color:var(--text-muted);font-weight:normal;margin-left:auto;">(Cliquez sur une page dans la légende pour isoler les données)</span></h3>
                    <div style="height: 350px;"><canvas id="chartVisits"></canvas></div>
                </div>

                <!-- CHART 2: HOURLY -->
                <div class="card card-full">
                    <h3><i class="fas fa-clock" style="color:#f59e0b;"></i> Analyse Horaire (24h)</h3>
                    <div style="height: 250px;"><canvas id="chartHourly"></canvas></div>
                </div>

                <!-- CHART 3: OS FAMILY -->
                <div class="card">
                    <h3><i class="fas fa-mobile-alt" style="color:#10b981;"></i> Répartition Systèmes</h3>
                    <div style="height: 250px; position:relative;"><canvas id="chartOSFamily"></canvas></div>
                </div>

                <!-- CHART 4: VERSIONS -->
                <div class="card" style="grid-row: span 2;">
                    <h3><i class="fas fa-list-ol" style="color:#f59e0b;"></i> Détail Versions (Top 15)</h3>
                    <div style="height: 100%; min-height:300px;"><canvas id="chartOSVersion"></canvas></div>
                </div>

                 <!-- CHART 5: BROWSERS -->
                 <div class="card">
                    <h3><i class="fas fa-globe" style="color:#3b82f6;"></i> Navigateurs</h3>
                    <div style="height: 250px;"><canvas id="chartBrowsers"></canvas></div>
                </div>
            </div>
        </div>

        <!-- SECTION LOGS (Tableau dynamique) -->
        <div id="tab-logs" class="section">
            <div class="card card-full">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; margin-bottom: 20px;">
                    <h3 style="margin:0;"><i class="fas fa-network-wired" style="color:var(--accent);"></i> Journal des connexions</h3>
                    <span id="logsCountBadge" class="tag" style="background:var(--hover);">0 entrées affichées</span>
                </div>

                <!-- BANNIÈRE FILTRE IP -->
                <div id="ipFilterBanner" class="filter-banner">
                    <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap; flex:1;">
                        <i class="fas fa-filter" style="color:var(--accent);"></i>
                        <span style="white-space:nowrap;">Filtres IP :</span>
                        <div id="activeIpList" style="display:flex; gap:8px; flex-wrap:wrap;">
                            <!-- Moteur JS insère les tags ici -->
                        </div>
                    </div>
                    <div style="display:flex; gap:10px; align-items:center; margin-left:15px; flex-shrink:0;">
                        <select id="ipFilterMode" onchange="renderLogsTable()" style="background:var(--bg); border-color:var(--accent);">
                            <option value="exclude">Masquer ces IP</option>
                            <option value="include">N'afficher QUE ces IP</option>
                        </select>
                        <button class="btn danger" onclick="clearIpFilters()"><i class="fas fa-trash"></i> Vider</button>
                    </div>
                </div>

                <div class="table-container">
                    <table class="data-table" id="logsTable">
                        <thead>
                            <tr>
                                <th>Date / Heure</th>
                                <th>Page Visitée</th>
                                <th>Adresse IP</th>
                                <th>ID Appareil</th>
                                <th>Système (OS)</th>
                                <th>Navigateur</th>
                            </tr>
                        </thead>
                        <tbody id="logsTbody">
                            <!-- Rempli par JavaScript -->
                        </tbody>
                    </table>
                </div>
                <div style="text-align:center; padding-top:15px; color:var(--text-muted); font-size:0.8rem;">
                    * Affichage limité aux 1000 dernières entrées correspondantes aux filtres pour optimiser la navigation.
                </div>
            </div>
        </div>

        <!-- SECTION MESSAGES -->
        <div id="tab-msgs" class="section">
            <div class="toolbar scroll-x">
                <input type="search" id="searchMsg" placeholder="Rechercher (IP, texte)..." style="width:250px;" oninput="applyMsgFilters()">
                <select id="appFilter" onchange="applyMsgFilters()">
                    <option value="all">Toutes les Applications</option>
                    <?php foreach($msgApps as $app): ?><option value="<?=htmlspecialchars($app)?>"><?=htmlspecialchars($app)?></option><?php endforeach; ?>
                </select>
                <label style="cursor:pointer; display:flex; align-items:center; gap:8px; margin-left:auto;">
                    <input type="checkbox" id="showDone" onchange="applyMsgFilters()"> 
                    <span style="font-size:0.9rem;">Afficher éléments traités</span>
                </label>
            </div>
            
            <div id="activeMsgFilter" class="filter-banner" style="border-color:var(--danger); background:rgba(244, 63, 94, 0.1);">
                <span><i class="fas fa-user-tag"></i> Messages de l'utilisateur : <b id="activeUserLabel"></b></span>
                <div style="display:flex; gap:10px;">
                    <button class="btn danger" onclick="deleteUserAll()"><i class="fas fa-trash"></i> Tout effacer</button>
                    <button class="btn" onclick="clearUserFilter()"><i class="fas fa-times"></i></button>
                </div>
            </div>

            <div class="msg-grid" id="msgContainer">
                <?php foreach ($messages as $msg): 
                    $dId = $msg['deviceId'] ?? 'Inconnu';
                    $osName = $msg['os_details'] ?? 'Autre';
                    $isRobot = $osName === 'Robot';
                    $type = $msg['type'] ?? 'autre';
                    
                    // Style des tags de type
                    $typeColors = [
                        'bug' => ['bg' => 'rgba(244, 63, 94, 0.2)', 'fg' => '#f43f5e', 'icon' => 'fa-bug', 'label' => 'Bug'],
                        'idee' => ['bg' => 'rgba(99, 102, 241, 0.2)', 'fg' => '#818cf8', 'icon' => 'fa-lightbulb', 'label' => 'Idée'],
                        'remarque' => ['bg' => 'rgba(245, 158, 11, 0.2)', 'fg' => '#fbbf24', 'icon' => 'fa-comment-alt', 'label' => 'Note'],
                        'autre' => ['bg' => 'rgba(148, 163, 184, 0.2)', 'fg' => '#94a3b8', 'icon' => 'fa-folder', 'label' => 'Autre']
                    ];
                    $tStyle = $typeColors[$type] ?? $typeColors['autre'];
                ?>
                <div class="msg-item <?= $msg['status'] === 'done' ? 'done' : '' ?>" data-status="<?=$msg['status']?>" data-user="<?=$dId?>" data-title="<?=htmlspecialchars($msg['appTitle']??'App')?>" data-search="<?=strtolower(($msg['message']??'').' '.$dId.' '.$type.' '.($tStyle['label']??''))?>">
                    <div style="display:flex; justify-content:space-between; margin-bottom:10px; align-items:center;">
                        <div style="display:flex; gap:8px;">
                            <span class="tag <?=$isRobot?'Robot':(strpos($osName, 'Android')!==false?'Android':(strpos($osName,'iOS')!==false||strpos($osName,'mac')!==false?'iOS':'Windows'))?>"><?=$osName?></span>
                            <span class="tag" style="background:<?=$tStyle['bg']?>; color:<?=$tStyle['fg']?>;"><i class="fas <?=$tStyle['icon']?>"></i> <?=$tStyle['label']?></span>
                        </div>
                        <span style="font-size:0.8rem; color:var(--text-muted);"><i class="far fa-clock"></i> <?=isset($msg['timestamp']) ? date('d/m H:i', ($msg['timestamp']/1000)) : '?'?></span>
                    </div>
                    <h4 style="margin:0 0 10px 0; color:white; font-size:1.1rem;"><?=htmlspecialchars($msg['appTitle']??'App')?></h4>
                    
                    <div style="font-size:0.85rem; color:var(--text-muted); cursor:pointer; margin-bottom:15px; display:inline-flex; align-items:center; gap:6px; background:var(--bg); padding:4px 8px; border-radius:6px;" onclick="setUserFilter('<?=$dId?>')" title="Filtrer ce visiteur">
                        <i class="fas fa-fingerprint" style="color:var(--accent);"></i> <?=substr($dId, 0, 15)?>... 
                        <span style="background:var(--border); padding:2px 6px; border-radius:4px; font-size:0.7rem; color:white;"><?=$userCounts[$dId]?> msg</span>
                    </div>
                    
                    <?php if(!empty($msg['contact'])): ?>
                        <div style="font-size:0.85rem; color:var(--success); margin-bottom:10px;">
                            <i class="fas fa-user-circle"></i> <b>Contact :</b> <?=htmlspecialchars($msg['contact'])?>
                        </div>
                    <?php endif; ?>

                    <p style="background:rgba(0,0,0,0.3); padding:15px; border-radius:10px; margin:0 0 10px 0; border: 1px solid var(--border); font-size:0.95rem; line-height:1.5; color:#e2e8f0;"><?=nl2br(htmlspecialchars($msg['message']??''))?></p>
                    
                    <div class="actions">
                        <button class="btn primary" onclick="updateStatus('<?=$msg['_path']?>', 'toggle', this)" title="Marquer lu/non lu"><i class="fas <?=$msg['status']=='done'?'fa-undo':'fa-check'?>"></i></button>
                        <button class="btn danger" onclick="updateStatus('<?=$msg['_path']?>', 'delete', this)" title="Supprimer définitivement"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
        </div>
    </div>

    <!-- JAVASCRIPT GLOBAL -->
    <script>
        // --- 1. DATA INJECTION (Depuis PHP) ---
        const needsBuild = <?= $needsBuild ? 'true' : 'false' ?>;
        const rawLogs = <?=json_encode($allLogs, JSON_UNESCAPED_UNICODE)?>;
        const allDates = <?=json_encode(array_keys($datesSet))?>;
        const viewMode = "<?=$viewMode?>";
        const colorPalette = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#06b6d4', '#84cc16', '#3b82f6'];
        let filteredIps = new Set(); // Utilisation d'un Set pour stocker plusieurs IP uniques
        
        // --- Fonction de changement de vue (Mensuel, Annuel, Tout) ---
        function updateViewMode(m) {
            location.href = '?mode=' + m;
        }

        // --- 2. GESTION AUTO-ASSIMILATION ---
        if (needsBuild) {
            document.getElementById('loader').style.display = 'flex';
            const fd = new FormData(); fd.append('action', 'build_cache');
            fetch('index.php', { method: 'POST', body: fd })
                .then(res => res.json())
                .then(json => {
                    if(json.success) location.reload();
                    else { alert('Erreur lors de la construction du cache.'); document.getElementById('loader').style.display = 'none'; }
                }).catch(e => {
                    console.error(e); alert("Erreur critique de synchronisation"); document.getElementById('loader').style.display = 'none';
                });
        }
        function forceRebuild() { if(confirm("Forcer la re-vérification des fichiers de visite ?")) { location.href='?force=1'; /* Optionnel: déclencher l'ajax direct */ } }

        function toggleIpFilter(ip) {
            if (filteredIps.has(ip)) {
                filteredIps.delete(ip); // Désélectionne si déjà présente
            } else {
                filteredIps.add(ip);    // Sélectionne si nouvelle
            }
            updateIpBanner();
            renderLogsTable();
            showTab('tab-logs');
        }

        function removeIpFromBanner(ip, event) {
            if(event) event.stopPropagation();
            filteredIps.delete(ip);
            updateIpBanner();
            renderLogsTable();
        }

        function clearIpFilters() {
            filteredIps.clear();
            updateIpBanner();
            renderLogsTable();
        }

        // Met à jour l'affichage visuel du bandeau (création des tags)
        function updateIpBanner() {
            const banner = document.getElementById('ipFilterBanner');
            const list = document.getElementById('activeIpList');
            
            if (filteredIps.size === 0) {
                banner.classList.remove('active');
                return;
            }
            
            banner.classList.add('active');
            list.innerHTML = '';
            
            filteredIps.forEach(ip => {
                const tag = document.createElement('span');
                tag.className = 'tag';
                tag.style.background = 'var(--accent)';
                tag.style.color = 'white';
                tag.style.display = 'inline-flex';
                tag.style.alignItems = 'center';
                tag.style.gap = '6px';
                tag.innerHTML = `${ip} <i class="fas fa-times" style="cursor:pointer; opacity:0.7;" onclick="removeIpFromBanner('${ip}', event)" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.7"></i>`;
                list.appendChild(tag);
            });
        }

        // --- 3. LOGIQUE DASHBOARD DYNAMIQUE ---
        Chart.defaults.color = '#94a3b8';
        Chart.defaults.borderColor = '#1e293b';
        Chart.defaults.font.family = "'Segoe UI', sans-serif";
        
        let charts = {}; // Stockage des instances Chart.js
        let activeLogs = []; // Logs filtrés par Page

        window.onload = function() {
            if(!needsBuild) {
                initCharts();
                updateDashboard(); // Lance le premier calcul
            }
        };

        function showTab(id) {
            document.querySelectorAll('.section').forEach(e => e.classList.remove('active'));
            document.querySelectorAll('.tab-btn').forEach(e => e.classList.remove('active'));
            document.getElementById(id).classList.add('active');
            event.currentTarget.classList.add('active');
        }

        // Clic sur bouton "Tout" (Mode Toggle)
        function toggleAllPages() {
            const checkboxes = document.querySelectorAll('.checkbox-item input');
            const total = checkboxes.length;
            const checkedCount = document.querySelectorAll('.checkbox-item input:checked').length;
            
            // Logique : si TOUT est déjà coché, le nouvel état sera "false" (décoché). 
            // S'il en manque au moins un, on recoche tout (true).
            const newState = (checkedCount !== total); 
            
            // Application du nouvel état aux cases
            checkboxes.forEach(cb => { cb.checked = newState; });
            
            // Mise à jour visuelle du bouton
            const btn = document.getElementById('btnToggleAll');
            if (newState) {
                btn.innerHTML = '<i class="fas fa-eye-slash"></i> <span>Tout masquer</span>';
            } else {
                btn.innerHTML = '<i class="fas fa-eye"></i> <span>Tout afficher</span>';
            }
            
            // Relance le calcul global
            updateDashboard();
        }

        // Fonction maîtresse : recalcule tout selon les checkbox
        function updateDashboard() {
            // 1. MAJ Visuel Checkbox
            document.querySelectorAll('.checkbox-item').forEach(lbl => {
                const cb = lbl.querySelector('input');
                lbl.classList.toggle('active', cb.checked);
            });

            // 2. Extraire Pages Sélectionnées
            const checkedPages = Array.from(document.querySelectorAll('.checkbox-item input:checked')).map(cb => cb.value);
            
            // 3. Filtrer rawLogs -> activeLogs
            activeLogs = rawLogs.filter(l => checkedPages.includes(l.page));

            // 4. Recalculer les données
            let dateMap = {}; allDates.forEach(d => dateMap[d] = {}); // Init abscisse
            let hourMap = Array(24).fill(0);
            let osMap = {}, versionMap = {}, browserMap = {};
            let devicesSet = new Set();

            activeLogs.forEach(l => {
                // Trafic
                let page = l.page || 'Inconnu';
                if(dateMap[l.date_key] !== undefined) {
                    dateMap[l.date_key][page] = (dateMap[l.date_key][page] || 0) + 1;
                }
                
                // Heures
                let h = parseInt(l.time.substring(11, 13));
                if(!isNaN(h)) hourMap[h]++;

                // OS / Browser
                let osFull = l.os_parsed || 'Autre';
                let osFam = osFull.split(' ')[0];
                let browser = l.browser_parsed || 'Inconnu';

                osMap[osFam] = (osMap[osFam] || 0) + 1;
                versionMap[osFull] = (versionMap[osFull] || 0) + 1;
                browserMap[browser] = (browserMap[browser] || 0) + 1;

                // KPI Device
                if(l.device_id) devicesSet.add(l.device_id);
            });

            // 5. MAJ KPI HTML
            document.getElementById('kpiVisits').innerText = activeLogs.length.toLocaleString();
            document.getElementById('kpiDevices').innerText = devicesSet.size.toLocaleString();
            document.getElementById('kpiOS').innerText = Object.keys(versionMap).length;
            let peakH = hourMap.indexOf(Math.max(...hourMap));
            document.getElementById('kpiPeakHour').innerText = Math.max(...hourMap) > 0 ? peakH + 'h' : '-';

            // 6. MAJ Chart Visits (Line)
            let datasetsVisits = [];
            checkedPages.forEach((pageName, idx) => {
                const color = colorPalette[idx % colorPalette.length];
                datasetsVisits.push({
                    label: pageName,
                    data: allDates.map(d => (dateMap[d][pageName] || 0)),
                    borderColor: color, backgroundColor: color + '22',
                    fill: false, tension: 0.3, pointRadius: 2, borderWidth: 2
                });
            });
            charts.visits.data.labels = allDates.map(d => viewMode === 'month' ? d.split('-')[2] : d); // Formattage jour/mois
            charts.visits.data.datasets = datasetsVisits;
            charts.visits.update();

            // 7. MAJ Chart Hourly (Line Filled)
            let totalActive = activeLogs.length;
            let hourPct = hourMap.map(v => totalActive > 0 ? ((v / totalActive) * 100).toFixed(1) : 0);
            charts.hourly.data.datasets[0].data = hourPct;
            charts.hourly.update();

            // 8. MAJ Pie/Bar Charts
            updateGenericChart(charts.osFamily, osMap, true);
            updateGenericChart(charts.osVersion, versionMap, false, 15);
            updateGenericChart(charts.browsers, browserMap, true);

            // 9. MAJ Tableau des Logs
            renderLogsTable();
        }

        // Helper pour maj les doughnut / bar charts
        function updateGenericChart(chartInstance, dataObj, isDoughnut, limit = 0) {
            // Tri décroissant
            let sorted = Object.entries(dataObj).sort((a,b) => b[1] - a[1]);
            if (limit > 0) sorted = sorted.slice(0, limit);
            
            chartInstance.data.labels = sorted.map(x => x[0]);
            
            let vals = sorted.map(x => x[1]);
            if(isDoughnut) {
                chartInstance.data.datasets[0].data = vals;
                // Génération des couleurs
                chartInstance.data.datasets[0].backgroundColor = colorPalette.slice(0, vals.length);
            } else {
                chartInstance.data.datasets[0].data = vals;
            }
            chartInstance.update();
        }

        // --- 4. INITIALISATION DES GRAPHIQUES ---
        function initCharts() {
            // CHART TRAFIC
            charts.visits = new Chart(document.getElementById('chartVisits').getContext('2d'), {
                type: 'line', data: { labels: [], datasets: [] },
                options: {
                    responsive: true, maintainAspectRatio: false,
                    interaction: { mode: 'index', intersect: false },
                    plugins: { 
                        legend: { 
                            position: 'top',
                            onClick: function(e, legendItem, legend) {
                                // MAGIE : Clic légende isole la page
                                const clickedPage = legendItem.text;
                                const cbs = document.querySelectorAll('.checkbox-item input');
                                cbs.forEach(cb => { cb.checked = (cb.value === clickedPage); });
                                
                                // On met à jour le bouton visuel toggle "Tout"
                                document.getElementById('btnToggleAll').innerHTML = '<i class="fas fa-eye"></i> <span>Tout afficher</span>';
                                
                                updateDashboard();
                            }
                        } 
                    },
                    scales: { y: { beginAtZero: true }, x: { grid: { display: false } } }
                }
            });

            // CHART HOURLY
            charts.hourly = new Chart(document.getElementById('chartHourly').getContext('2d'), {
                type: 'line', data: { labels: Array.from({length:24},(_,i)=>i+'h'), datasets: [{label: 'Visites', data:[], borderColor: '#f59e0b', backgroundColor: 'rgba(245, 158, 11, 0.1)', fill: true, tension: 0.4}] },
                options: {
                    responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false },
                    tooltip: { callbacks: { label: (c) => c.raw + '%' } } },
                    scales: { y: { beginAtZero: true, ticks: { callback: (v) => v + '%' } }, x: { grid: { display: false } } }
                }
            });

            // CHART OS FAMILY
            charts.osFamily = new Chart(document.getElementById('chartOSFamily'), {
                type: 'doughnut', data: { labels: [], datasets: [{ data: [], borderWidth: 0 }] },
                options: { maintainAspectRatio: false, cutout: '65%', plugins: { legend: { position: 'right' } } }
            });

            // CHART OS VERSION (Bar)
            charts.osVersion = new Chart(document.getElementById('chartOSVersion'), {
                type: 'bar', data: { labels: [], datasets: [{ label: 'Visites', data: [], backgroundColor: '#3b82f6', borderRadius: 4 }] },
                options: { indexAxis: 'y', maintainAspectRatio: false, plugins: {legend:{display:false}}, scales: { x: { display: false } } }
            });

            // CHART BROWSERS
            charts.browsers = new Chart(document.getElementById('chartBrowsers'), {
                type: 'doughnut', data: { labels: [], datasets: [{ data: [], borderWidth: 0 }] },
                options: { maintainAspectRatio: false, cutout: '50%', plugins: { legend: { position: 'right' } } }
            });
        }

        // --- 5. GESTION DU TABLEAU DE LOGS & FILTRE IP ---
        function renderLogsTable() {
            const tbody = document.getElementById('logsTbody');
            tbody.innerHTML = '';
            
            const ipMode = document.getElementById('ipFilterMode').value;
            let renderedCount = 0;
            const MAX_ROWS = 1000;

            for (let i = 0; i < activeLogs.length; i++) {
                let l = activeLogs[i];
                
                // Application du filtre IP Multiple
                if (filteredIps.size > 0) {
                    const hasIp = filteredIps.has(l.ip);
                    if (ipMode === 'include' && !hasIp) continue; // On veut INCLURE mais l'IP n'est pas dans la liste
                    if (ipMode === 'exclude' && hasIp) continue;  // On veut EXCLURE et l'IP est dans la liste
                }

                // Vérifie si l'IP de cette ligne est actuellement sélectionnée (pour la colorer)
                const isSelected = filteredIps.has(l.ip) ? 'active-filter' : '';

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td style="white-space:nowrap; color:var(--text-muted);"><i class="far fa-calendar-alt"></i> ${l.time}</td>
                    <td><span class="tag" style="background:rgba(99,102,241,0.1); color:var(--accent); border:1px solid rgba(99,102,241,0.3);">${l.page || '?'}</span></td>
                    <td class="ip-cell ${isSelected}" onclick="toggleIpFilter('${l.ip}')" title="Cliquer pour filtrer/exclure cette IP">${l.ip}</td>
                    <td style="color:var(--text-muted); font-size:0.8rem;">${(l.device_id||'').substring(0,15)}...</td>
                    <td>${l.os_parsed || ''}</td>
                    <td>${l.browser_parsed || ''}</td>
                `;
                tbody.appendChild(tr);
                renderedCount++;
                
                if (renderedCount >= MAX_ROWS) break; 
            }
            
            document.getElementById('logsCountBadge').innerText = renderedCount + " entrées affichées";
        }

        // --- 6. GESTION DES MESSAGES / COMMENTAIRES ---
        let userFilter = null;
        function setUserFilter(uid) { 
            userFilter = uid; 
            document.getElementById('activeMsgFilter').classList.add('active');
            document.getElementById('activeUserLabel').innerText = uid;
            applyMsgFilters(); 
            window.scrollTo({top:0, behavior:'smooth'});
        }
        function clearUserFilter() { 
            userFilter = null; 
            document.getElementById('activeMsgFilter').classList.remove('active');
            applyMsgFilters(); 
        }
        
        function applyMsgFilters() {
            const term = document.getElementById('searchMsg').value.toLowerCase();
            const app = document.getElementById('appFilter').value;
            const showDone = document.getElementById('showDone').checked;
            
            document.querySelectorAll('.msg-item').forEach(el => {
                const s = el.dataset; let vis = true;
                if(!showDone && s.status === 'done') vis = false;
                if(app !== 'all' && s.title !== app) vis = false;
                if(userFilter && s.user !== userFilter) vis = false;
                if(term && !s.search.includes(term)) vis = false;
                el.style.display = vis ? 'block' : 'none';
            });
        }

        async function updateStatus(file, action, btn) {
            if(action === 'delete' && !confirm("Supprimer définitivement ce message ?")) return;
            const fd = new FormData(); fd.append('action', action); fd.append('file', file);
            const res = await fetch('index.php', { method:'POST', body: fd });
            const json = await res.json();
            if(json.success) {
                if(action === 'delete') {
                    btn.closest('.msg-item').remove();
                } else {
                    const item = btn.closest('.msg-item');
                    item.dataset.status = json.newStatus;
                    item.classList.toggle('done');
                    btn.innerHTML = `<i class="fas ${json.newStatus==='done'?'fa-undo':'fa-check'}"></i>`;
                    applyMsgFilters();
                }
            }
        }
        
        async function deleteUserAll() {
            if(!confirm("Êtes-vous sûr de vouloir supprimer tous les messages de cet utilisateur ?")) return;
            const fd = new FormData(); fd.append('action', 'delete_all_user'); fd.append('deviceId', userFilter);
            await fetch('index.php', { method:'POST', body: fd });
            location.reload();
        }

        document.addEventListener('DOMContentLoaded', () => { applyMsgFilters(); });
    </script>
</body>
</html>