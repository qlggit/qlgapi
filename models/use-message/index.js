var msgDb = useMongo().create('message');
module.exports = {
    send:function(data , call){
        msgDb.save({
            type:data.type,
            itemType:data.itemType,
            status:data.status,
            data:data.data,
            channel:data.channel,
            ip:data.ip,
            content:data.content,
            remark:data.remark,
            userId:data.userId,
        } , call);
    }
};