global.bankListData = [];
var mongo ;
var permissionRelationDb,permissionMenuDb,permissionDb,operatorDb;
var adminData = {};
var otherData = {};
module.exports = {
    getUser:function(findData,call){
        findData = findData || {};
        operatorDb.findOne(findData,function(a){
            call(a);
        });
    },
    getOperator:function(findData,call){
        findData = findData || {};
        operatorDb.find(findData,function(a){
            call(a);
        });
    },
    getRole:function(findData,call){
        findData = findData || {};
        permissionRelationDb.find(findData,function(a){
            call(a);
        });
    },
    getMenuList:function(findData , call){
        if(findData.type === undefined){
            var all = [];
            [0,1].forEach(function(a){
                all.push(new Promise(function(rev , rej){
                    useData.getMenuList({
                        type:a
                    } , function(b){
                       rev(b);
                    });
                }));
            });
            Promise.all(all).then(function(v){
                call(v[0].concat(v[1]));
            });
        }
        else{
            var autoData = findData.type === 0?adminData:otherData;
            if(autoData.menuList){
                if(call)call(autoData.menuList);
            }else{
                permissionMenuDb.find({type:findData.type},function(a){
                    autoData.menuList = a.data;
                    if(call)call(autoData.menuList);
                });
            }
        }
    },
    getPermissionList:function(findData , call){
        var autoData = findData.type === 0?adminData:otherData;
        if(autoData.permissionList){
            if(call)call(autoData.permissionList);
        }else{
            permissionDb.find({type:0},function(a){
                autoData.permissionList = a.data;
                if(call)call(autoData.permissionList);
            });
        }

    },
    clearData:function(type , keys){
        var autoData = type === 0?adminData:otherData;
        for(var key in autoData){
            if(!keys || keys.indexOf(key) > -1)delete autoData[key];
        }
    },
    init:function(){
        mongo = useMongo();
        permissionRelationDb = mongo.create('permissionRelation');
        permissionMenuDb = mongo.create('permissionMenu');
        permissionDb = mongo.create('permission');
        operatorDb = mongo.create('operator');
        this.getMenuList({type:0});
        this.getMenuList({type:1});
        this.getPermissionList({type:0});
        this.getPermissionList({type:1});
    }
};


