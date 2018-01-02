var express = require('express');
var router = express.Router();
var versionDb =useMongo().create('appVersion');
router.get('/data', function(req, res, next) {
    var sendData = {};
    if(req.query.appChannel)sendData.appChannel = req.query.appChannel;
    if(req.query.appStatus)sendData.appStatus = req.query.appStatus;
    versionDb.findAll(sendData ,function(a){
        res.useSend(a);
    },{
        limit:req.query.pageSize,
        skip:req.query.pageNum,
        sort:{
            createTime:-1
        }
    })
});
router.post('/add', function(req, res, next) {
    var sendData = useMongo().createData('appVersion' , req.body);
    versionDb.save(sendData,function(a){
        res.useSend(a);
    })
});
router.post('/update', function(req, res, next) {
    var sendData = useMongo().createData('appVersion' , req.body);
    versionDb.update({_id:req.body._id},sendData,function(a){
        res.useSend(a);
    })
});
router.get('/check', function(req, res, next) {
    var channel = req.query.channel;
    var version = req.query.version;
    var resData = {
        code:10000,
    };
    versionDb.find({
        appChannel:channel
    } , function(a){
        var newData = a.data[0];
        if(newData.outerVersion === version){
            resData.isNew = true;
        }else{
            resData.isNew = false;
            versionDb.findOne({
                appChannel:channel,
                outerVersion:version
            } , function(b){
                var thisData = b.data;
                if(!thisData){
                    resData.isUp = true;
                }
                else resData.isUp = thisData.appStatus !== 'normal';
                resData.remark = newData.remark;
                resData.link = newData.link;
                resData.newVersion = newData.outerVersion;
                res.send(resData);
            });
        }
    } , {
    },{
        skip:0,
        limit:1,
        sort:{
            innerVersion:-1
        }
    })
});
exports.router = router;
exports.__path = '/server/version';
