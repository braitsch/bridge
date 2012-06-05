
$(document).ready(function(){

	var p1, p2;
	var sv = new SignupValidator();

	$('#signup-page-1').ajaxForm({
		beforeSubmit : function(data){
			if (sv.validatePage1() == false){
				return false;
			}	else{
				p1 = data; p1.push({name:'page', value:1});
				return true;
			}
		},
		success	: function(responseText, status, xhr, $form){
			if (status == 'success') showPage2();
		},
		error : function(e){
			sv.showAlert('Whoops!', "I'm sorry but that organization name is already taken.<br>Please try something else.");
		}
	});
	
	$('#signup-page-2').ajaxForm({
		beforeSubmit : function(data){
			if (sv.validatePage2() == false){
				return false;
			}	else{
				concatFormData(data);
				return true;
			}
		},
		success	: function(responseText, status, xhr, $form){
			if (status == 'success'){
		//		for (var i=0; i < p2.length; i++) console.log(p2[i]['name'], 'val = '+p2[i]['value']);				
				sv.showSuccess('Success!', 'Your account has been created.<br>Please wait while you are redirected.');
			} 
		},
		error : function(e){
			sv.showAlert('Whoops!', "I'm sorry it looks like something went wrong.<br>Please try again later.");
		}
	});
	
	function showPage1()
	{
		$('#signup-page-1').show();		
		$('#signup-page-2').hide();
		$('#org-name').find('input').focus();
	}
	
	function showPage2()
	{
		$('#signup-page-1').hide();
		$('#signup-page-2').show();
		$('#admin-name').find('input').focus();		
	}
	
	function concatFormData(data)
	{
		p2 = data;
		for (var i = p1.length - 1; i >= 0; i--) if (p1[i]['name'] == 'page') p1[i]['value'] = 2; p2.push(p1[i]);
	}		

	showPage1();
	$('#signup-back').click(function(){ showPage1() });
	$('#signup-cancel').click(function(){ window.location.href = '/' });	

});
