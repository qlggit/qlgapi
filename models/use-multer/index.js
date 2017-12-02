var fs = require('fs');
var multer = require('multer');
var Path = require('path');
var fileRender = require('../file-reader');
var common = require('../use-common');
var config = require('../use-config');
var uuid = require('uuid');
var rootPath;
module.exports = {
    file:function(options){
        options = options || {};
        return multer({
            storage: multer.diskStorage({
                destination: function (req, file, cb) {
                    console.log('destination');
                    console.log(file);
                    cb(null, rootPath);

                },
                filename: function (req, file, cb) {
                    console.log('filename');
                    console.log(file);
                    var filename = options.filename || file.originalname;
                    filename = uuid.v1() + (Path.extname(filename) || req.body.extname || Path.extname(file.originalname));
                    console.log(filename);
                    cb(null, filename);
                }
            })
        }).single(options.name || 'file');
    },
    init:function(){
        rootPath = Path.join(__ROOT__ , publicDir , 'upload');
        console.log('rootPath');
        console.log(rootPath);
        console.log(rootPath.toString());
        fileRender.makeDir(Path.join(rootPath , 'xx.xx'));
    }
};