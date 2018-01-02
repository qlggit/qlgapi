var WebSocketServer  = require('ws').Server;
var  wss = new WebSocketServer({
    port: useConfig.get('wsPort'), //监听接口
});
wss.on('connection' , function(ws){
    console.log('has one connection');
    wssList.push(ws);
    console.log('wssList length:-->'+wssList.length);
    ws.on('message', function(jsonStr,flags) {
        var data = useCommon.parse(jsonStr);
        console.log('ws message');
        console.log(data);
        if(handler[data.type]){
            handler[data.type](data , this);
        }
    });
    ws.on('close', function() {
        console.log('on close');
        removeOne(this);
        console.log('wssList length:-->'+wssList.length);
    });
});
var handlerObject = {
    qrcodeLogin:{count:0},
    qrcodeAdd:{count:0},
};
function removeOne(ws){
    var index = wssList.indexOf(ws);
    if(index > -1){
        wssList.splice(index , 1);
    }
}
var wssList = [];
var handler = {
    init:function(data , ws){
    },
    qrcodeLogin:function(data , ws){
        var oneHandler = handlerObject.qrcodeLogin;
        ws.handlerType = 'qrcodeLogin';
        //PC端打开二维码
        if(data.itemType === 'open'){
            var id = 'qrcodeLogin' + oneHandler.count++;
            ws.handlerId = id;
            handler.sendMessage({
                code:0,
                data:id,
                type:'qrcodeLogin',
                itemType:'open'
            },ws);
        }else if(data.itemType === 'login'){
            //手机确认登录
            if(wssList.every(function(a){
                if(a.handlerType === 'qrcodeLogin' && a.handlerId == data.data){
                    //找到PC
                    handler.sendMessage({
                        code:0,
                        type:'qrcodeLogin',
                        itemType:'login',
                        data:a.handlerId
                    },a);
                    return false;
                }
                return true;
            })){
                //没找到有效的二维码
                handler.sendMessage({
                    code:1,
                    type:'qrcodeLogin',
                    itemType:'login',
                    message:'登录超时！'
                },ws);
            }
        }else if(data.itemType === 'uid'){
            //扫码二维码绑定uid
            ws.userUid = data.uid;
            ws.userLoginId = data.data;
            wssList.every(function(a){
                if(a.handlerType === 'qrcodeLogin' && a.handlerId == data.data){
                    a.handlerUid = data.uid;
                    return false;
                }
                return true;
            });
        }else if(data.itemType === 'complete'){
            //pc登录反馈
            wssList.every(function(a){
                if(a.handlerType === 'qrcodeLogin' && a.userLoginId == data.data){
                    //返回手机登录结果
                    handler.sendMessage({
                        code:data.code,
                        type:'qrcodeLogin',
                        itemType:'complete',
                        message:data.message
                    },a);
                    return false;
                }
                return true;
            });
        }
    },
    qrcodeAdd:function(data , ws){
        var oneHandler = handlerObject.qrcodeAdd;
        if(data.itemType === 'open'){
            var id = 'qrcodeAdd' + oneHandler.count++;
            ws.handlerId = id;
            ws.handlerChannel = data.channel;
            ws.handlerType = 'qrcodeAdd';
        }else if(data.itemType === 'login'){
            wssList.every(function(a){
                if(a.handlerChannel == data.channel && a.handlerType === 'qrcodeAdd'){
                    handler.sendMessage({
                        code:0,
                        type:'qrcodeAdd',
                        itemType:'login'
                    },a);
                    return false;
                }
                return true;
            });
        }
    },
    sendMessage:function(msg , ws){
        ws.send(useCommon.stringify(msg));
    }
};
module.exports = {
    getUid:function(loginId){
        var uid;
        wssList.every(function(a){
            if(a.handlerId === loginId){
                uid = a.handlerUid;
                return false;
            }
            return true;
        });
        return uid;
    }
};