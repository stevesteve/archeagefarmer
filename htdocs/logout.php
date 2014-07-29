<?php

$PAGEID = 'logout';
$guarded = false;
require 'includes/setup.php';

session_destroy();
header('Location: '.$_CONFIG['urlbase'].'/');
