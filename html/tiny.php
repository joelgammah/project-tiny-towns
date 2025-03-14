<?php
session_start();
if (!isset($_SESSION['username'])) {
    header("Location: login.html"); // Redirect to login if not logged in
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Tiny Towns Layout</title>
  <link rel="stylesheet" href="tiny.css">
</head>
<body>

    <div class="navbar">
            <p>Welcome, <strong><?php echo $_SESSION['username']; ?></strong>!</p>
            <a href="logout.php">Logout</a>
        </div>
        <button id="finishGame">Finish Game</button>

  
  <div class="page-layout">
    
    
    <div class="card-container">
      
      <!-- Cottage -->
      <div class="card cottage-card" data-building="Cottage"></div>

      <!-- Farm -->
      <div class="card farm-card" data-building="Farm"></div>

      <!-- Chapel -->
      <div class="card chapel-card" data-building="Chapel"></div>

      <!-- Tavern -->
      <div class="card tavern-card" data-building="Tavern"></div>

      <!-- Well -->
      <div class="card well-card" data-building="Well"></div>

      <!-- Theater -->
      <div class="card theater-card" data-building="Theater"></div>

      <!-- Factory -->
      <div class="card factory-card" data-building="Factory"></div>

      <!-- Cathedral of Caterina -->
      <div class="card cathedral-card" data-building="Catedral"></div>



    </div> 
    
   
    <div class="board-and-resources">
      <!-- 4x4 Board -->
      <div class="board">
        <!-- Row 0 -->
        <div class="cell selectable" data-row="0" data-col="0"></div>
        <div class="cell selectable" data-row="0" data-col="1"></div>
        <div class="cell selectable" data-row="0" data-col="2"></div>
        <div class="cell selectable" data-row="0" data-col="3"></div>
        <!-- Row 1 -->
        <div class="cell selectable" data-row="1" data-col="0"></div>
        <div class="cell selectable" data-row="1" data-col="1"></div>
        <div class="cell selectable" data-row="1" data-col="2"></div>
        <div class="cell selectable" data-row="1" data-col="3"></div>
        <!-- Row 2 -->
        <div class="cell selectable" data-row="2" data-col="0"></div>
        <div class="cell selectable" data-row="2" data-col="1"></div>
        <div class="cell selectable" data-row="2" data-col="2"></div>
        <div class="cell selectable" data-row="2" data-col="3"></div>
        <!-- Row 3 -->
        <div class="cell selectable" data-row="3" data-col="0"></div>
        <div class="cell selectable" data-row="3" data-col="1"></div>
        <div class="cell selectable" data-row="3" data-col="2"></div>
        <div class="cell selectable" data-row="3" data-col="3"></div>
      </div>

      
      <div class="resources">
        <div class="resource-card selectable">
          <div class="resource-card-header">Wheat</div>
          <div class="resource-card-body">
            <div class="square yellow"></div>
          </div>
        </div>
        <div class="resource-card selectable">
          <div class="resource-card-header">Brick</div>
          <div class="resource-card-body">
            <div class="square red"></div>
          </div>
        </div>
        <div class="resource-card selectable">
          <div class="resource-card-header">Glass</div>
          <div class="resource-card-body">
            <div class="square blue"></div>
          </div>
        </div>
        <!-- Stack w/ bg -->
        <div class="card stack-card"></div>
      </div>
    </div>

  </div> 
<script src="tiny.js" defer></script>  
</body>
</html>
