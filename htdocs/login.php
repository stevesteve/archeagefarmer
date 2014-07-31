<?php

$PAGEID = 'login';
$guarded = false;
require 'includes/setup.php';

// #@debug #@todo implement login functionality
$_SESSION['auth'] = true;
$_SESSION['userid'] = 1;
header('Location: '.$_CONFIG['urlbase'].'/');
exit;

if (!empty($_POST)) {
	$_SESSION['auth'] = true;
	$_SESSION['userid'] = $_POST['id'];
	if (array_key_exists('redirect', $_GET)) {
		header('Location: '.$_GET['redirect']);
	} else {
		header('Location: '.$_CONFIG['urlbase'].'/');
	}
	exit;
}

require 'includes/render.php';
