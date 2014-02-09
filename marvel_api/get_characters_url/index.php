<?php
ini_set('display_errors', 'Off');
	error_reporting(E_ALL);

$public_key = "INSERT PUBLIC KEY HERE";
$private_key = "INSERT PRIVATE KEY HERE";
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
	$test = file_get_contents($url);
	if ($test === FALSE) {
		echo "error";
	}
	else {
		echo $url;
	}
}
else {
	echo 'Missing parameters. Please try again.';
}

?>