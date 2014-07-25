<?php

if (!array_key_exists('auth', $_SESSION)||$_SESSION['auth']!=true) {
	header('Location: '.$_CONFIG['urlbase'].'/'.$_CONFIG['forbidden_redirect']);
}
