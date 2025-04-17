<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require '../vendor/autoload.php';

use Symfony\Component\Yaml\Yaml;
use Stichoza\GoogleTranslate\GoogleTranslate;

ob_start();

class Languages {

    public $config;
    public $translate;
    protected static $instance = null;

    public function __construct() {
        $this->translate = array();
        $this->config = Yaml::parseFile('../config/French.yaml');
    }

    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function get() {
        header('Content-Type: application/json');
        echo json_encode($this->config);
        exit();
    }

    public function translate($target) {
        if (!$target || !is_string($target)) {
            echo json_encode(["error" => "Target language is invalid."]);
            exit();
        }

        $tr = new GoogleTranslate();
        $tr->setSource('fr');
        $tr->setTarget($target);
        $tr->setOptions([ 'curl' => [ CURLOPT_SSL_VERIFYPEER => false ] ]);

        foreach ($this->config as $key => $value) {
            $translateSection = array();
            foreach ($value as $key2 => $value2) {
                if (!is_array($value2)) {
                    $translateSection[$key2] = $tr->translate($value2);
                } else {
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

$target = null;
$langFlag = false;

if ($argc > 1) {
    foreach ($argv as $arg) {
        if (strpos($arg, 'target=') === 0) {
            $target = substr($arg, 7);
        }
        if ($arg === 'lang=true') {
            $langFlag = true;
        }
    }
}

if ($langFlag) {
    $languages = Languages::getInstance();
    $languages->get();
} else if ($target) {
    $languages = Languages::getInstance();
    $languages->translate($target);
} else {
    echo json_encode(["error" => "Target language is required"]);
    exit();
}
