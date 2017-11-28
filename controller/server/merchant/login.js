var express = require('express');
var router = express.Router();
var operatorDb = useMongo().create('operator');
var md5 = require('md5');
//账号密码登录
router.post('/', function(req, res, next) {
    var body = req.body;
    operatorDb.findOne({
        username:body.username,
    } , function(a){
        var data = a.data;
        var messageData = {
            type:'login',
            itemType:'login',
            channel:data && data.company,
            data:body.username,
            ip:req.remoteAddress,
        };
        if(!data || data.company === 'admin'){
            messageData.status = 'null';
            res.sendErrorMessage(0,'账号或密码错误');
        }
        else if(data.password !== md5(body.password)){
            messageData.status = 'fail';
            res.sendErrorMessage(0,'账号或密码错误');
        }
        else if(data.status === 2){
            messageData.status = 'freeze';
            res.sendErrorMessage(0,'账号被锁定');
        }
        else {
            messageData.status = 'success';
            res.useSend(a);
        }
        useMessage.send(messageData);
    });
});
//UID登录
router.post('/qrcode', function(req, res, next) {
    var uid = useWs.getUid(req.body.loginId);
    if(uid){
        operatorDb.findOne({
            uid:uid,
        },function(a){
            var data = a.data;
            var messageData = {
                type:'login',
                itemType:'qrcode',
                channel:data && data.company,
                data:uid,
                content:req.body.loginId,
                ip:req.remoteAddress,
            };
            if(data.status === 2){
                messageData.status = 'freeze';
                res.sendErrorMessage(0,'账号被锁定');
            }else{
                messageData.status = 'success';
                res.useSend(a);
            }
            res.useSend(a);
        });
    }else{
        res.send({
            message:'无效的登录'
        });
    }
});
//修改密码
router.post('/update', function(req, res, next) {
    var body = req.body;
    operatorDb.findOne({
        username:body.username,
    } , function(a){
        var data = a.data;
        var messageData = {
            type:'login',
            itemType:'update',
            channel:data && data.company,
            data:body.username,
            ip:req.remoteAddress,
        };
        if(!data || data.company === 'admin'){
            messageData.status = 'null';
            res.sendErrorMessage(0,'密码错误');
        }
        else if(!data.password || data.password !== md5(body.password)){
            messageData.status = 'fail';
            res.sendErrorMessage(0,'密码错误');
        }
        else if(data.status === 2){
            messageData.status = 'freeze';
            res.sendErrorMessage(0,'账号被锁定');
        }
        else {
            operatorDb.update({
                username:body.username
            },{
                password: md5(body.newPassword),
                status:1
            },function(a){
                if(a.code === 0){
                    messageData.status = 'success';
                }else{
                    messageData.status = 'saveFail';
                }
                useMessage.send(messageData);
                res.useSend(a);
            });
            return;
        }
        useMessage.send(messageData);
    });
});
//重置密码
router.post('/reset', function(req, res, next) {
    var body = req.body;
    operatorDb.findOne({
        company:'admin',
        username:body.username,
    } , function(a){
        var data = a.data;
        var messageData = {
            type:'login',
            itemType:'reset',
            channel:'admin',
            data:body.username,
            ip:req.remoteAddress,
        };
        if(!data){
            messageData.status = 'null';
            res.sendErrorMessage(0,'没有此账户');
        }
        else {
            operatorDb.update({
                username:body.username
            },{
                password: md5(md5('123456')),
                status:0
            },function(a){
                if(a.code === 0){
                    messageData.status = 'success';
                }else{
                    messageData.status = 'saveFail';
                }
                useMessage.send(messageData);
                res.useSend(a);
            });
            return;
        }
        useMessage.send(messageData);
    });
});
//绑定微信
router.post('/bind', function(req, res, next) {
    var body = req.body;
    operatorDb.findOne({
        company:'admin',
        username:body.username,
    } , function(a){
        var data = a.data;
        var messageData = {
            type:'login',
            itemType:'bind',
            channel:'admin',
            data:body.username,
            ip:req.remoteAddress,
        };
        if(!data){
            messageData.status = 'null';
            res.sendErrorMessage(0,'没有此账户');
        }
        else {
            operatorDb.update({
                username:body.username
            },{
                uid: body.uid,
            },function(a){
                if(a.code === 0){
                    messageData.status = 'success';
                }else{
                    messageData.status = 'saveFail';
                }
                useMessage.send(messageData);
                res.useSend(a);
            });
            return;
        }
        useMessage.send(messageData);
    });
});
//解绑微信
router.post('/unbind', function(req, res, next) {
    var body = req.body;
    operatorDb.findOne({
        company:'admin',
        username:body.username,
    } , function(a){
        var data = a.data;
        var messageData = {
            type:'login',
            itemType:'unbind',
            channel:'admin',
            data:body.username,
            ip:req.remoteAddress,
        };
        if(!data){
            messageData.status = 'null';
            res.sendErrorMessage(0,'没有此账户');
        }
        else {
            operatorDb.update({
                username:body.username
            },{
                uid: '',
            },function(a){
                if(a.code === 0){
                    messageData.status = 'success';
                }else{
                    messageData.status = 'saveFail';
                }
                useMessage.send(messageData);
                res.useSend(a);
            });
            return;
        }
        useMessage.send(messageData);
    });
});
exports.router = router;
exports.__path = '/server/merchant/login';
