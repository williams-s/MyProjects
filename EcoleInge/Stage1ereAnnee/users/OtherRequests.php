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
    $bdd = $language::getInstance();//new $language();
    $rowName = $language::getRowName();
    $bdd->connect();
    $responses = [];
    $responses[] = $bdd->showDatabases();
    foreach ($responses as $rep) {
        foreach ($rep as $key) {
            foreach ($key as $value) {
                $response[] = $value;
            }
        }
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
