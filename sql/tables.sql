--
-- File generated with SQLiteStudio v3.3.3 on Fri Dec 3 14:13:44 2021
--
-- Text encoding used: System
--
PRAGMA foreign_keys = off;
BEGIN TRANSACTION;

-- Table: game
CREATE TABLE game (game_id INTEGER PRIMARY KEY AUTOINCREMENT);

-- Table: game_participant
CREATE TABLE game_participant (game_id REFERENCES game (game_id), player_id REFERENCES player (player_id) last_seen_game_state REFERENCES game_state (game_state_id));

-- Table: game_state
CREATE TABLE game_state (game_state_id INTEGER PRIMARY KEY AUTOINCREMENT, game_id REFERENCES game (game_id) NOT NULL, next_player REFERENCES player (player_id) NOT NULL, game_state_json BLOB);

-- Table: player
CREATE TABLE player (player_id INTEGER PRIMARY KEY AUTOINCREMENT, player_name TEXT NOT NULL, player_email TEXT NOT NULL);

COMMIT TRANSACTION;
PRAGMA foreign_keys = on;
