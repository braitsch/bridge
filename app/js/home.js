
$(document).ready(function(){

	socket = io.connect(); 	
	var hc = new HomeController();
		
})

HomeController = function()
{
	var ac; // active collection //
	var inv = {
		beds	:{ male	:[50, 100], female	:[50, 100], family:[50, 100] },
		showers	:{ male	:[50, 100], female	:[50, 100] },
		meals	:{ bfast:[50, 100], lunch	:[50, 100], dinner:[50, 100] }
	};
	
	$('#btn-logout').click(function(){	
		console.log('logging out')
	})	
	$('#skt-button').click(function(){
		socket.emit('bridge-event', { msg:'hello'});
	})	
	$('#top img').click(function(e){
		var n = $(e.target).closest('.span4').attr('id');
		setActiveCollection(n);
	})
	$('.opt .image').click(function(e){
		var d = $(e.target).attr("class");		
		var n = $(e.target).closest('.span4').attr('id');
		console.log('clicked', n, d);
	})
	$(".opt .slice").hover(handlerIn, handlerOut);

	var handlerIn = function(e)
	{
		$(e.currentTarget).fadeTo(200, 1);
	}

	var handlerOut = function(e)
	{
		$(e.currentTarget).fadeTo(200, 0);
	}	

	var setActiveCollection = function(nc)
	{
		$('#'+ac+'-o .opt').each(function(i, o){ $(o).fadeOut(); })
		$('#'+nc+'-o .opt').each(function(i, o){ $(o).delay(i * 100).fadeIn(); })
		ac = nc;
	}
	
	var onInventoryClick = function()
	{
		// 
	}	
	
}
