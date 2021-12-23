const db = require('better-sqlite3')('hexatropolis.db', { fileMustExist: true, verbose: console.log });

function create_game(player_ids, initial_game_state) {
    const info = db.prepare(`INSERT INTO game (game_id) VALUES (null)`).run();
    player_ids.forEach((player_id) => {
        db.prepare(`INSERT INTO game_participants (game_id, player_id) VALUES (?, ?)`).run(info.lastInsertRowid, player_id);
    });
    db.prepare(`INSERT INTO game_state (game_id, next_player, game_state_json) VALUES (?, ?)`).run(info.lastInsertRowid, player_ids[0], initial_game_state);
}

function get_players_in_game(game_id) {
    db.prepare(`SELECT * FROM game_participant JOIN player ON game_participant.player_id = player.player_id JOIN game ON game_participant.game_id = game.game_id WHERE game_participant.game_id = ?`).all([game_id]);
}

function turn(player_id, game_id, new_game_state) {
    const players = get_players_in_game(game_id);
    var player_index = players.indexOf(player_id);
    var next_player_id = players[(player_index + 1) % players.length];
    db.prepare(`INSERT INTO game_state (game_id, next_player, game_state_json) VALUES (?, ?)`).run(game_id, next_player_id, new_game_state);
}

module.exports = {
    create_game,
    get_players_in_game,
    turn
}