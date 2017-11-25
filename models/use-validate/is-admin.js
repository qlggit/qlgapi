module.exports = function(){
    return function (req , res , next) {
        if(req.headers.username === 'admin'){
            return next();
        }
        return res.sendErrorMessage('HTTP_CODE_408','');
    }
};