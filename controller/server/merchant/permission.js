var express = require('express');
var router = express.Router();
var permissionDb = useMongo().create('permission');
var permissionMenuDb = useMongo().create('permissionMenu');
router.get('/list', function(req, res, next) {
    var searchData = {type:1};
    if(req.query.menuCode)searchData.menuCode = req.query.menuCode;
    permissionDb.find(searchData , function(a){
        res.useSend(a);
    });
});
router.get('/menuList', function(req, res, next) {
    var searchData = {type:1};
    if(req.query.parentCode)searchData.parentCode = req.query.parentCode;
    permissionMenuDb.find(searchData , function(a){
        res.useSend(a);
    });
});
exports.router = router;
exports.__path = '/server/merchant/permission';
