var express = require('express');
var router = express.Router();
var db = require('../services/database');

/* GET home page. */
router.get('/', async function(req, res, next) {
  var player = await db.get_player("joe@mail.com");
  var games = await db.get_active_games(player);
  res.render('game_list', { player: player, games: games });
});

module.exports = router;
