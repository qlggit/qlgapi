
var express = require('express'),
	path = require('path'),
	logger = require('morgan'),
	session = require('express-session'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	app = express();
global.__ROOT__ = __dirname;
global.usePackage = require('./package.json');
global.useEnv = process.env.NODE_ENV;
console.log('env  '+useEnv);
global.publicDir = useEnv?'public':'public';
global.viewDir = useEnv?'views':'views';
//静态文件目录
app.use(express.static(path.join(__dirname, publicDir)));

//记录请求时间过长的链接  总时间
app.use(function(req,res,next){
	//带。的链接 在静态文件目录找不到的情况下 直接返回404
	if(req.path.indexOf('.') != -1){
		console.log('file url 404');
        return res.status(404).end();
	}

	var startTime = new Date();
	var calResponseTime = function () {
		var deltaTime = new Date() - startTime;
		if(deltaTime > 5000){
			useLog.log(req.baseUrl + req.path + '  deltaTime ' + deltaTime);
		}
	};
	res.once('finish', calResponseTime);
	res.once('close', calResponseTime);
	return next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use(function(req , res , next){
    var remoteAddress = req.query.remoteAddress || req.body.remoteAddress || req.headers['x-forwarded-for'] ||
        req.headers['x-real-ip'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    remoteAddress = remoteAddress.replace(/\:+ffff\:/,'');
    req.remoteAddress = remoteAddress;
	req.__xhr = req.xhr || req.body.__isAjax || req.query.__isAjax;
	next();
});

app.set('views', path.join(__dirname, viewDir));
app.engine('.html',require('ejs').__express);
app.set('view engine', 'html');
//不需要打印静态文件请求
app.use(logger('dev'));

process.on('uncaughtException', function (err) {
	console.error('process uncaughtException');
	console.error(err);
});
process.on('error', function (err) {
	console.error('process error');
	console.error(err);
});
var useModel = global.useModel = require('./models');
useModel.init(app , function(){
});
module.exports = app;
