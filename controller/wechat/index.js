var express = require('express');
var router = express.Router();
router.get('/entrance/:channel', function(req, res, next) {
    res.redirect(useWechat.entrance.info([req.params.channel, req.query.port].join('--')));
});
router.get('/redirect', function(req, res, next) {
    var code = req.query.code;
    var state = req.query.state.split('--');
    var channel = state[0];
    var port = state[1];
    var wechatData = useConfig.get('wechatOptions')[channel];
    useWechat.accessToken(channel ,code , function(data){
        if(wechatData.openIdRedirect){
            var url = wechatData.redirect_uri;
            if(port)url+=':'+port;
            url+=wechatData.openIdRedirect;
            url = useCommon.addUrlParam(url , data);
            res.useRedirect(url);
            return
        }
        useRequest.send(req , res ,{
            url:'https://api.weixin.qq.com/sns/userinfo?openid=' + data.openid
            +'&access_token=' + data.access_token + '&lang=zh_CN',
            done:function(data){
                var url = wechatData.redirect_uri;
                if(port)url+=':'+port;
                url+=wechatData.redirect_path;
                url = useCommon.addUrlParam(url , data);
                res.useRedirect(url)
            }
        });
    });
});
exports.router = router;
exports.__path = '/wechat';