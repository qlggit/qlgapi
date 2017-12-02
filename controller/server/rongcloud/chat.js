var express = require('express');
var router = express.Router();
var operatorDb = useMongo().create('operator');
var merchantCartDb = useMongo().create('merchantCart');
//
router.get('/merchantChatRoomId', function(req, res, next) {
    var merchantId = req.query.merchantId;
    operatorDb.findOne({
        company:merchantId,
        type:99,
    } , function(a){
        if(a.data){
            var chatRoomId = 'merchantChatRoom' + merchantId;
            merchantCartDb.findOne({
                merchantId:merchantId,
            },function(b){
                if(b.data){
                    res.sendSuccess(b.data);
                }else{
                    var sendData = {};
                    var chatroomname = a.data.companyName + '聊天室';
                    sendData['chatroom['+chatRoomId+']'] = chatroomname;
                    useRequest.send(req , res , {
                        url:useUrl.rongcloud.createChatRoom,
                        data:sendData,
                        rongcloudToken:1,
                        method:'POST',
                        notBody:1,
                        done:function(a){
                            if(a.code === 200){
                                merchantCartDb.save({
                                    merchantId:merchantId,
                                    chatRoomId:chatRoomId,
                                    chatRoomName:chatroomname
                                } , function(a){
                                    res.useSend(a);
                                })
                            }else res.useSend(a);
                        }
                    });

                }
            })
        }else{
            res.sendErrorMessage();
        }
    });
});
exports.router = router;
exports.__path = '/server/rongcloud/chat';
