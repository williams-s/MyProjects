<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require 'vendor/autoload.php';

use Symfony\Component\Yaml\Yaml;

$config = Yaml::parseFile('quiz.yaml');

$servername = $config['database']['host'];
$username = $config['database']['username'];
$password = $config['database']['password'];
$dbname = $config['database']['dbname'];

// Connexion à la base de données
$conn = new mysqli($servername, $username, $password, $dbname);

// Vérifier la connexion
if ($conn->connect_error) {
    // Gérer l'erreur de connexion
    $error = ["error" => "Connexion échouée : " . $conn->connect_error];
    header('Content-Type: application/json');
    echo json_encode($error);
    exit;
}

// Requête SQL pour récupérer les données
$sql = "SELECT * FROM quiz";
$result = $conn->query($sql);

$todo = [];

if ($result->num_rows > 0) {
    // Récupérer les données de chaque ligne
    while ($row = $result->fetch_assoc()) {
        $todo[] = $row;
    }
}

$conn->close();

// Renvoyer les données sous forme de JSON
header('Content-Type: application/json');
echo json_encode($todo);
exit;
?>
