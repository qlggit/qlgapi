var express = require('express');
var router = express.Router();
var operatorDb = useMongo().create('operator');
router.post('/add', function(req, res, next) {
    operatorDb.findOne({
        uid:req.body.uid,
    },function(a){
        if(a.data){
            return res.useSend({message:'已有操作员身份！不能重复添加'})
        }
        operatorDb.findOne({
            company:req.body.company,
        },function(a){
            if(!a.data){
                return res.useSend({message:'未知的商户！'})
            }
            operatorDb.save({
                createOperator:req.body.createOperator,
                company:req.body.company,
                username:req.body.username,
                nickname:req.body.nickname,
                status:1,
                uid:req.body.uid,
                type:1,
                roleId:[]
            } , function(a){
                res.useSend(a);
            });
        });
    });

});
exports.router = router;
exports.__path = '/server/merchant/permission/qrcode';
