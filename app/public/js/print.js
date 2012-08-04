
$(document).ready(function(){
	
	$('body').css('background', 'white');
	
	$('#tab-orgs').click(function(){
		showOrgs();
	})
	$('#tab-usrs').click(function(){
		showUsrs();
	})
	$('#tab-clients').click(function(){
		showClients();
	})
	
	function showOrgs()
	{
		$('#print-orgs').show();
		$('#print-usrs').hide();
		$('#print-clients').hide();
		$('#tab-orgs').addClass('active');
		$('#tab-usrs').removeClass('active');
		$('#tab-clients').removeClass('active');
	}
	
	function showUsrs()
	{
		$('#print-usrs').show();
		$('#print-orgs').hide();
		$('#print-clients').hide();
		$('#tab-usrs').addClass('active');
		$('#tab-orgs').removeClass('active');
		$('#tab-clients').removeClass('active');
	}
	
	function showClients()
	{
		$('#print-usrs').hide();
		$('#print-orgs').hide();
		$('#print-clients').show();
		$('#tab-clients').addClass('active');
		$('#tab-orgs').removeClass('active');
		$('#tab-usrs').removeClass('active');
	}
	
	showOrgs();
	
})