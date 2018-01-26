
var express = require('express');
var router = express.Router();
router.get('/test', function(req, res, next) {
    res.render('test');
});
router.get('/canvas', function(req, res, next) {
    res.render('canvas');
});
exports.router = router;
exports.__path = '/test';
