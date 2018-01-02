var request =require('request');
module.exports = {
    send:function(req, res , options ){
        var sendData;
        if(typeof options.data !== 'object'){
          sendData = options.data;
        }else{
          sendData = Object.assign({} , options.data);
        }
        var method = options.method || 'GET';
        var headers = options.headers || {};
        if(options.rongcloudToken){
            var Nonce = Math.random();
            var Timestamp  = Date.now();
            //融云接口 token
            //useConfig.get('rongcloudAppSecret');
            headers['App-Key'] = useConfig.get('rongcloudAppKey');
            headers['Nonce'] = Nonce;
            headers['Timestamp'] = Timestamp ;
            headers['Signature'] = useToken.rongcloud({
                Timestamp:Timestamp,
                Nonce:Nonce,
            });
        }
        var __ = {
            url:options.url,
            method:method.toUpperCase(),
            headers:headers
        };
        if(method.toUpperCase() === 'POST' && !options.notBody){
                __.body = useCommon.stringify(sendData);
                __.headers["content-type"] =  "application/json";
        }else{
            var urlStr = useCommon.serialize(sendData);
            if(urlStr)__.url +=(__.url.indexOf('?')===-1?'?':'&') + urlStr;
        }
        console.log('request start : ');
        console.log(__);
        request(__ , function(err , response , body){
            if(res && response && response.statusCode == 401){
                res.status(401).end();
                return false;
            }
            try{
                body = JSON.parse(body);
            }catch(e){
            }
            if(typeof body === 'string'){
                body = {
                    data:body,
                    message:'系统繁忙'
                }
            }
            if(body){
              body.baseCode = body.code;
              if(body.code == 10000){
                body.code = 0;
              }
              if(body.result && !body.data){
                body.data = body.result;
                delete body.result;
              }
            }
            console.log(response && response.statusCode);
            console.log(body);
            options.done(body || {code:1,msg:'系统异常'});
        });
    },
    request : request
};
