function wechat(){

}
wechat.accessToken = require('./access_token');
wechat.jsToken = require('./js_token');
wechat.jsapi_ticket = require('./jsapi_ticket');
wechat.entrance = require('./entrance');
wechat.userInfo = require('./user-info');
wechat.sign = require('./sign');
wechat.decode = require('./de-code.js');
wechat.login = require('./login.js');
module.exports = wechat;