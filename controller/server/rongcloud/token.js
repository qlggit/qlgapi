var express = require('express');
var router = express.Router();
//
router.get('/', function(req, res, next) {
    var userId = req.query.userId;
    var key = 'rongcloud-token-'+userId;
    var cache = useCache.get(key , 0);
    if(cache){
        res.sendSuccess(cache);
    }
    else useRequest.send(req , res , {
        rongcloudToken:1,
        data:req.body,
        done:function(a){
            var code = 1 - (a.code === 200),data;
            if(code === 0){
                data = {
                    token:a.token,
                    userId:a.userId,
                };
                useCache.add(key , 0 , data);
            }
            res.send({
                code:code,
                baseCode:a.code,
                data:data
            });
        }
    });
});
exports.router = router;
exports.__path = '/server/rongcloud/token';
