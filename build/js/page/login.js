;$(function(){
	var $loginForm = $('.login-form');
	var $resetForm = $('.reset-form');
    $loginForm.submit(function(){
        var sendData = $(this).__serializeJSON();
	    var valid = useValidate.login.validator(sendData , 'login');
	    if(!valid.valid){
            useCommon.toast(valid.message);
	    	return false;
	    }
	    sendData.password = window.md5(sendData.password);
	    $.post('/login' , sendData , function(a){
	       if(a.code == 0){
	           if(a.redirectUrl)location.href = a.redirectUrl;
	           else location.href = '/';
           } else {
	           useCommon.toast(a.message);
           }
        });
        return false;
    });
    $resetForm.submit(function(){
        var sendData = $(this).__serializeJSON();
	    var valid = useValidate.login.validator(sendData , 'reset');
	    if(!valid.valid){
            useCommon.toast(valid.message);
	    	return false;
	    }
	    sendData.password = window.md5(sendData.password);
	    sendData.newPassword = window.md5(sendData.newPassword);
	    delete sendData.twoPassword;
	    $.post('/login/reset' , sendData , function(a){
	       if(a.code == 0){
	           if(a.redirectUrl)location.href = a.redirectUrl;
	           else location.href = '/';
           } else {
	           useCommon.toast(a.message);
           }
        });
        return false;
    });
});