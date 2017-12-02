module.exports = function(data){
    return useCommon.SHA1(useConfig.get('rongcloudAppSecret') + data.Nonce + data.Timestamp )
}

