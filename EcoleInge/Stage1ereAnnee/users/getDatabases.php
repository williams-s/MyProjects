<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require '../vendor/autoload.php';

use Symfony\Component\Yaml\Yaml;

$config = Yaml::parseFile('config.yaml');

$servername = $config['database']['host'];
$username = $config['database']['username'];
$password = $config['database']['password'];

$conn = new mysqli($servername, $username, $password);


if ($conn->connect_error) {
    header('Content-Type: application/json');
    echo json_encode(['error' => "Connexion échouée : " . $conn->connect_error]);
    exit();
}

$sql = "SHOW DATABASES";
$result = $conn->query($sql);

$databases = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $databases[] = $row['Database'];
    }
}

$conn->close();

echo json_encode($databases);
?>