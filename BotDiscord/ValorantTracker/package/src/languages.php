<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require '../vendor/autoload.php';

use Symfony\Component\Yaml\Yaml;
use Stichoza\GoogleTranslate\GoogleTranslate;

ob_start();


class Languages{

    public $config;
    public $translate;
    protected static $instance = null;
    public function __construct(){
        $this->translate = array();
        $this->config = Yaml::parseFile('../config/French.yaml');
    }


    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }


    public function get(){
        header('Content-Type: application/json');
        echo json_encode($this->config);
        exit();
    }

    public function translate($target){
        $tr = new GoogleTranslate();
        $tr->setSource('fr');
        $tr->setTarget($target);
        foreach ($this->config as $key => $value) {
            $translateSection = array();
            foreach ($value as $key2 => $value2) {
                if (!is_array($value2)) {
                    $translateSection[$key2] = $tr->translate($value2);
                }
                else {
                    foreach ($value2 as $key3 => $value3) {
                        $translateSection[$key2][$key3] = $tr->translate($value3);
                    }
                }
            }
            $this->translate[$key] = $translateSection;
        }     
        header('Content-Type: application/json');
        echo json_encode($this->translate);
        exit();
    }

}

$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);
$languages = Languages::getInstance();
if (isset($data['lang'])) {
    $languages->get();
} else {
    $languages->translate($data['target']);
}

/* $languages = new Languages('English');
$languages->get();

 */