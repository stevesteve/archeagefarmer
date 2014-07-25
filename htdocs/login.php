<?php

$PAGEID = 'login';
$guarded = false;
require 'includes/setup.php';

if (!empty($_POST)) {
	$_SESSION['auth'] = true;
	$_SESSION['userid'] = $_POST['id'];
	if (array_key_exists('redirect', $_GET)) {
		header('Location: '.$_GET['redirect']);
	} else {
		header('Location: '.$_CONFIG['urlbase']);
	}
	exit;
}

require 'includes/render.php';
