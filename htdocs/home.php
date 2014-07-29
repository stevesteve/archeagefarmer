<?php

$PAGEID = 'home';
$guarded = true;
require 'includes/setup.php';
require 'includes/database.php';

$stmt = $db->prepare('SELECT * FROM `seed` ORDER BY `name`');
$stmt->execute();
$seeds = $stmt->fetchAll(PDO::FETCH_ASSOC);
$twigcontext['seeds'] = $seeds;
$jscontext['seeds'] = $seeds;

require 'includes/render.php';
