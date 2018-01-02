var express = require('express');
var router = express.Router();
router.get('/member', function(req, res, next) {
    res.render('agreement/member');
});
exports.router = router;
exports.__path = '/server/agreement';
