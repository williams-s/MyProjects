<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require '../vendor/autoload.php';

use Symfony\Component\Yaml\Yaml;

$yamlFile = 'config.yaml';

$config = Yaml::parseFile($yamlFile);

$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

//$config['database']['language'] = $data['language'];
echo implode(" ",$config['database']['language']);
echo implode(" ",$config);
//echo implode(" ",$config['database']['language']);

$newYamlContent = Yaml::dump($config);

file_put_contents($yamlFile, $newYamlContent);

$configAfter = Yaml::parseFile($yamlFile);

$response = [];

if ($configAfter['database']['language'] === $data['language']) {
    $response['success'] = 1;
} else {
    $response['success'] = 0;
}

header('Content-Type: application/json');
echo json_encode($response);
exit();
?>
