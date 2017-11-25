var express = require('express');
var router = express.Router();
router.get('/data', function(req, res, next) {
    useData.getUser({
        username:req.query.username,
        company:'admin'
    } , function(a){
        if(!a.data)return res.sendSuccess([]);
        var userInfo = a.data;
        var roleId = userInfo.roleId;
        var sendData = {
            menuCode:[],
            permissionCode:[],
            menuList:[],
            parentMenuList:[]
        };
        new Promise(function(rev , rej){
            var findData = {};
            //99 50是超级管理员
            if(userInfo.type < 50){
                findData = {_id:{$in:roleId}};
                useData.getRole(findData ,function(a){
                    a.data.forEach(function(o){
                        sendData.menuCode = sendData.menuCode.concat(o.menuCode);
                        sendData.permissionCode = sendData.permissionCode.concat(o.permissionCode);
                    });
                    if(sendData.menuCode.length){
                        rev();
                    }else{
                        //没有菜单权限
                        res.sendSuccess([]);
                    }
                });
            }else{
                rev();
            }
        }).then(function(){
            return new Promise(function(rev , rej){
                var searchData = {};
                if(userInfo.type > 49)searchData.isAdmin = true;
                else{
                    searchData.type = 0;
                }
                useData.getMenuList(searchData,function(a){
                    sendData.menuList = a;
                    if(userInfo.type > 49){
                        useData.getPermissionList({type:0},function(a){
                            sendData.permissionCode = a.map(function(b){return b.code});
                            rev();
                        })
                    }
                    else rev();
                })
            });
        }).then(function(){
            sendData.menuList =  sendData.menuList.filter(function(a){
                return userInfo.type > 49 || menuCode.indexOf(a.code) > -1;
            });
            sendData.parentMenuList =  sendData.menuList.filter(function(a){
                return !a.parentCode;
            });
            sendData.menuList = sendData.menuList.filter(function(a){
                return a.parentCode;
            });
            sendData.permissionCode = useCommon.unique(sendData.permissionCode);
            sendData.menuList = sendData.menuList.map(function(a){
                return {
                    parentCode:a.parentCode,
                    code:a.code,
                    name:a.name,
                    type:a.type,
                }
            });
            sendData.parentMenuList = sendData.parentMenuList.map(function(a){
                return {
                    code:a.code,
                    name:a.name,
                    type:a.type,
                }
            });
            res.sendSuccess(sendData);
        });
    })
});
router.post('/list' , function(req, res, next) {

});
exports.router = router;
exports.__path = '/server/admin/permission';
