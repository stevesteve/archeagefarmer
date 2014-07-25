<?php

$PAGEID = 'home';
$guarded = true;
require 'includes/setup.php';

$stmt = $db->prepare('SELECT * FROM `seed` ORDER BY `name`');
$stmt->execute();
$twigcontext['seeds'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

require 'includes/render.php';
