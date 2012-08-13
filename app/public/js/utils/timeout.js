window.TimeoutController = {
	activityDelay: 200000,
	continueDelay: 7000,
	timeout: null,
	$modal: null,
	init: function() {
		// Bind all of our methods to 'this'
		_.bindAll(this);

		// Create the timeout modal
		this.$modal = $('.modal-timeout');
		this.$modal.modal({show: false, keyboard: true, backdrop: true });

		// Listeners
		$.pubsub('subscribe', 'login.complete', this.onLogin);
		$.pubsub('subscribe', 'logout.complete', this.onLogout);

		// Check to see if we already have a session
		if (session && session.client) {
			this.onLogin();
		}
	},
	onLogin: function() {
		// Listen for user interaction and reset the timer
		this.monitorActivity('on');
		this.reset();
	},
	monitorActivity: function(state) {
		if (state === 'on') {
			$('body').on('mouseup, mousemove', this.reset);
		} else {
			$('body').off('mouseup, mousemove', this.reset);
		}
	},
	clear: function() {
		if (this.timeout) {
			window.clearTimeout(this.timeout);
		}
	},
	reset: function() {
		this.clear();
		this.timeout = window.setTimeout(this.onTimeout, this.activityDelay);
	},
	onTimeout: function() {
		this.monitorActivity('off');
		this.clear();

		// Force other modals to hide if there are any
		$.pubsub('publish', 'timeout.start');

		// Show our modal
		this.$modal.modal('show');

		// Listen for events
		this.$modal.find('.button-continue')
			.on('click', this.onContinueClicked);
		this.$modal.find('.button-close')
			.on('click', this.onContinueClicked);
		$('.modal-backdrop')
			.on('click', this.onContinueClicked);

		// If the user does not click confirm within a set
		// time go ahead and force a logout
		this.timeout = window.setTimeout(function() {
			$.pubsub('publish', 'timeout.complete');
			$.pubsub('publish', 'logout.click');
		}, this.continueDelay);
	},
	onLogout: function() {
		this.monitorActivity('off');
		this.clear();
		this.$modal.modal('hide');
	},
	onContinueClicked: function() {
		this.reset();
		this.monitorActivity('on');
		this.$modal.modal('hide');
	}
};

$(function() {
	window.TimeoutController.init();
});