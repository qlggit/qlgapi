//admin 1234yqs_admin
module.exports = {
    "port":3002,
    uploadPath:'build/upload',
    alidayuAppId:'LTAI0ToowjXIqOJk',
    alidayuAppKey:'IBAoSwR0N6OYA16DfEnqosaJSkmNwN',
    alidayuUrl:'http://192.168.1.245:8080',
    smsExpires:1800,
    smsMaxCount:5,
    smsMaxCheckCount:5,
    wxAppId:'wxeb6eb417838ef115',
    wxAppSecret:'d4624c36b6795d1d99dcf0547af5443d',
    "redirect_uri":'http://h5.yqsapp.com',
    "log4js":{
        "customBaseDir" :"/logs/",
        "customDefaultAtt" :{
            "type": "dateFile",
            "absolute": true,
            "alwaysIncludePattern": true
        },
        "appenders": [
            {"type": "console", "category": "console"},
            {"pattern": "debug/yyyyMMdd.log", "category": "logDebug"},
            {"pattern": "info/yyyyMMdd.log", "category": "logInfo"},
            {"pattern": "warn/yyyyMMdd.log", "category": "logWarn"},
            {"pattern": "err/yyyyMMdd.log", "category": "logErr"}
        ],
        "replaceConsole": true,
        "allConsole":true,
        "levels":{ "logDebug": "DEBUG", "logInfo": "DEBUG", "logWarn": "DEBUG", "logErr": "DEBUG"}
    },
    dbOptions:{
        host:'192.168.1.245',
        port:'27017',
        dbname:'h5api'
    },
    wechatOptions:{
        test:{
            "appId":"wxeb6eb417838ef115",
            "appSecret":"d4624c36b6795d1d99dcf0547af5443d",
            "redirect_uri":"http://127.0.0.1",
            "redirect_path":"/wechat/entrance",
            "token":"f4da9eb443e5595cb889a2ff8ec5de8f"
        },
        test3001:{
            "appId":"wxeb6eb417838ef115",
            "appSecret":"d4624c36b6795d1d99dcf0547af5443d",
            "redirect_uri":"http://47.100.20.78:3001",
            "redirect_path":"/wechat/entrance",
            "token":"f4da9eb443e5595cb889a2ff8ec5de8f"
        }
    }
};

