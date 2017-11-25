var smsSdk = require('@alicloud/sms-sdk');
const accessKeyId = useConfig.get('alidayuAppId');
const secretAccessKey  = useConfig.get('alidayuAppKey');
var smsClient = new smsSdk({accessKeyId, secretAccessKey});
var diffTime = 60 * 1000;//短信发送间隔 60秒
var expires = useConfig.get('smsExpires') * 1000;//短信有效期 30分钟
var smsMaxCount = useConfig.get('smsMaxCount');//手机号最大发送次数
var smsMaxCheckCount = useConfig.get('smsMaxCheckCount');//单个验证码最大验证次数
var smsDb = useMongo().create('sms');
function sendSuccess(sendData , code , call){
    console.log('sendSuccess');
    useMessage.send(sendData);
    call({
        code:0,
        message:'发送成功'
    });
    smsDb.save({
        phone:sendData.data,
        channel:sendData.channel,
        sendType:sendData.sendType,
        userId:sendData.userId,
        ip:sendData.ip,
        date:sendData.date,
        code:code,
        checkCount:0,
        check:0,
    });
    useCache.add(sendData.sendType + sendData.phone , diffTime);
}
function checkSuccess(data , dbData , call){
    console.log('checkSuccess');
    call({
        code:0,
        message:'验证成功'
    });
    if(dbData && dbData._id)smsDb.update({
        _id:dbData._id
    },{
        check:1
    })
}
function checkFail(sendData , dbData , call){
    console.log('checkFail');
    useMessage.send(sendData);
    call({
        code:1,
        message:sendData.message || '验证码错误'
    });
    if(dbData && dbData._id){
        smsDb.update({
            _id:dbData._id
        },{
            checkCount:dbData.checkCount+1
        })
    }
}
function sendFail(sendData , dbData , call){
    console.log('sendFail');
    call({
        code:1,
        message:sendData.message || '发送失败'
    });
    if(sendData.type){
        useMessage.send(sendData);
    }
}
function sendError(err , code , call){
    sendFail({},{},call);
    errorData = err;
    console.log('sms error');
    console.log(err.data || err);
}
var errorData;
module.exports = {
    getError:function(){
        return errorData;
    },
    send:function(data , call){
        var key = data.sendType + data.phone;
        var date = useCommon.parseDate(new Date , 'Y-m-d');
        var sendData = {
            type:'sms',
            itemType:'send',
            status:'success',
            data:data.phone,
            phone:data.phone,
            date:date,
            channel:data.channel,
            remark:data.sendType,
            sendType:data.sendType,
            ip:data.ip,
            userId:data.userId,
        };
        if(useCache.get(key , diffTime)){
            sendData.status = 'speed';
            sendData.message = '短信发送过于频繁，请稍后再发';
            sendFail(sendData , null , call);
        }
        else{
            smsDb.count({
                date:date,
                phone:data.phone,
                sendType:data.sendType,
                channel:data.channel,
            } , function(a){
                console.log(a);
                var code = useCommon.stringRandom(6);
                if(a.data){
                    if(a.data >= smsMaxCount){
                        sendData.status = 'maxCount';
                        sendData.message = '超过单日发送上限';
                        return sendFail(sendData , null , call);
                    }
                    //线上环境才会发送短信出去
                    if(useEnv === 'online')
                    {
                        smsClient.sendSMS({
                            PhoneNumbers: data.phone,
                            SignName: '吴云的短信',
                            TemplateCode: 'SMS_113225039test',
                            TemplateParam: JSON.stringify({code:code})
                        }).then(function (response) {
                            let {resCode}=response;
                            if (resCode === 'OK') {
                                sendSuccess(sendData,code,call)
                            }
                            else sendError(response , code ,call)
                        }, function (err) {
                            sendError(err  , code , call);
                        })
                        return false;
                    }
                }
                sendSuccess(sendData , code , call);
            });
        }
    },
    check:function(data , call){
        smsDb.find({
            phone:data.phone,
            sendType:data.sendType,
        } , function(a){
            console.log(a);
            var dbData = a.data && a.data[0];
            var checkData = {
                type:'sms',
                itemType:'check',
                status:'null',
                data:data.phone,
                channel:data.channel,
                ip:data.ip,
                content:data.code,
                userId:data.userId,
            };
            if(useEnv !== 'online' && data.code === '666666'){
                checkSuccess(checkData ,dbData, call);
                return false;
            }
            if(dbData){
                //已经验证过 类似于没有
                if(dbData.check){
                    checkData.status = 'again';
                    checkFail(checkData ,null, call);
                    return false;
                }
                if(dbData.code === data.code){
                    //超出次数验证
                    if(dbData.checkCount >= smsMaxCheckCount){
                        checkData.status = 'maxCount';
                        checkFail(checkData ,dbData, call);
                        return false;
                    }
                    //超出时限
                    if(Date.now() - dbData.createTime > expires){
                        checkData.status = 'timeout';
                        checkFail(checkData ,dbData, call);
                        return false;
                    }
                    checkSuccess(data ,dbData, call);
                    return false;
                }
                //验证码错误
                checkData.status = 'error';
                checkFail(checkData , dbData ,call);
                return false;
            }
            checkFail(checkData ,null , call);
        },{},{
            sort:{
                updateTime:-1
            },
            limit:1
        })
    }
};