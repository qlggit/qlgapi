var express = require('express');
var router = express.Router();
var roleDb = useMongo().create('permissionRelation');
var operatorDb = useMongo().create('operator');
var md5 = require('md5');
router.get('/role', function(req, res, next) {
    useData.getRole({
        company:'admin',
    },function (a) {
        res.send(a);
    })
});
router.post('/roleAdd', function(req, res, next) {
    roleDb.save({
        createOperator:req.body.createOperator,
        company:'admin',
        name:req.body.name,
        permissionCode:[],
        groupId:[],
        menuCode:[]
    } , function(a){
        res.useSend(a);
    });
});
router.post('/roleUpdate', function(req, res, next) {
    var sendData = {};
    if(req.body.permissionCode)sendData.permissionCode = req.body.permissionCode.split(',');
    if(req.body.groupId)sendData.groupId = req.body.groupId.split(',');
    if(req.body.menuCode)sendData.menuCode = req.body.menuCode.split(',');
    roleDb.update({_id:req.body._id,company:'admin'},sendData, function(a){
        res.useSend(a);
    });
});
router.post('/roleDelete', function(req, res, next) {
    roleDb.del({_id:req.body._id,company:'admin'} , function(a){
        res.useSend(a);
    });
});

router.get('/user', function(req, res, next) {
    operatorDb.find({
        company:'admin',
    },function (a) {
        res.send(a);
    })
});
router.post('/userAdd', function(req, res, next) {
    if(req.body.type === '99')req.body.type = 50;
    operatorDb.save({
        createOperator:req.body.createOperator,
        company:'admin',
        username:req.body.username,
        password:md5(md5('123456')),
        status:0,
        type:req.body.type || 1,
        roleId:[]
    } , function(a){
        res.useSend(a);
    });
});
router.post('/userUpdate', function(req, res, next) {
    if(req.body.type === '99')req.body.type = 50;
    var sendData = {
        type:req.body.type,
    };
    if(req.body.roleId)sendData.roleId = req.body.roleId.split(',');
    operatorDb.update({_id:req.body._id,company:'admin'},sendData , function(a){
        res.useSend(a);
    });
});
router.post('/userDelete', function(req, res, next) {
    operatorDb.del({_id:req.body._id,company:'admin'} , function(a){
        res.useSend(a);
    });
});
exports.router = router;
exports.__path = '/server/admin/permission/admin';
