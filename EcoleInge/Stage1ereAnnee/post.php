<?php
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

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = htmlspecialchars($_POST['name']); // Échapper les caractères spéciaux pour la sécurité

    // Préparer la requête d'insertion
    $stmt = $conn->prepare("INSERT INTO todo_list (content) VALUES (?)");


    if ($stmt) {
        // Binder les paramètres et exécuter la requête
        $stmt->bind_param("s", $name);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            echo "New record created successfully";
        } else {
            echo "Error: " . $stmt->error;
        }

        $stmt->close();
    } else {
        echo "Erreur de préparation de la requête : " . $conn->error;
    }
}


    

$conn->close();
?>
