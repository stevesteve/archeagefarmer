<?php

error_reporting(E_ALL);



$PAGEROOT = 'home';
require 'includes/setup.php';

$stmt = $db->prepare('SELECT * FROM `seed` ORDER BY `name`');
$stmt->execute();
$twigcontext['seeds'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo $twig->render('home.twig', $twigcontext);
