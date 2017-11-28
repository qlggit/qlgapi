var express = require('express');
var router = express.Router();
var operatorDb = useMongo().create('operator');
var md5 = require('md5');
router.post('/add', function(req, res, next) {
    operatorDb.save({
        createOperator:req.body.createOperator,
        company:req.body.company,
        username:req.body.username,
        nickname:req.body.nickname,
        status:1,
        uid:req.body.uid,
        type:1,
        roleId:[]
    } , function(a){
        res.useSend(a);
    });
});
exports.router = router;
exports.__path = '/server/merchant/permission/qrcode';
