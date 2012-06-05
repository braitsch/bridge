
$(document).ready(function(){

	var p1, p2;
	var sv = new SignupValidator();

	$('#signup-page-1').ajaxForm({
		beforeSubmit : function(data){
			if (sv.validatePage1() == false){
				return false;
			}	else{
				p1 = data.slice(0);
				data.push({name:'page', value:1});		
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
				for (var i=0; i < p1.length; i++) data.push(p1[i]);
				data.push({name:'page', value:2});
		//		console.log(data.length)
		//		for (var i=0; i < data.length; i++) console.log(data[i]['name'], 'val = '+data[i]['value']);					
				return true;
			}
		},
		success	: function(responseText, status, xhr, $form){
			if (status == 'success'){			
		//		sv.showSuccess('Success!', 'Your account has been created.<br>Please wait while you are redirected.');
			} 
		},
		error : function(e){
			sv.showAlert('Whoops!', "I'm sorry it looks like something went wrong :<br>"+e);
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
		$('#user-name').find('input').focus();		
	}		

	showPage1();
	$('#signup-back').click(function(){ showPage1() });
	$('#signup-cancel').click(function(){ window.location.href = '/' });	

});
