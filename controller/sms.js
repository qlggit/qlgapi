var express = require('express');
var router = express.Router();
router.get('/send', function(req, res, next) {
    useSms.send({
        phone:req.query.phone || '13594035744',
        ip:req.remoteAddress,
        channel:'pc',
        sendType:'sendType',
        userId:'userId',
    } , function(d){
       res.send(d);
    });
});
router.get('/check', function(req, res, next) {
    useSms.check({
        phone:req.query.phone || '13594035744',
        ip:req.remoteAddress,
        channel:'pc',
        sendType:'sendType',
        userId:'userId',
        code:req.query.code,
    } , function(d){
       res.send(d);
    });
});
exports.router = router;
exports.__path = '/sms';
