<?php

$ROOTDIR = dirname(dirname(__FILE__));

require $ROOTDIR.'/includes/config.php';
session_start();
if (isset($guarded)&&$guarded===true) {
	require 'guardian.php';
}

require $ROOTDIR.'/vendor/autoload.php';

// initiating whoops
$whoops = new \Whoops\Run;
$whoops->pushHandler(new \Whoops\Handler\PrettyPageHandler);
$whoops->register();

// initiating twig
Twig_Autoloader::register();
$loader = new Twig_Loader_Filesystem('templates');
$twig = new Twig_Environment($loader, array(
    'debug' => $_CONFIG['debug'],
));

// initial twig context
$twigcontext = array(
	'pageid'=>$PAGEID,
	'urlbase'=>$_CONFIG['urlbase'],
	'auth'=>array_key_exists('auth', $_SESSION)?$_SESSION['auth']:false,
	'staticurl'=>$_CONFIG['urlbase'].'/'.$_CONFIG['staticurl'],
	);
