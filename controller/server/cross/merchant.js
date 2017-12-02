var express = require('express');
var router = express.Router();
var merchantSettleDb = useMongo().create('merchantSettle');
//账号密码登录
router.post('/settle', function(req, res, next) {
    var body = req.body;
    merchantSettleDb.save({
        name:body.merchantName,
        tel:body.merchantTel,
        address:body.merchantAddress,
        email:body.merchantEmail,
        remark:body.remark,
        status:0,
    } , function(a){
        res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        if(a.code === 0)a.message = '已收到请求，会尽快与您联系';
        res.useSend(a);
    });
});
router.get('/settle/data', function(req, res, next) {
    merchantSettleDb.find({
    } , function(a){
        res.useSend(a);
    });
});
exports.router = router;
exports.__path = '/server/cross/merchant';
