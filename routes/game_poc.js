var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    // Drawing w/h later to be scaled up to 1080/720...
    res.render('game', { width: 108, height: 72 });
});

module.exports = router;
