<?php
require 'MySql.php';

class PostgreSQL extends MySQL {

    protected function __construct() {
        parent::__construct();
        $this->selectMethod = "fetch(PDO::FETCH_ASSOC)";
        $this->showDatabasesRequest = "SELECT datname FROM pg_catalog.pg_database";
        self::$rowName = "datname";
    }

    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function connect(){
        $dsn = "pgsql:host={$this->servername};dbname={$this->dbname}";
        try {
            $this->conn = new PDO($dsn, $this->usernameBDD, $this->passwordBDD, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, 
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC, 
            ]);
        } catch (PDOException $e) {
            throw new Exception("Connexion échouée : " . $e->getMessage());
        }
        return $this->conn; 
    }

    public function fetchSql($result){
        return $result->fetch(PDO::FETCH_ASSOC);
    }

    public function returnId($sql,$bool){
        $sql2 = $sql;
        if($bool){
            $sql2 = $sql . " RETURNING id";
        }
        $stmt = $this->conn->query($sql2);
        return ($stmt->fetch(PDO::FETCH_ASSOC))['id'];
    }


    public function updateParameters($sql){
        if ($this->conn->exec($sql) !== FALSE) {
            return true;
        } else {
            return false;
        }
    }
}
?>