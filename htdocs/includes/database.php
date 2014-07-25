<?php
$db = new PDO(
	'mysql:dbhost='.$_CONFIG['db']['dbhost'].';dbname='.$_CONFIG['db']['dbname'],
	$_CONFIG['db']['username'],
	$_CONFIG['db']['password']
	);
