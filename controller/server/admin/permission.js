var express = require('express');
var router = express.Router();
var permissionDb = useMongo().create('permission');
var permissionMenuDb = useMongo().create('permissionMenu');
router.get('/list', function(req, res, next) {
    var searchData = {};
    if(req.query.menuCode)searchData.menuCode = req.query.menuCode;
    if(req.query.name)searchData.name = {$regex:new RegExp('.*'+req.query.name+'.*')};
    permissionDb.find(searchData , function(a){
        res.useSend(a);
    });
});
router.post('/add', function(req, res, next) {
    var type = req.body.type || 0;
    permissionDb.save({
        type:type,
        name:req.body.name,
        code:req.body.code,
        menuCode:req.body.menuCode,
        status:1,
    } , function(a){
        if(a.code === 0)useData.clearData(type,'permissionList');
        res.useSend(a);
    });
});
router.post('/update', function(req, res, next) {
    permissionDb.update({
        _id:req.body._id
    },{
        type:req.body.type || 0,
        name:req.body.name,
        code:req.body.code,
        menuCode:req.body.menuCode,
    } , function(a){
        if(a.code === 0)useData.clearData(req.body.type || 0,'permissionList');
        res.useSend(a);
    });
});

router.post('/change', function(req, res, next) {
    permissionDb.findOne({
        _id:req.body._id
    } , function(a){
        permissionDb.update({
            _id:req.body._id
        } ,{
            status:1 - a.data.status
        }, function(b){
            if(b.code === 0)useData.clearData(a.data.type,'permissionList');
            res.useSend(b);
        });
    })
});
router.post('/delete', function(req, res, next) {
    permissionDb.del({
        _id:req.body._id
    } , function(a){
        res.useSend(a);
    });
});
router.get('/menuList', function(req, res, next) {
    var searchData = {};
    if(req.query.parentCode)searchData.parentCode = req.query.parentCode;
    if(req.query.name)searchData.name = {$regex:new RegExp('.*'+req.query.name+'.*')};
    permissionMenuDb.find(searchData , function(a){
        res.useSend(a);
    });
});

router.post('/menuAdd', function(req, res, next) {
    var type = req.body.type || 0;
    permissionMenuDb.save({
        type:type,
        name:req.body.name,
        code:req.body.code,
        parentCode:req.body.parentCode,
        isAdmin:true,
        status:1,
    } , function(a){
        if(a.code === 0)useData.clearData(type,'menuList');
        res.useSend(a);
    });
});

router.post('/menuUpdate', function(req, res, next) {
    permissionMenuDb.update({
        _id:req.body._id
    },{
        type:req.body.type || 0,
        name:req.body.name,
        code:req.body.code,
        parentCode:req.body.parentCode,
    } , function(a){
        if(a.code === 0)useData.clearData(req.body.type || 0,'menuList');
        res.useSend(a);
    });
});
router.post('/menuChange', function(req, res, next) {
    permissionMenuDb.findOne({
        _id:req.body._id
    } , function(a){
        permissionMenuDb.update({
            _id:req.body._id
        } ,{
            status:1 - a.data.status
        }, function(b){
            if(b.code === 0)useData.clearData(a.data.type,'menuList');
            res.useSend(b);
        });
    })
});
exports.router = router;
exports.__path = '/server/admin/permission';
