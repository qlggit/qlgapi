var express = require('express');
var router = express.Router();
router.post('/send', function(req, res, next) {
    useSms.send({
        phone:req.body.phone ,
        ip:req.remoteAddress,
        channel:req.body.channel || 'channel',
        sendType:req.body.sendType || 'sendType',
        userId:req.body.userId,
    } , function(d){
       res.send(d);
    });
});
router.post('/check', function(req, res, next) {
    useSms.check({
        phone:req.body.phone,
        ip:req.remoteAddress,
        channel:req.body.channel || 'channel',
        sendType:req.body.sendType || 'sendType',
        userId:req.body.userId || 'userId',
        code:req.body.sendCode,
    } , function(d){
       res.send(d);
    });
});
exports.router = router;
exports.__path = '/sms';
