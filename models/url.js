var apiUrl = useConfig.get('apiUrl') ;
var alidayuUrl = useConfig.get('alidayuUrl') ;
module.exports = {
    sms:{
        send:alidayuUrl + '/api/sms/v_1/send',
    },
};
