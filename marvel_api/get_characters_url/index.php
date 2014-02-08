<?php
ini_set('display_errors', 'On');
	error_reporting(E_ALL);

$public_key = "SOME KEY";
$private_key = "SOME KEY";
$ts = time();
$combination = $ts;
$combination .= $private_key;
$combination .= $public_key;
$hash = md5($combination);

$url = "http://gateway.marvel.com/v1/public/characters?apikey=";
$url .= $public_key;
$url .= "&ts=";
$url .= $ts;
$url .= "&hash=";
$url .= $hash;

if (isset($_GET['secret'])){
	echo $url;
}
else {
	echo 'Missing parameters. Please try again.';
}

?>