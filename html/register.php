<?php
require 'db_connect.php'; // Include database connection

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = filter_input(INPUT_POST, 'username', FILTER_SANITIZE_SPECIAL_CHARS);
    $password = $_POST['password'];

    if (!$username || !$password) {
        die("Invalid input. Please enter a valid username and password.");
    }

    // Check if username already exists
    $stmt = $conn->prepare("SELECT id FROM Users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        die("Username already exists. Please choose another.");
    }

    // Hash the password
    $password_hash = password_hash($password, PASSWORD_DEFAULT);

    // Insert new user
    $stmt = $conn->prepare("INSERT INTO Users (username, hashpass) VALUES (?, ?)");
    $stmt->bind_param("ss", $username, $password_hash);

    if ($stmt->execute()) {
        echo "Registration successful. <a href='login.html'>Login here</a>";
    } else {
        echo "Registration failed. Please try again.";
    }

    $stmt->close();
}

$conn->close(); // Close connection
?>

<form method="POST">
    <input type="text" name="username" required placeholder="Enter Username"><br>
    <input type="password" name="password" required placeholder="Enter Password"><br>
    <button type="submit">Register</button>
</form>
