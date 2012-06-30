
$(document).ready(function(){
	

	$('#tab-orgs').click(function(){
		showOrgs();	
	})
	
	$('#tab-usrs').click(function(){
		showUsrs();	
	})
	
	function showOrgs()
	{
		$('#print-orgs').show();
		$('#print-usrs').hide();
		$('#tab-orgs').addClass('active');	
		$('#tab-usrs').removeClass('active');
	}
	
	function showUsrs()
	{
		$('#print-usrs').show();
		$('#print-orgs').hide();
		$('#tab-usrs').addClass('active');	
		$('#tab-orgs').removeClass('active');
	}	
	
	showOrgs();
	
})