var express = require('express');
var router = express.Router();
router.get('/check/:channel', function(req, res, next) {
    var channel = req.params.channel;
    var signature = req.query.signature ;
    var timestamp = req.query.timestamp;
    var nonce = req.query.nonce;
    var echostr = req.query.echostr;
    var wechatData = useConfig.get('wechatOptions')[channel];
    var token = wechatData.token;
    if(signature === useCommon.SHA1([nonce , timestamp , token].sort(function(a , b){return a > b}).join(''))){
        return res.useSend(echostr);
    }
    res.useSend('token error');
});
exports.router = router;
exports.__path = '/wechat/token';