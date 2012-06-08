
$(document).ready(function(){

	socket = io.connect(); 	
	var hc = new HomeController();
})

HomeController = function()
{
	var ac; // active collection //
	var inv = ORG_DATA.inv;
	
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
	// update the admin panel and data modal //	
		var a = d.attr('id').split('-')
		var catName = a[0];
		var subName = a[1];
		if ((inv[catName][subName][0] == 0 && n == -1) || (inv[catName][subName][0] == inv[catName][subName][1]) && n == 1) return;
			inv[catName][subName][0] = parseInt(inv[catName][subName][0]) + n;
			inv[catName]['total'][0] = parseInt(inv[catName]['total'][0]) + n;
		$('#'+catName+' .inventory').text(inv[catName]['total'][0] +' / '+inv[catName]['total'][1]);
		d.find('.inventory').text(inv[catName][subName][0] +' / '+inv[catName][subName][1]);
	
	// update the outside world //	
		postToSockets(catName)
		postToDatabase(catName);
	}
	
	var postToSockets = function(catName)
	{
		socket.emit('bridge-event', {org:ORG_DATA.name, cat:catName, inv:inv[catName]});
	}	
	
	var postToDatabase = function(catName)
	{
		$.ajax({
			url: ORG_DATA.name,
			type: "POST",
			data: {cat:catName, inv:inv[catName]},
			success: function(data){
	 			console.log('success', data);
			},
			error: function(jqXHR){
				console.log('error', jqXHR.responseText+' :: '+jqXHR.statusText);
			}
		});
	}
	
}
