<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require '../vendor/autoload.php';
spl_autoload_register(function ($class_name) {
    include $class_name . '.php';
});

use Symfony\Component\Yaml\Yaml;

// Capture tout ce qui est émis par le script
ob_start();

try {
    $response = [];
    $data = json_decode(file_get_contents('php://input'), true);
    $config = Yaml::parseFile('config.yaml');
    $language = $config['database']['language'];
    $bdd = $language::getInstance();
    $bdd->connect();

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $response['success'] = $bdd->insertRequest("database_rights", $data,false);    
    } elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
        //$response = $bdd->selectRequest("database_rights", '*', ['id_user' => $data['id_user']]);
    } elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        $response['success'] = $bdd->updateRequest("database_rights", $data, ['id_user' => $data['id_user'], 'database_name' => $data['database_name']]);
    } elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $response['success'] = $bdd->deleteRequest("database_rights", ['id_user' => $data['id_user'], 'database_name' => $data['database_name']]);
    } else {
        throw new Exception("Méthode non supportée");
    }
    //$bdd->disconnect();
} catch (Exception $e) {
    $response = ['error' => $e->getMessage()];
}

header('Content-Type: application/json');
echo json_encode($response);
exit();

// Supprimer toute sortie capturée avant d'envoyer le JSON
ob_end_clean();

// Envoyer la réponse JSON
header('Content-Type: application/json');
echo json_encode($response);
exit();
?>
