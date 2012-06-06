
$(document).ready(function(){

	socket = io.connect(); 	
	var hc = new HomeController();
})

HomeController = function()
{
	var ac; // active collection //
	var iv = JSON.parse($("#inv").val());
	
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
		var d = $(e.target).closest('.span4');
		var n = $(e.target).attr("class") == 'slice ir' ? 1 : -1;
		onInventoryClick(d, n);
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
	
	var onInventoryClick = function(d, n)
	{
		var a = d.attr('id').split('-')
		var catName = a[0];
		var subName = a[1];
		if ((iv[catName][subName][0] == 0 && n == -1) || (iv[catName][subName][0] == iv[catName][subName][1]) && n == 1) return;
			iv[catName][subName][0] += n;
			iv[catName]['total'][0] += n;
		$('#'+catName+' .inventory').text(iv[catName]['total'][0] +' / '+iv[catName]['total'][1]);
		d.find('.inventory').text(iv[catName][subName][0] +' / '+iv[catName][subName][1]);
		
		// update database //
		// dispatch socket event //
		
	}	
	
}
