
$(document).ready(function() {
	
	socket = io.connect();
	window.DashboardController = new function(){
		
		socket.on('bridge-status', function (data) {
			var c = data.connections;
			var i=0; for (p in c) i++;
			var s = i > 1 ? ' are '+i+' People ' : ' is '+i+' Person ';
			$('#connection-count').html('There '+s+' Currently Connected');
		});
		socket.on('bridge-event', function(org){
			for (var i = org.inv.length - 1; i >= 0; i--){
				var cat = org.inv[i];
				var tds = $('#'+org.name+' #'+cat.name+' td');
			// update category totals //	
				$($(tds)[0]).text(cat.avail + ' / ' + cat.total);
				for (var k = cat.fields.length - 1; k >= 0; k--){
					var fld = cat.fields[k];
					$($(tds)[k+1]).text(fld.avail + ' / ' + fld.total);			
				};
			};
		});
	}
	
});
