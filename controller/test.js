
var express = require('express');
var router = express.Router();
router.get('/test', function(req, res, next) {
    useRequest.send(req , res , {
        url:'http://h5.yukew.com/wechat/token/check/wxtest',
        done:function(data){
           var table = data.data.match(/id\=\"openlist\"([\s\S]*)id\=\"pagec\"/img)[0];
           var uls = table.split(/ul\>\<ul/);
           var list = uls.slice(1).map(function(a , i){
                   var lis = a.split(/li\>\<li/);
                   return {
                       date:lis[0].match(/\d{9}/)[0],
                       res:lis[1].match(/\d(\-\d){4}/)[0],
                   }
           });
           var resData = {};
            resData.table = table;
            resData.uls = uls;
            resData.list = list;
            res.send(resData);
        }}
    )
});
exports.router = router;
exports.__path = '/';
