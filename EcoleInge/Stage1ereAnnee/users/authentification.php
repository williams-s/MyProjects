<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require '../vendor/autoload.php';
spl_autoload_register(function ($class_name) {
    include $class_name . '.php';
});

use Symfony\Component\Yaml\Yaml;

ob_start();

try {
    $response = [];
    $data = json_decode(file_get_contents('php://input'), true);
    $config = Yaml::parseFile('config.yaml');
    $language = $config['database']['language'];
    $bdd = $language::getInstance();
    $bdd->connect();

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $response['success'] = $bdd->insertRequest("users", $data,true);    
    } elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {

    } elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        $response['success'] = $bdd->updateRequest("users", $data, ['id' => $data['id']]);

    } elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $response['success'] = $bdd->deleteRequest("users", ['id' => $data['id']]);
    } else {
        throw new Exception("Méthode non supportée");
    }
} catch (Exception $e) {
    $response = ['error' => $e->getMessage()];
}



ob_end_clean();

header('Content-Type: application/json');
echo json_encode($response);
exit();
?>
