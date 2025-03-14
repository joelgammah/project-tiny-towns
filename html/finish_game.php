<?php
session_start();
require 'db_connect.php';

if (!isset($_SESSION['user_id'])) {
    die("You must be logged in to finish a game.");
}

// Get JSON data from request
$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['board']) || !isset($data['score'])) {
    die("Invalid data.");
}

// Correctly extract board and score
$final_board_state = $data['board']; // Ensure it's from JSON
$score = intval($data['score']);
$end_time = date("Y-m-d H:i:s");

// Update the latest game for the user
$stmt = $conn->prepare("
   UPDATE Games 
   SET board = ?, score = ?, end_time = ?
   WHERE user_id = ? 
   ORDER BY id DESC 
   LIMIT 1
");
$stmt->bind_param("sisi", $final_board_state, $score, $end_time, $_SESSION['user_id']);
$stmt->execute();

// 2) If no row was updated, do an INSERT
if ($stmt->affected_rows === 0) {
    $stmt->close();
    $stmt = $conn->prepare("
       INSERT INTO Games (user_id, board, score, end_time)
       VALUES (?, ?, ?, ?)
    ");
    $stmt->bind_param("isis", $_SESSION['user_id'], $final_board_state, $score, $end_time);
    $stmt->execute();
}

// 3) Check success
if ($stmt->affected_rows > 0) {
    // Log out
    //$_SESSION = [];
    //session_destroy();

    // Return a simple success message
    echo "FINISHED GAME";
    exit();
} else {
    echo "Error saving game.";
    exit();
}

