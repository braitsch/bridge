
$(document).ready(function(){

	window.LoginController = new function(){
	
		var lv = new LoginValidator();
	
		$('#login-form').ajaxForm({
			beforeSubmit : function(data){
				if (lv.validateLogin() == false){
					return false;
				} 	else{
				// append 'remember-me' option to formData to write local cookie //
					data.push({name:'remember-me', value:$("input:checkbox:checked").length == 1})
					return true;
				}
			},
			success	: function(responseText, status, xhr, $form){
				if (status == 'success') window.location.href = '/inventory';
			},
			error : function(e){
	            lv.showLoginModal('Login Failure', 'Please check your username and/or password');
			}
		});
		
		$('#email-form').ajaxForm({
			url : '/email-password',
			beforeSubmit : function(data){
				if (lv.validateEmail($('#email-form #email').val())){
					lv.hideEmailAlert();
					return true;
				} 	else{
					lv.showEmailAlert("<b> Error!</b> Please enter a valid email address", false);
					return false;
				}
			},
			success	: function(responseText, status, xhr, $form){
				console.log('ok');
				lv.showEmailAlert("Check your email on how to reset your password.", true);
			},
			error : function(e){
				console.log('no');
				lv.showEmailAlert("I'm Sorry. I could not find that email address", false);
			}
		});

		$('#login-form #email').focus();
		$('#forgot-password').click(function(){ lv.showEmailModal() });

	}();
	
});
