
$(document).ready(function() {
	
	socket = io.connect('/bridge');
	window.DashboardController = new function(){
		socket.on('status', function (connections) {
			var i=0; for (p in connections) i++;
			var s = i > 1 ? ' are '+i+' People ' : ' is '+i+' Person ';
			$('#connection-count').html('There '+s+' Currently Connected');
		});
		socket.on('bridge-event', function(org){
			var oid = org.name.replace(' ', '-');
			var div = $('#'+oid+' #services');
				div.empty();
			var dta = '';
			for (var i = org.inv.length - 1; i >= 0; i--){
				var s = org.inv[i];
				dta += '<div class="service">';
				dta += '<div class="text">';
					dta += '<div class="name">'+capitalize(s.name)+'</div>';
					dta += '<div class="avail">'+s.avail+' / '+s.total+'</div>';
				dta += '</div>';
					dta += '<div class="img"><img src="/img/icons/'+s.name+'.png"></div>';
				dta += '</div>';
			}
			div.append(dta);
		});

		var aboutModal = $('.modal-about');
		aboutModal.modal({ show : false, keyboard : true, backdrop : true });

		$('#btn-about').click(function(){ aboutModal.modal('show'); });
		$('#btn-login').click(function(){ window.location = '/login/'; });
	}
	
});
