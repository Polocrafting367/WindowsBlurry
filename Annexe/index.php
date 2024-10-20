<?php
// Chemin du dossier contenant les images
$dir = "images/";

// Extensions d'images autorisées
$allowed_extensions = array("jpg", "jpeg", "png", "gif");

// Ouvre le dossier
if (is_dir($dir)) {
    if ($dh = opendir($dir)) {
        // Parcourt chaque fichier dans le dossier
        while (($file = readdir($dh)) !== false) {
            // Récupère l'extension du fichier
            $file_extension = pathinfo($file, PATHINFO_EXTENSION);
            
            // Si c'est une image, l'affiche
            if (in_array(strtolower($file_extension), $allowed_extensions)) {
                echo '<img src="' . $dir . $file . '" onclick="fullscreen(this)" alt="' . $file . '">';
            }
        }
        closedir($dh);
    }
}
?>
