function Permission(){

}
Permission.auth = function(permissionCode){
    return function(req , res , next){
        req.__permissionCode = permissionCode;
        var permissionList = req.session.userInfo.permissionList;
        if(permissionList.every(function(a){
            if(a === permissionCode){
                next();
                return false;
            }
            return true
            })){
            return res.sendErrorMessage('HTTP_CODE_406','');
        }
    }
};
Permission.authMenu = function(menuCode){
    return function(req , res , next){
        req.__menuCode = menuCode;
        var menuList = req.session.userInfo.menuList;
        if(menuList.every(function(a){
                if(a.code === menuCode){
                    next();
                    return false;
                }
                return true
            })){
            return res.sendErrorMessage('HTTP_CODE_406','');
        }
    }
};
Permission.menuList = {
    menu0101:'/permission/role',
    menu0102:'/permission/user',

    menu0201:'/channel/advert',

    menu0301:'/shake/config',
    menu0302:'/shake/list',
    menu0303:'/shake/prize',

    menu0401:'/product/list',

    menu0501:'/withdraw/list',
};
module.exports = Permission;