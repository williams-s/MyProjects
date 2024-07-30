<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Insertion de données dans MySQL</title>
</head>
<body>
    <h1>Insertion de données dans MySQL</h1>


    <?php
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);

    require '../vendor/autoload.php';
    spl_autoload_register(function ($class_name) {
        include $class_name . '.php';
    });

    use Stichoza\GoogleTranslate\GoogleTranslate;
/*     $var = "$language";
    $bdd = new $var();
    $bdd->connect();
    $sql = $bdd->insertRequest('users', ['nom' => 'elise', 'password' => 'araignee']);
    //$sql2 = $bdd->updateRequest('users', ['nom' => 'test55', 'password' => 'test56'],['nom' => 'test', 'password' => 'test']);
    //$sql3 = $bdd->deleteRequest('users', ['nom' => 'hey']);
    $sql4 = $bdd->selectRequest('users','*' ,['password' => 'cdaazd']);
    
    //echo $sql . "<br>";
    //echo $sql2 . "<br>";
    //echo $sql3 . "<br>";
    echo $sql4 . "<br>"; */
    //echo $sql5 . "<br>";   

    $tr = new GoogleTranslate();
    $tr->setSource('en');
    $tr->setTarget('fr');
    echo $tr->translate('hello');

    ?>
</body>
</html> 
  