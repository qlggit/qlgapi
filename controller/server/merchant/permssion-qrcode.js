var express = require('express');
var router = express.Router();
var operatorDb = useMongo().create('operator');
router.post('/add', function(req, res, next) {
    operatorDb.findOne({
        uid:req.body.uid,
    },function(userInfo){
        operatorDb.findOne({
            company:req.body.company,
        },function(a){
            if(!a.data){
                return res.useSend({message:'未知的商户！'})
            }
            if(userInfo.data){
                operatorDb.update({
                    uid:req.body.uid,
                } , {
                    company:req.body.company,
                },function(a){
                    res.useSend(a);
                });
                return;
            }
            operatorDb.save({
                createOperator:req.body.createOperator,
                company:req.body.company,
                username:req.body.username,
                nickname:req.body.nickname,
                companyName:req.body.companyName,
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
