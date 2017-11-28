var express = require('express');
var router = express.Router();
var channelConfigDb = useMongo().create('channelConfig');
var md5 = require('md5');
//账号密码登录
router.post('/', function(req, res, next) {
    var company = req.body.company;
    var timestamp = req.body.timestamp;
    var token = req.body.token;
    channelConfigDb.findOne({
        company:company,
    } , function(a){
        if(!a.data){
            return res.useSend({});
        }
        res.send({
            code:1-(md5(company+a.data._id+timestamp) === token)
        });
    });
});
exports.router = router;
exports.__path = '/server/token';
