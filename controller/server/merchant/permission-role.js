var express = require('express');
var router = express.Router();
var roleDb = useMongo().create('permissionRelation');
var operatorDb = useMongo().create('operator');
var md5 = require('md5');
router.get('/role', function(req, res, next) {
    var searchData = {
        company:req.query.company,
    };
    if(req.query.name)searchData.name = {$regex:new RegExp('.*'+req.query.name+'.*')};
    useData.getRole(searchData,function (a) {
        res.send(a);
    })
});
router.post('/roleAdd', function(req, res, next) {
    roleDb.save({
        createOperator:req.body.createOperator,
        company:req.body.company,
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
    roleDb.update({_id:req.body._id,company:req.body.company},sendData, function(a){
        res.useSend(a);
    });
});
router.post('/roleDelete', function(req, res, next) {
    roleDb.del({_id:req.body._id,company:req.body.company} , function(a){
        res.useSend(a);
    });
});
exports.router = router;
exports.__path = '/server/merchant/permission';
