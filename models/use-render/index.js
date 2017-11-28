module.exports = function(req , res , next){
    res.sendErrorMessage = function(errorCode , message){
        errorCode = errorCode || 'FAIL';
        var code = useCodeEnum[errorCode][0];
        if(code < 1000 && code > 100){
            res.status(code);
        }
        var sendData = {
            code:code,
            message:useCodeEnum[errorCode][1]
        };
        if(message){
            if(typeof message === 'string'){
                sendData.message = message;
            }else{
                useCommon.extendMore(sendData , message);
            }
        }
        res.useSend(sendData);
    };
    res.statusErrorCode = function(errorCode){
        res.status(useCodeEnum[errorCode][0]).end();
    };
    res.sendDbData = function(err , data){
        res.useSend({
            code:(err !== null)-0,
            data:data
        });
    };
    res.sendSuccess = function(data , message){
        res.useSend({
            code:useCodeEnum.SUCCESS[0],
            message:message || '操作成功',
            data:data
        });
    };
    res.useSend = function(body){
        if(body.code == undefined)body.code = 1;
        body.message = body.message || (body.code === 0 ?'操作成功':'操作失败');
        res.send(body);
    };
    res.useRedirect = function(path){
        res.redirect(path);
    };
    next();
};
