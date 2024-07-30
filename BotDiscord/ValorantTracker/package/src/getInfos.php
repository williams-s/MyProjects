<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require '../../../vendor/autoload.php';
spl_autoload_register(function ($class_name) {
    include $class_name . '.php';
});


use Symfony\Component\Yaml\Yaml;

// Capture tout ce qui est émis par le script
ob_start();

try {
    $response = [];
    $config = Yaml::parseFile('../config/config.yaml');
    $language = $config['database']['language'];
    $data = json_decode(file_get_contents('php://input'), true);
    $bdd = $language::getInstance();//new $language();
    $bdd->connect();

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $response= $bdd->insertRequest('users', $data, false);
    } elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $response = $bdd->selectAllOrderByRequest('users','nom','ASC');
    } elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        $response = $bdd->updateRequest("users", $data, ['nom'=>$data['nom']]);
    } elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $response = $bdd->deleteRequest("users", ['nom'=>$data['nom'], 'tag'=>$data['tag']]);
    } else {
        throw new Exception("Méthode non supportée");
    }
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
