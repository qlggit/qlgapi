module.exports = function(data, call){
    useRequest.send(null , null ,{
        url:'https://api.weixin.qq.com/sns/userinfo?openid='+data.openid+'&access_token=' + data.access_token + '&lang=zh_CN',
        done:function(data){
            call && call(data);
        }
    })
};