var express = require('express');
var qiniu = require('qiniu');
var fs = require('fs');
var router = express.Router();
var options = {
    scope: useConfig.get('qiniuImgShowPath'),
};
var accessKey = 'Ko6lqXxKSdJC5OK59HDnYrNJazkdYJZP-gEIDxmO';
var secretKey = 'TFbvhjT1s5352Qhe6quBCwQFFQRELguyJYjbzuE9';

var config = new qiniu.conf.Config();
config.zone = qiniu.zone.Zone_z0;

router.get('/down', function(req, res, next) {
});
var uuid = require('uuid');
var urlPath = useConfig.get('qiniuImgShowUrl');
router.post('/upload/old', function(req, res, next) {
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
        putOne(files[0] , function(d , e){
            res.send({
                code:d?"10000":"1",
                data:d || e
            })
        });
    });
});
function getFileData(buffer , boundary){
    var res = [];
    var startIndex = -1;
    var oneFile = {};
    for(var i=0;i<buffer.length;i++){
        if(buffer[i]===13 && buffer[i+1]===10){
            var one = buffer.slice(startIndex , i);
            var oneStr = one.toString();
            if(oneStr === '--'+boundary){
                startIndex = -1;
            }
            else if(oneStr.indexOf('Content-Disposition') > -1){
                oneFile.ContentDisposition = oneStr;
                var filename = oneStr.match(/filename=".*"/g);
                if(filename){
                    oneFile.originalName = filename[0].split('"')[1].replace(/[^\w\-\.]/,'');
                    oneFile.filename = [useCommon.parseDate(new Date , 'Ymd'),uuid.v1(),oneFile.originalName].join('-') ;
                    startIndex = -1;
                }

            }
            else if(oneStr.indexOf('Content-Type') > -1
            ){
                oneFile.ContentType = oneStr;
                oneFile.fileType = oneStr.split(':').pop().trim();
                startIndex = -1;
            }
            else {
                var nextBuffer = buffer.slice(i+2);
                if(nextBuffer.toString().indexOf('--'+boundary + '--') === 0 || nextBuffer.toString().indexOf('--'+boundary) === 0){
                    if(oneFile.originalName){
                        oneFile.buffer = one;
                        res.push(oneFile);
                    }
                    oneFile = {

                    }
                }
            }
            i++;
        }else if(buffer[i]===10){
            //
        }else{
            if(startIndex === -1)startIndex = i;
        }
    }
    return res;
}
function putOne(fileData , call){
    var putPolicy = new qiniu.rs.PutPolicy(options);
    var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    var uploadToken = putPolicy.uploadToken(mac);
    var putExtra = new qiniu.form_up.PutExtra();
    var formUploader = new qiniu.form_up.FormUploader(config);
    formUploader.put(uploadToken,fileData.filename , fileData.buffer , putExtra, function(respErr,
                                                                        respBody, respInfo) {
        respBody = respBody || {};
        console.log('file upload');
        console.log(respBody);
        call(respInfo.statusCode === 200?{
            err:respErr,
            statusCode:200,
            hash:respBody.hash,
            originalName:fileData.originalName,
            fileType:fileData.fileType,
            key:respBody.key,
            filePath:urlPath + respBody.key
        }:null , respBody)
    });
}
function putMulterOne(originalname ,fileData, call){
    var putPolicy = new qiniu.rs.PutPolicy(options);
    var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    var uploadToken = putPolicy.uploadToken(mac);
    var putExtra = new qiniu.form_up.PutExtra();
    var formUploader = new qiniu.form_up.FormUploader(config);
    formUploader.putFile(uploadToken , originalname , fileData.path , putExtra, function(respErr,
                                                                                      respBody, respInfo) {
        respBody = respBody || {};
        console.log('file upload');
        console.log(respBody);
        call(respInfo.statusCode === 200?{
            err:respErr,
            statusCode:200,
            hash:respBody.hash,
            originalName:fileData.originalname,
            fileType:fileData.fileType,
            key:respBody.key,
            filePath:urlPath + respBody.key
        }:null , respBody);
        fs.unlink(fileData.path);
    });
}
router.post('/uploads/old', function(req, res, next) {
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
               putOne(d , function(o , e){
                   if(o){
                       rev(o)
                   }else{
                       rej(e);
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
router.post('/uploads',useMulter.array(), function(req, res, next) {
    var all = [];
    if(!req.files.length){
        return res.send({code:1,message:'没有文件'});
    }
    req.files.forEach(function(a){
        all.push(new Promise(function(rev , rej){
            var originalname = Date.now() + '-' + a.filename;
            putMulterOne(originalname , a , function(d , e){
                if(d){
                    rev(d)
                }else{
                    rej(e);
                }
            })
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
router.get('/test', function(req, res, next) {
    res.render('file');
});
router.post('/upload',useMulter.file(), function(req, res, next) {
    console.log(req.file);
    var originalname = Date.now() + '-' + req.file.filename;
    putMulterOne(originalname , req.file , function(d , e){
        res.send({
            code:d?"10000":"1",
            data:d || e
        })
    })
});
exports.router = router;
exports.__path = '/file';
