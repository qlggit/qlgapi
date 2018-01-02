var apiUrl = useConfig.get('apiUrl') ;
var alidayuUrl = useConfig.get('alidayuUrl') ;
var rongcloudUrl = useConfig.get('rongcloudUrl') ;
module.exports = {
    sms:{
        send:alidayuUrl + '/api/sms/v_1/send',
    },
    rongcloud:{
        userToken:rongcloudUrl + '/user/getToken',
        createChatRoom:rongcloudUrl + '/chatroom/create.json',
    },
    login:{
        login:apiUrl + '/api/user/v_1/login',
    },
};
