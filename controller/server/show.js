var express = require('express');
var router = express.Router();
router.get('/video', function(req, res, next) {
    res.render('show/video',{
        title:req.query.title,
        src:req.query.src,
    });
});
exports.router = router;
exports.__path = '/server/show';
