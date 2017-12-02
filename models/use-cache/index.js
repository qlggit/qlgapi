var caches = {};
function oneCache(key , expires , data){
    //初始化有效期
    this.timeType = expires;
    this.expiresTime = Date.now() + (expires - 0);
    this.key = key;
    this.data = data;
    oneCache.doSort(this);
}
oneCache.prototype = {
    //刷新有效期
    expires:function(time){
        if(this.timeType){
            if(!isNaN(time))this.expiresTime = Date.now() + time;
            this.remove();
            oneCache.doSort(this);
        }
    },
    //变更有效期
    addTime:function(time){
        if(!isNaN(time) && time !== 0)this.expiresTime += time;
        this.remove();
        oneCache.doSort(this);
    },
    remove:function(){
        var index = caches[this.timeType].indexOf(this);
        if(index > -1)caches[this.timeType].splice(index , 1);
    }
};
oneCache.doSort = function(data){
    var arr = caches[data.timeType] = caches[data.timeType] || [];
    if(!data.timeType || arr.every(function(a , i){
            if(a.expiresTime > data.expiresTime){
                arr.splice(i , 0 , data);
                return false;
            }
            return true;
        })){
        arr.push(data);
    }
};
//每5秒一次刷新缓存 有点误差 但是降低消耗
setInterval(function(){
    for(var key in caches){
        var minIndex = -1;
        if(key)caches[key].every(function(a , i){
            if(a.expiresTime > Date.now()){
                return false;
            }
            minIndex = i;
            return true;
        });
        if(minIndex > -1)caches[key].splice(0,minIndex+1);
    }
} , 5 * 1000);
module.exports = {
  get:function(key , expires){
      return caches[expires] && caches[expires].find(function(a){return a.key === key});
  },
  add:function(key , expires , data){
      var old = this.get(key , expires);
      if(old){
          old.expires(expires);
          old.data = data;
      }
      return old || new oneCache(key , expires , data);
  },
  remove:function(key , expires){
      var old = this.get(key , expires);
      if(old)old.remove();
  },
};