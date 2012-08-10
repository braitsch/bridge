
$(document).ready(function() {
	
	socket = io.connect('/bridge');
	window.DashboardController = new function(){
		socket.on('status', function (connections) {
			var i=0; for (p in connections) i++;
			var s = i > 1 ? ' are '+i+' People ' : ' is '+i+' Person ';
			$('#connection-count').html('There '+s+' Currently Connected');
		});
		var cnt;
		socket.on('bridge-event', function(org){
			cnt = $('#'+org.name.replace(' ', '-')+' #services');
			for (var i = org.inv.length - 1; i >= 0; i--){
				var service = org.inv[i];
				var service_d = $('#'+service.name);
				service_d.find('.avail').text(service.avail+' / '+service.total);
				for (var k = service.fields.length - 1; k >= 0; k--){
					var field = service.fields[k];
					var field_d = $('#'+service.name+'-'+field.name);
					var field_a = field_d.find('.avail');
					var field_a_t = field_a.text();
					var old_avail = parseInt(field_a_t.substr(0, field_a_t.indexOf('/')));
					if (old_avail != field.avail){
						field_d.find('.bkgd').show();
						field_d.find('.bkgd').fadeOut();
						field_a.text(field.avail+' / '+field.total);
					}
				};
			}
		});
	}

});
