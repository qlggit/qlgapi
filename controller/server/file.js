var express = require('express');
var qiniu = require('qiniu');
var router = express.Router();
var options = {
    scope: useConfig.get('qiniuImgShowPath'),
};
var putPolicy = new qiniu.rs.PutPolicy(options);
var accessKey = 'Ko6lqXxKSdJC5OK59HDnYrNJazkdYJZP-gEIDxmO';
var secretKey = 'TFbvhjT1s5352Qhe6quBCwQFFQRELguyJYjbzuE9';
var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
var uploadToken=putPolicy.uploadToken(mac);
var config = new qiniu.conf.Config();
config.zone = qiniu.zone.Zone_z0;
var putExtra = new qiniu.form_up.PutExtra();
var formUploader = new qiniu.form_up.FormUploader(config);
router.get('/down', function(req, res, next) {
});
var uuid = require('uuid');
var urlPath = useConfig.get('qiniuImgShowUrl');
router.post('/upload', function(req, res, next) {
    var boundary = req.headers['content-type'].replace(/[\w\W]*boundary\=/,'');
    var chunks = [];
    var size = 0;
    req.on('data' , function(chunk){
        chunks.push(chunk);
        size+=chunk.length;
    });
    req.on('end' , function(){
        var buffer = Buffer.concat(chunks , size);
        var files = getFileData(buffer , boundary);
        putOne(files[0] , function(d){
            res.send({
                code:d.statusCode === 200?'10000':'1',
                data:d
            })
        });
    });
});
function getFileData(buffer , boundary){
    var res = [],rems = [];
    var startIndex = -1;
    for(var i=0;i<buffer.length;i++){
        if(buffer[i]===13 && buffer[i+1]===10){
            var one = buffer.slice(startIndex , i);
            rems.push(one);
            startIndex = -1;
            i++;
        }else if(buffer[i]===10){
            //
        }else{
            if(startIndex === -1)startIndex = i;
        }
    }
    var oneFile = null;
    for(var i=0;i<rems.length;i++){
        var str = rems[i].toString();
        if(oneFile){
            if(str.indexOf('Content-Disposition')>-1){
                oneFile.originalName = str.match(/filename=".*"/g)[0].split('"')[1];
                oneFile.filename = [useCommon.parseDate(new Date , 'Ymd'),uuid.v1(),oneFile.originalName].join('-') ;
            }
            else if(str.indexOf('Content-Type')>-1){
                oneFile.fileType = str.split(':').pop().trim();
            }else{
                oneFile.bufferSize = rems[i].length;
                oneFile.buffer.push(rems[i]);
            }
        }
        if(rems[i].toString().indexOf(boundary) > -1){
            if(oneFile){
                oneFile.buffer = Buffer.concat(oneFile.buffer , oneFile.bufferSize);
                res.push(oneFile);
                oneFile = {
                    bufferSize:0,
                    buffer:[]
                };
            }else{
                oneFile = {
                    bufferSize:0,
                    buffer:[]
                };
            }
        }
    }
    return res;
}
function putOne(fileData , call){
    formUploader.put(uploadToken,fileData.filename , fileData.buffer , putExtra, function(respErr,
                                                                        respBody, respInfo) {
        respBody = respBody || {};
        call({
            err:respErr,
            statusCode:200,
            hash:respBody.hash,
            originalName:fileData.originalName,
            fileType:fileData.fileType,
            key:respBody.key,
            filePath:urlPath + respBody.key
        })
    });
}
router.post('/uploads', function(req, res, next) {
    var boundary = req.headers['content-type'].replace(/[\w\W]*boundary\=/,'');
    var chunks = [];
    var size = 0;
    req.on('data' , function(chunk){
        chunks.push(chunk);
        size+=chunk.length;
    });
    req.on('end' , function(){
        var buffer = Buffer.concat(chunks , size);
        var files = getFileData(buffer , boundary);
        var all = [];
        files.forEach(function(d){
           all.push(new Promise(function(rev , rej){
               putOne(d , function(o){
                   if(o.statusCode === 200){
                       rev(o)
                   }else{
                       rej(o);
                   }
               });
           })) ;
        });
        Promise.all(all).then(function(values){
            res.send({
                code:"10000",
                data:values
            })
        }).catch(function(e){
            res.send({
                code:"1",
                data:e
            })
        });
    });
});
router.get('/test', function(req, res, next) {
    res.render('file');
});
exports.router = router;
exports.__path = '/file';
