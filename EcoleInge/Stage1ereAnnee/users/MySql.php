<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require '../vendor/autoload.php';

use Symfony\Component\Yaml\Yaml;

class MySQL {
    protected static $instance = null;
    protected static $rowName = "Database";
    protected $conn;
    protected $config;
    protected $servername;
    protected $usernameBDD;
    protected $passwordBDD;
    protected $dbname;
    protected $selectMethod = "fetch_assoc()";
    protected $showDatabasesRequest = "SHOW DATABASES";
    //protected $selectMethodArgs = "()";

    protected function __construct() {
        $this->config = Yaml::parseFile('config.yaml');
        $this->servername = $this->config['database']['host'];
        $this->usernameBDD = $this->config['database']['username'];
        $this->passwordBDD = $this->config['database']['password'];
        $this->dbname = $this->config['database']['dbname'];
    }

    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function connect(){
        $this->conn = new mysqli($this->servername, $this->usernameBDD, $this->passwordBDD, $this->dbname);
        if ($this->conn->connect_error) {
            throw new Exception("Connexion échouée : " . $this->conn->connect_error);
        }
        return $this->conn; 
    }

    public function insertRequest($table, $data, $returnId){
        $columns = implode(', ', array_keys($data));
        $values = $this->setSyntaxeValues($data);
        $sql = "INSERT INTO $table ($columns) VALUES ($values)";
        return $this->returnId($sql, $returnId);
    }

    public function updateRequest($table, $data, $conditions){
        $set = [];
        foreach ($data as $key => $value) {
            if ($key === "id" || $key === "id_Database_Rights") {
                continue;
            }
            else {
                $set[] = "$key =" . $this->escapeValue($value);
            }
        }
        $sets = implode(', ', $set);
        $conditionsTab = [];
        foreach ($conditions as $key => $value) {
            $conditionsTab[] = "$key =" . $this->escapeValue($value);
        }
        $condition = implode(' AND ', $conditionsTab);
        $sql = "UPDATE $table SET $sets WHERE $condition";
        return $this->updateParameters($sql);
    }

    public function deleteRequest($table, $conditions){
        $conditionsTab = [];
        foreach ($conditions as $key => $value) {
            $conditionsTab[] = "$key =" . $this->escapeValue($value);
        }
        $condition = implode(' AND ', $conditionsTab);
        $sql = "DELETE FROM $table WHERE $condition";
        if ($this->conn->query($sql) === TRUE) {
            return true;
        } else {
            return false;
        }
    }

    public function selectRequest($table, $columns, $conditions){
        $columns = implode(', ', $columns);
        $conditionsTab = [];
        foreach ($conditions as $key => $value) {
            $conditionsTab[] = "$key =" . $this->escapeValue($value);
        }
        $condition = implode(' AND ', $conditionsTab);
        $sql = "SELECT $columns FROM $table WHERE $condition";
        $res = [];
        if ($result = $this->conn->query($sql)) {
            while ($row = $this->fetchSql($result)) {
                $res[] = $row;
            }
        }
        return $res;
    }

    public function selectAllRequest($table){
        $sql = "SELECT * FROM $table";
        $res = [];
            if ($result = $this->conn->query($sql)) {
                $tmp = $this->selectMethod;
                while ($row = $this->fetchSql($result)) {
                    $res[] = $row;
                }
            }
        return $res;
    }

    public function selectAllOrderByRequest($table, $order,$asc){
        $sql = "SELECT * FROM $table ORDER BY $order $asc";
        $res = [];
        if ($result = $this->conn->query($sql)) {
            $tmp = $this->selectMethod;
            while ($row = $this->fetchSql($result)) {
                $res[] = $row;
            }
        }
        return $res;
    }

    public function showDatabases(){
        $res = [];
        if ($result = $this->conn->query($this->showDatabasesRequest)) {
            while ($row = $this->fetchSql($result)) {
                $res[] = $row;
            }
        }
        return $res;
    }

    protected function escapeValue($value) {
        if (is_null($value)) {
            return 'NULL';
        } elseif (is_int($value) || is_float($value)) {
            return $value;
        } else {
            return "'" . addslashes($value) . "'";
        }
    }

    public function setSyntaxeValues($data){
        $values = [];
        foreach ($data as $value) {
            $values[] = $this->escapeValue($value);
        }
        return implode(', ', $values);
    }


    public function updateParameters($sql){
        if ($this->conn->query($sql) === TRUE) {
            return true;
        } else {
            return false;
        }
    }
    


    public function fetchSql($result){
        return $result->fetch_assoc();
    }

    public function returnId($sql, $bool){
        if ($result = $this->conn->query($sql) === TRUE) {
            if ($bool) {
                $result2 =$this->conn->query("SELECT LAST_INSERT_ID() as id");
                return $result2->fetch_assoc()['id'];
            }
            return true;
        } else {
            return 0;
        }
    }

    public static function getRowName(){
        return self::$rowName;
    }
}

?>