
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

		$('#btn-about').click(function(){ aboutModal.modal('show'); });
		$('#btn-sign-in').click(function(){ window.location = '/login/'; });

		// Buttons for testing only. Safe to remove if you'd like.
		$('#btn-welcome').click(function(){ welcomeModal.modal('show'); });
		$('#btn-timeout').click(function(){ timeoutModal.modal('show'); });
		$('#btn-reservation-confirm').click(function(){ reservationConfirmModal.modal('show'); });
		$('#btn-reservation-success').click(function(){ reservationSuccessModal.modal('show'); });
		$('#btn-service-selection').click(function(){ serviceSelectionModal.modal('show'); });
		
		var aboutModal = $('.modal-about');
		aboutModal.modal({ show : false, keyboard : true, backdrop : true });

		var welcomeModal = $('.modal-welcome');
		welcomeModal.modal({ show : false, keyboard : true, backdrop : true });

		var timeoutModal = $('.modal-timeout');
		timeoutModal.modal({ show : false, keyboard : true, backdrop : true });

		var reservationConfirmModal = $('.modal-reservation-confirm');
		reservationConfirmModal.modal({ show : false, keyboard : true, backdrop : true });

		var reservationSuccessModal = $('.modal-reservation-success');
		reservationSuccessModal.modal({ show : false, keyboard : true, backdrop : true });
		
		var serviceSelectionModal = $('.modal-service-selection');
		serviceSelectionModal.modal({ show : false, keyboard : true, backdrop : true });
	}
	
});
