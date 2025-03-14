<?php
session_start();
require 'db_connect.php';  // Connect to database

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Find user in DB
    $stmt = $conn->prepare("SELECT id, hashpass FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->store_result();
    
    if ($stmt->num_rows > 0) {
        $stmt->bind_result($id, $hashed_password);
        $stmt->fetch();

        // Verify password
        if (password_verify($password, $hashed_password)) {
            $_SESSION['user_id'] = $id;
            $_SESSION['username'] = $username;
            $_SESSION['start_time'] = date("Y-m-d H:i:s");

            // Insert new game record
            $empty_board = str_repeat("-", 16); // Example: 4x4 empty board as a 16-char string
            $score = 0; // Default score
            $stmt = $conn->prepare("INSERT INTO Games (user_id, score, board, start_time) VALUES (?, ?, ?, ?)");
            $stmt->bind_param("iiss", $id, $score, $empty_board, $_SESSION['start_time']);
            $stmt->execute();

            header("Location: tiny.php"); // Redirect to game
            exit();
        } else {
            echo "Invalid password.";
        }
    } else {
        echo "User not found.";
    }
}
?>
