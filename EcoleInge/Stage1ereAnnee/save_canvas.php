<?php
// Activer les erreurs pour le débogage
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


require 'vendor/autoload.php';

use Symfony\Component\Yaml\Yaml;

$config = Yaml::parseFile('config.yaml');

$servername = $config['database']['host'];
$username = $config['database']['username'];
$password = $config['database']['password'];
$dbname = $config['database']['dbname'];

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connexion échouée : " . $conn->connect_error);
}
// Définir l'en-tête de réponse comme JSON
header('Content-Type: application/json');

try {
    // Lire le contenu de la requête POST
    $data = json_decode(file_get_contents('php://input'), true);

    if ($data && isset($data['image']) && isset($data['name'])) {
        $image = $data['image'];
        $name = $data['name'];

        // Vérifier si l'image est une data URL
        if (preg_match('/^data:image\/(\w+);base64,/', $image, $type)) {
            $image = substr($image, strpos($image, ',') + 1);
            $type = strtolower($type[1]); // jpg, png, gif

            if (!in_array($type, ['jpg', 'jpeg', 'png', 'gif'])) {
                throw new \Exception('Type de fichier image non supporté : ' . $type);
            }

            $image = base64_decode($image);

            if ($image === false) {
                throw new \Exception('Base64_decode a échoué');
            }
        } else {
            throw new \Exception('Le lien de l\'image n\'est pas valide');
        }

        // Sauvegarder l'image dans un fichier
        $filePath = 'uploads/' . uniqid() . '.' . $type;
        $fileName = basename($filePath); // Récupérer seulement le nom du fichier à partir du chemin complet
        // Creer le dossier uploads s'il n'existe pas
        // Générer le lien vers view_image.html avec le paramètre filePath
        $link = 'view_image.html?filePath=' . urlencode('uploads/' . $fileName);
        if (!file_put_contents($filePath, $image)) {
            throw new \Exception('Impossible de sauvegarder le fichier image');
        }

        // Renvoyer le chemin de l'image sauvegardée
        $conn->query("INSERT INTO users (username, photo_url) VALUES ('$name', '$filePath')");
        echo json_encode(['filePath' => $filePath]);

    } else {
        throw new \Exception('Aucune image reçue');
    }
} catch (Exception $e) {
    // Renvoyer l'erreur en format JSON
    echo json_encode(['error' => $e->getMessage()]);
}
?>
