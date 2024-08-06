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
    $config = Yaml::parseFile('../config/config.yaml');
    $language = $config['database']['language'];
    $data = json_decode(file_get_contents('php://input'), true);
    $bdd = $language::getInstance();//new $language();
    $bdd->connect();
/*     $matchId = $data['matchId'] ?? null;
    $nom = $data['nom'] ?? null;
    $tag = $data['tag'] ?? null;
    $tier = $data['tier'] ?? null;
    $rr = $data['rr'] ?? 0;
    $elo = $data['elo'] ?? null;
    $past_rank = $data['past_rank'] ?? null;
    $past_rr = $data['past_rr'] ?? 0;
    $win = $data['win'] ?? 0;
    $lose = $data['lose'] ?? 0;
    $draw = $data['draw'] ?? 0;
    $usersData = [
        'matchId' => $matchId,
        'nom' => $nom,
        'tag' => $tag,
        'tier' => $tier,
        'rr' => $rr,
        'elo' => $elo,
        'past_rank' => $past_rank,
        'past_rr' => $past_rr,
        'win' => $win,
        'lose' => $lose,
        'draw' => $draw
    ]; */

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $response= $bdd->insertRequest('users', $data, false);
/*         $select = $bdd->selectRequest("discordInfos", ["id"],['guild_id' => $data['guild_id']],true);
        $response = $bdd->updateRequest("users", ["id_discord" => $select[0]['id']], ['id' => $id]);  //selectAllOrderByRequest('users','nom','ASC'); */
    } elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $response = $bdd->selectRequest("users,discordInfos", ["users.*","discordInfos.*"],["users.id_discord" => "discordInfos.id"],false);  //selectAllOrderByRequest('users','nom','ASC');
    } elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        $response = $bdd->updateRequest("users", $data, ['nom'=>$data['nom'],'tag'=>$data['tag'],'id_discord'=>$data['id_discord']]);
    } elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $response = $bdd->deleteRequest("users", ['nom'=>$data['nom'], 'tag'=>$data['tag'], 'id_discord'=>$data['id_discord']]);
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
