window.SelectServicesModel = {
	selections: [ {cat: 'meals', sub: 'breakfast'}, {cat: 'health', sub: 'critical'} ],
	currentCategory: ''
};

window.SelectServicesController = {
	init: function(el) {
		this.$el = $(el);

		// Every method of this object will be called with the proper
		// scope now. Take THAT jQuery!
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
		$('.service').on('click', this.onServiceClicked);
		$('#request-services').on('click', this.onRequestServicesClicked);
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
	saveSelection: function(subCategory) {
		console.log('saving selection');
		var currentCategory, previousSelections, filteredSelections;
		currentCategory = window.SelectServicesModel.currentCategory;
		previousSelections = window.SelectServicesModel.selections;
		console.log(previousSelections);
		filteredSelections = _.reject(previousSelections, function(selection) {
			return selection.cat === currentCategory;
		});
		console.log(filteredSelections);
		filteredSelections.push({ cat: currentCategory, sub: subCategory });
		window.SelectServicesModel.selections = filteredSelections;
		console.log(window.SelectServicesModel.selections);
	},
	onServiceClicked: function(event) {
		var serviceName, service, tmpl, compiled, serviceSelectionModal;

		// Grab the appropriate service from our JSON object
		serviceName = $(event.currentTarget).data('category');
		service = _.find(services, function(service) { return service.name === serviceName; });
		
		// Make sure we found something...
		if (service) {
			window.SelectServicesModel.currentCategory = service.name;
			
			// Compile the Mustache template for our modal and
			// pass it the service
			$tmpl = $('#modal-service-selection').html();
			compiled = Mustache.render($tmpl, { service: service });
			$selectServicesModal = $(compiled);

			// Assign our modal to a controller
			window.SelectServicesModalController.init($selectServicesModal);

			// Bootstrap it and add it to the page
			$selectServicesModal.modal({ show : false, keyboard : true, backdrop : true });
			$selectServicesModal.modal('show');
			$selectServicesModal.on('hidden', this.onModalHidden);
		}
	},
	onModalHidden: function() {
		// Destroy the modal when it's hidden. Since we rebuild it every time
		// this is necessary to prevent them from stacking up in the DOM
		// Let's also make sure to save whatever chategory may have been selected
		var subCategory  = $selectServicesModal.find('.is-selected').data('sub');
		console.log(subCategory);
		if (subCategory) {
			this.saveSelection(subCategory);
		}
		$selectServicesModal.detach();
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

window.SelectServicesModalController = {
	init: function(el) {
		this.$el = $(el);
		this.$services = this.$el.find('.service');

		// Set proper function scope
		_.bindAll(this);

		// Add view listeners
		this.$el.on('shown', this.highlightPreviousSelections);
		$('body').on('mouseup', this.onMouseUp);
	},
	highlightPreviousSelections: function() {
		// If the user previously selected something in this category let's
		// indicate that
		var currentCategory, selections, prevSelection;
		currentCategory = window.SelectServicesModel.currentCategory;
		selections = window.SelectServicesModel.selections;
		prevSelection = _.find(selections, function(selection) {
			return selection.cat === currentCategory;
		});

		if (prevSelection) {
			this.$el.find('div[data-sub="'+prevSelection.sub+'"]')
				.addClass('is-selected');
		}
	},
	onMouseUp: function() {
		var isModal, isService, isBackdrop, isClose, $service;
		isModal = !!$(event.target).parents('.modal').length;
		isService = !!$(event.target).parents('.service').length;
		isClose = !!$(event.target).parents('.button-close').length;
		isBackdrop = $(event.target).hasClass('modal-backdrop');

		// If the user clicked a new service highlight it
		// If the service was already highlighted unhighlight it
		if (isService) {
			$service = $(event.target).parents('.service');
			if ($service.hasClass('is-selected')) {
				$service.removeClass('is-selected');
			} else {
				this.$services.removeClass('is-selected');
				$service.addClass('is-selected');
			}
		}

		// Treat a click in the white space of the modal as an
		// attempt to cancel the current selection
		if (isModal && !isService) {
			this.$services.removeClass('is-selected');
		}
		
		// If the user clicked anything other than the white space in
		// the modal, close the modal.
		if (isService || isBackdrop || isClose) {
			$('body').off('mouseup', this.onMouseUp);
			this.$el.modal('hide');
		}
	}
};

$(document).ready(function() {
	window.SelectServicesController.init('#select-services');

	// Buttons for testing only. Safe to remove if you'd like.
	// $('#btn-timeout').click(function(){ timeoutModal.modal('show'); });
	// $('#btn-reservation-confirm').click(function(){ reservationConfirmModal.modal('show'); });
	// $('#btn-reservation-success').click(function(){ reservationSuccessModal.modal('show'); });

	// var timeoutModal = $('.modal-timeout');
	// timeoutModal.modal({ show : false, keyboard : true, backdrop : true });

	// var reservationConfirmModal = $('.modal-reservation-confirm');
	// reservationConfirmModal.modal({ show : false, keyboard : true, backdrop : true });

	// var reservationSuccessModal = $('.modal-reservation-success');
	// reservationSuccessModal.modal({ show : false, keyboard : true, backdrop : true });
});