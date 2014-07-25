<?php

$ROOTDIR = dirname(dirname(__FILE__)).'/';
require $ROOTDIR.'vendor/autoload.php';
require $ROOTDIR.'includes/config.php';
require $ROOTDIR.'includes/database.php';

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
	'pageroot'=>$PAGEROOT,
	'urlbase'=>$_CONFIG['urlbase'],
	'staticurl'=>$_CONFIG['urlbase'].'/'.$_CONFIG['staticurl'],
	);
