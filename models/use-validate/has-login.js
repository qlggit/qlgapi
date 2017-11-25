module.exports = function(req , res , next){
    var redirectUrl;
    console.log(req.session);
    if(req.session.userInfo){
        return next();
    }
    redirectUrl = '/wechat/login';
    if(req.xhr){
        return res.sendErrorMessage('HTTP_CODE_401',{
            redirectUrl:redirectUrl
        });
    }else{
        res.useRedirect(redirectUrl);
    }
};
