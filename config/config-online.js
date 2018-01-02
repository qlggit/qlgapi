//admin 1234yqs_admin
module.exports = {
    qiniuImgShowUrl:'http://ozczd6usr.bkt.clouddn.com/',
    qiniuImgShowPath:'image',
    apiUrl:'http://172.19.56.132:4200',
    "log4js":{
        "customBaseDir" :"../logs/h5api/",
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
        host:'127.0.0.1',
        port:'27017',
        dbname:'h5api'
    },
    mysqlOptions:{
        host:'rm-uf6f0pnlca8085p8zo.mysql.rds.aliyuncs.com',
        user:'root',
        password :'CQyuke000!',
        database :'yukeh5'
    },
};

