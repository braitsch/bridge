
$(document).ready(function(){

	socket = io.connect(); 	
	var hc = new HomeController();
})

HomeController = function()
{
	var catDiv, category;
	
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

	var setActiveCollection = function(newDiv)
	{
		$('#'+catDiv+'-o .opt').each(function(i, o){ $(o).fadeOut(); })
		$('#'+newDiv+'-o .opt').each(function(i, o){ $(o).delay(i * 100).fadeIn(); })
		catDiv = newDiv;
		for (var i = ORG_DATA.inv.length - 1; i >= 0; i--) if (ORG_DATA.inv[i].name == newDiv) category = ORG_DATA.inv[i];
	}
	
	var onInventoryClick = function(d, n)
	{
	// update the admin panel and data modal //	
		var field = d.attr('id').split('-')[1];
		for (var i = category.fields.length - 1; i >= 0; i--){
			if (category.fields[i].name == field) {
				var activeField = category.fields[i]; break;
			}
		};
		console.log(activeField.name, activeField.avail)
		if ((activeField.avail == 0 && n == -1) || (activeField.avail == activeField.total) && n == 1) return;
			activeField.avail = parseInt(activeField.avail) + n;
		//	inv[catName].avail = parseInt(inv[catName].avail) + n;
	//	$('#'+catName+' .inventory').text(inv[catName]['total'][0] +' / '+inv[catName]['total'][1]);
		d.find('.inventory').text(activeField.avail +' / '+activeField.total);
	
	// update the outside world //	
		postToSockets()
		postToDatabase();
	}
	
	var postToSockets = function(catName)
	{
		socket.emit('bridge-event', {org:ORG_DATA.name, inv:category});
	}	
	
	var postToDatabase = function(catName)
	{
		$.ajax({
			url: '/control-panel',
			type: "POST",
			data: { inv : category },
			success: function(data){
	 			console.log('success', data);
			},
			error: function(jqXHR){
				console.log('error', jqXHR.responseText+' :: '+jqXHR.statusText);
			}
		});
	}
	
}
