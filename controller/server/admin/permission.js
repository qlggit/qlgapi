var express = require('express');
var router = express.Router();
var permissionDb = useMongo().create('permission');
var permissionMenuDb = useMongo().create('permissionMenu');
router.get('/list', function(req, res, next) {
    var searchData = {type:0};
    if(req.query.menuCode)searchData.menuCode = req.query.menuCode;
    permissionDb.find(searchData , function(a){
        res.useSend(a);
    });
});
router.post('/add', function(req, res, next) {
    permissionDb.save({
        type:0,
        name:req.body.name,
        code:req.body.code,
        menuCode:req.body.menuCode,
    } , function(a){
        if(a.data === 0)useData.clearData();
        res.useSend(a);
    });
});
router.post('/update', function(req, res, next) {
    permissionDb.update({
        _id:req.body._id
    },{
        name:req.body.name,
        code:req.body.code,
        menuCode:req.body.menuCode,
    } , function(a){
        res.useSend(a);
    });
});
router.post('/delete', function(req, res, next) {
    permissionDb.del({
        _id:req.body._id
    } , function(a){
        res.useSend(a);
    });
});
router.get('/menuList', function(req, res, next) {
    var searchData = {type:0};
    if(req.query.parentCode)searchData.parentCode = req.query.parentCode;
    permissionMenuDb.find(searchData , function(a){
        res.useSend(a);
    });
});

router.post('/menuAdd', function(req, res, next) {
    permissionMenuDb.save({
        type:0,
        name:req.body.name,
        code:req.body.code,
        parentCode:req.body.parentCode,
        isAdmin:true,
    } , function(a){
        res.useSend(a);
    });
});

router.post('/menuUpdate', function(req, res, next) {
    permissionMenuDb.update({
        _id:req.body._id
    },{
        name:req.body.name,
        code:req.body.code,
        parentCode:req.body.parentCode,
    } , function(a){
        res.useSend(a);
    });
});
router.post('/menuDelete', function(req, res, next) {
    permissionMenuDb.del({
        _id:req.body._id
    } , function(a){
        res.useSend(a);
    });
});
exports.router = router;
exports.__path = '/server/admin/permission';