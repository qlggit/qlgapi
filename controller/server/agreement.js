var express = require('express');
var router = express.Router();
router.get('/:type', function(req, res, next) {
    res.render('agreement/'+req.params.type);
});
exports.router = router;
exports.__path = '/server/agreement';
