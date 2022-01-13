var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('game_3d', { width: 1080, height: 720});
});

module.exports = router;
