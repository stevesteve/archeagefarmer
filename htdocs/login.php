<?php

$PAGEID = 'login';
$guarded = false;
require 'includes/setup.php';

if (!empty($_POST)) {
	$_SESSION['auth'] = true;
	$_SESSION['userid'] = $_POST['id'];
}

require 'includes/render.php';

