var express = require('express');
var router = express.Router();
var roleDb = useMongo().create('permissionRelation');
var operatorDb = useMongo().create('operator');
var md5 = require('md5');
router.get('/user', function(req, res, next) {
    var searchData = {
        company:req.query.company,
    };
    if(req.query.name)searchData.name = {$regex:new RegExp('.*'+req.query.name+'.*')};
    operatorDb.find(searchData,function (a) {
        res.send(a);
    });
});
router.get('/userInfo', function(req, res, next) {
    var findData = {};
    if(req.query.username){
        findData.username = req.query.username;
    }
    if(req.query.uid){
        findData.uid = req.query.uid;
    }
    if(req.query._id){
        findData._id = req.query._id;
    }
    operatorDb.findOne(findData,function (a) {
        res.send(a);
    });
});
router.post('/userAdd', function(req, res, next) {
    if(req.body.type === '99')req.body.type = 50;
    operatorDb.findOne({
        username:req.body.username
    } , function(a){
        if(a.data){
            return res.send({message:'用户名已存在'});
        }
        operatorDb.save({
            createOperator:req.body.createOperator,
            company:req.body.company,
            username:req.body.username,
            nickname:req.body.nickname,
            password:md5(md5('123456')),
            status:0,
            type:req.body.type || 1,
            roleId:[]
        } , function(a){
            res.useSend(a);
        });
    });
});
router.post('/userUpdate', function(req, res, next) {
    if(req.body.type === '99')req.body.type = 50;
    var sendData = {
        type:req.body.type,
    };
    if(req.body.roleId)sendData.roleId = req.body.roleId.split(',');
    operatorDb.update({_id:req.body._id,company:req.body.company},sendData , function(a){
        res.useSend(a);
    });
});
router.post('/userDelete', function(req, res, next) {
    operatorDb.del({_id:req.body._id,company:req.body.company} , function(a){
        res.useSend(a);
    });
});
exports.router = router;
exports.__path = '/server/merchant/permission';
