$(document).ready(function() {

	window.ServiceSelectController = {
		init: function() {
			_.bindAll(this);

			if (cdata) {
				this.enableServices();
			} else {
				this.disableServices();
			}

			// Add application event listeners
			$.pubsub('subscribe', 'login.complete', this.enableServices);
			$.pubsub('subscribe', 'logout.complete', this.disableServices);

			// Add view event listeners
			$('.service').click(this.onServiceClicked);
			$('#request-services').click(this.onRequestServicesClicked);
		},
		enableServices: function() {
			$('.service, .button-reserve')
				.removeClass('is-disabled')
				.addClass('is-enabled');
		},
		disableServices: function() {
			$('.service, .button-reserve')
				.removeClass('is-enabled')
				.addClass('is-disabled');
		},
		onServiceClicked: function(event) {
			var serviceName, service, tmpl, compiled, serviceSelectionModal;

			// Grab the appropriate service from our JSON object
			serviceName = $(event.currentTarget).attr('id');
			service = _.find(services, function(service) { return service.name === serviceName; });

			// Compile the Mustache template for our modal and
			// pass it the service
			tmpl = $('#modal-service-selection').html();
			compiled = Mustache.render(tmpl, { service: service });
			serviceSelectionModal = $(compiled);

			// Create a new Bootstrap modal and add it to the page
			serviceSelectionModal.modal({ show : false, keyboard : true, backdrop : true });
			serviceSelectionModal.modal('show');

			// Destroy the modal when it's hidden. Since we rebuild it every time
			// this is necessary to prevent them from stacking up in the DOM
			serviceSelectionModal.on('hidden', function () {
				$(this).detach();
			});
		},
		onRequestServicesClicked: function(event) {
			$.ajax({
				url: '/request-services',
				type: "POST",
				data: { services : [ {cat:'meals', sub:'breakfast' } ] },
				success: function(ok) { 
					window.location.href = '/request-provider'; 
				},
				error: function(jqXHR){ 
					console.log('error', jqXHR.responseText+' :: '+jqXHR.statusText); 
				}
			});
		}
	};

	window.ServiceSelectController.init();

	// Buttons for testing only. Safe to remove if you'd like.
	$('#btn-timeout').click(function(){ timeoutModal.modal('show'); });
	// $('#btn-reservation-confirm').click(function(){ reservationConfirmModal.modal('show'); });
	// $('#btn-reservation-success').click(function(){ reservationSuccessModal.modal('show'); });

	// var timeoutModal = $('.modal-timeout');
	// timeoutModal.modal({ show : false, keyboard : true, backdrop : true });

	// var reservationConfirmModal = $('.modal-reservation-confirm');
	// reservationConfirmModal.modal({ show : false, keyboard : true, backdrop : true });

	// var reservationSuccessModal = $('.modal-reservation-success');
	// reservationSuccessModal.modal({ show : false, keyboard : true, backdrop : true });
});