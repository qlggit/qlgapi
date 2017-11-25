var express = require('express');
var router = express.Router();
var operatorDb = useMongo().create('operator');
var permissionDb = useMongo().create('permission');
var permissionMenuDb = useMongo().create('permissionMenu');
var md5 = require('md5');
router.get('/add', function(req, res, next) {
    operatorDb.findOne({
        type:99
    } , function(a){
        if(a.data){
            return res.send('已有超级管理员');
        }
        operatorDb.save({
            company:'admin',
            username:'admin',
            password:md5(md5('123456')),
            type:99,
            status:0,
            createOperator:'auto',
        } , function(data){
            return res.useSend(data);
        });
    });
});
router.get('/permission/init', function(req, res, next) {
    if(req.query.cc === '1234'){
        permissionMenuDb.findOne({
            code:'menu01'
        } , function(a){
            if(a.data){
                return res.send('has init');
            }
            var permissionMenu = [
                {
                    code:'menu01',
                    name:'内部权限管理',
                    type:0,
                },
                {
                    code:'menu0101',
                    name:'权限管理',
                    type:0,
                    parentCode:'menu01',
                },
                {
                    code:'menu0102',
                    name:'角色管理',
                    type:0,
                    parentCode:'menu01',
                },
                {
                    code:'menu02',
                    name:'外部权限管理',
                    type:0,
                },
                {
                    code:'menu0201',
                    name:'权限管理',
                    type:0,
                    parentCode:'menu02',
                },
                {
                    code:'menu0202',
                    name:'角色管理',
                    type:0,
                    parentCode:'menu02',
                },
            ];
            var all = [];
            permissionMenu.forEach(function(a){
                all.push(new Promise(function(rev , rej){
                    permissionMenuDb.save({
                        type:a.type,
                        name:a.name,
                        code:a.code,
                        parentCode:a.parentCode,
                    } , rev);
                }));
            });
            Promise.all(all).then(function(){
                res.send('init end');
            });
        });
        return false;
    }
    next();
});
router.get('/add', function(req, res, next) {
    operatorDb.findOne({
        type:99
    } , function(a){
        if(a.data){
            return res.send('已有超级管理员');
        }
        operatorDb.save({
            company:'admin',
            username:'admin',
            password:md5(md5('123456')),
            type:99,
            status:0,
            createOperator:'auto',
        } , function(data){
            return res.useSend(data);
        });
    });
});
exports.router = router;
exports.__path = '/admin';
