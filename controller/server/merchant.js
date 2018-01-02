var express = require('express');
var router = express.Router();
router.post('/add', function(req, res, next) {
    useData.addMerchant(req.body,function(a){
        res.send(a);
    });
});
router.get('/add', function(req, res, next) {
    useData.addMerchant(req.query,function(a){
        res.send(a);
    });
});
exports.router = router;
exports.__path = '/server/merchant';
