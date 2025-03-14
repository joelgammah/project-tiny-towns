CREATE OR REPLACE DATABASE tinytowns;
USE tinytowns;

DROP TABLE IF EXISTS Users;
CREATE TABLE Users
(
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  hashpass VARCHAR(255) NOT NULL
);

DROP TABLE IF EXISTS Games;
CREATE TABLE Games
(
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  score INT NOT NULL,
  board VARCHAR(16) NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS Achievements;
CREATE TABLE Achievements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  points INT NOT NULL DEFAULT 0
);

DROP TABLE IF EXISTS User_Achievements;
CREATE TABLE User_Achievements (
  user_id INT NOT NULL,
  achievement_id INT NOT NULL,
  unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, achievement_id),
  FOREIGN KEY (user_id) REFERENCES Users(id),
  FOREIGN KEY (achievement_id) REFERENCES Achievements(id)
);

INSERT INTO Users (username, hashpass) VALUES ("admin", "$2y$10$EiqdAQi7/8.qHBOxhCID8OVkwX6gqlI3t97ljjQeiQ9dI8gwD32Sq");
INSERT INTO Users (username, hashpass) VALUES ("guest", "$2y$10$co9lYxNeQOx7I1MmPgqP2OVO3LX7QEi/SeUIgY8EQfLpC1unyv0bS");
INSERT INTO Users (username, hashpass) VALUES ("tstark", "$2y$12$N7lIH8ZyCpK4NOygfeCcfOSAfDmMj9T628G/HiSJPhADnw2hzhI.6");
INSERT INTO Users (username, hashpass) VALUES ("srogers", "$2y$12$z84JEEOiUmKZilyXGwKniOQUpz29AkSIrvSaxQXGcBQ/ADpvVMHFm");
INSERT INTO Users (username, hashpass) VALUES ("nromanov", "$2y$12$raeT6HkiQGaJJ4uo6iX.2eNiYnTH4a6hkadaGUGQOkD3rrZfXQofq");

INSERT INTO Games (user_id, score, board, start_time)
  VALUES (4, 80, "????????????????", "2025-03-03 12:34:56");
INSERT INTO Games (user_id, score, board, start_time)
  VALUES (3, 100, "????????????????", "2025-03-02 12:34:56");
INSERT INTO Games (user_id, score, board, start_time)
  VALUES (1, 50, "????????????????", "2025-03-01 12:34:56");
INSERT INTO Games (user_id, score, board, start_time)
  VALUES (5, 90, "????????????????", "2025-02-28 12:34:56");
INSERT INTO Games (user_id, score, board, start_time)
  VALUES (2, 70, "????????????????", "2025-02-27 12:34:56");
INSERT INTO Games (user_id, score, board, start_time)
  VALUES (5, 95, "????????????????", "2025-02-26 12:34:56");
INSERT INTO Games (user_id, score, board, start_time)
  VALUES (3, 60, "????????????????", "2025-02-25 12:34:56");
INSERT INTO Games (user_id, score, board, start_time)
  VALUES (4, 85, "????????????????", "2025-02-24 12:34:56");

INSERT INTO Achievements (name, description, points) VALUES ("Perfect Town", "Finish a game with no empty spaces.", 10);
INSERT INTO Achievements (name, description, points) VALUES ("Master Builder", "Score 50+ points in a single game.", 20);
INSERT INTO Achievements (name, description, points) VALUES ("Symmetry Seeker", "Build a fully symmetrical town.", 50);
INSERT INTO Achievements (name, description, points) VALUES ("Speed Runner", "Complete a game in under 3 minutes.", 10);
INSERT INTO Achievements (name, description, points) VALUES ("Unlucky Streak", "Lose three games in a row.", 20);

INSERT INTO User_Achievements (user_id, achievement_id) VALUES (3, 2);
INSERT INTO User_Achievements (user_id, achievement_id) VALUES (4, 1);
INSERT INTO User_Achievements (user_id, achievement_id) VALUES (3, 5);
INSERT INTO User_Achievements (user_id, achievement_id) VALUES (5, 3);
INSERT INTO User_Achievements (user_id, achievement_id) VALUES (5, 5);
INSERT INTO User_Achievements (user_id, achievement_id) VALUES (4, 3);
INSERT INTO User_Achievements (user_id, achievement_id) VALUES (4, 2);