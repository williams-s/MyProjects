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
    $config = Yaml::parseFile('../config/config.yaml');
    $language = $config['database']['language'];
    $data = json_decode(file_get_contents('php://input'), true);
    $bdd = $language::getInstance();//new $language();
    $bdd->connect();

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $response= $bdd->insertRequest('discordInfos', $data, false);
    } elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $response = $bdd->selectAllOrderByRequest('discordInfos','guild_id','ASC');
    } elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        $response = $bdd->updateRequest("discordInfos", $data, ['guild_id'=>$data['guild_id']]);
    } elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $response = $bdd->deleteRequest("discordInfos", ['nom'=>$data['nom'], 'tag'=>$data['tag']]);
    } else {
        throw new Exception("Méthode non supportée");
    }
} catch (Exception $e) {
    $response = ['error' => $e->getMessage()];
}

header('Content-Type: application/json');
echo json_encode($response);
exit();

ob_end_clean();

header('Content-Type: application/json');
echo json_encode($response);
exit();
?>
