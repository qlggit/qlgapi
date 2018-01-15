var express = require('express');
var router = express.Router();
var operatorDb = useMongo().create('operator');
router.post('/merchant/auth', function(req, res, next) {
    operatorDb.findOne({
        username:req.body.phone,
    } , function(a){
        if(!a.data || a.data.type !== 99 || a.company === 'admin'){
            return res.send({message:'你没有权限访问'});
        }
        res.sendSuccess(a.data);
    })
});
exports.router = router;
exports.__path = '/server/xcx';
