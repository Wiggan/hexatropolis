var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    // Drawing w/h later to be scaled up to 1080/720...
    res.render('game', { width: 1080, height: 720, scale: 6 });
});

module.exports = router;
