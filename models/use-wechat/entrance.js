module.exports = {
    info:function(channel){
        var wechatData = useConfig.get('wechatOptions')[channel.split('--')[0]];
        return 'https://open.weixin.qq.com/connect/oauth2/authorize?' +
            'appid=' + wechatData.appId +
            '&redirect_uri=' + encodeURIComponent(wechatData.redirect_uri+
                (channel.split('--')[1]?(':'+channel.split('--')[1]):'')
                + '/wechat/redirect') +
            '&response_type=code' +
            '&scope=snsapi_userinfo'+
            '&state=' + channel +
            '#wechat_redirect';
    }
};