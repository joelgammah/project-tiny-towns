<?php

$db_servername = 'db';
$db_username = 'root';
$db_password = 'root';
$db_name = 'tinytowns';
$conn = new mysqli($db_servername, $db_username, $db_password, $db_name);

if ($conn->connect_error) {
  die('Connection failed: ' . $conn->connect_error);
}

?>
