var socket = io.connect('/bridge');
// Stub out the socket handler...
socket.on('bridge-event', function(inv) {
	console.log(inv);
	// inv will be an array of eight objects mapped to the categories
});

window.ReservationModel = {
	provider: null
};

window.topMargins = [];

window.ReservationController = {
	$el: null,
	$confirmModal: null,
	$successModal: null,
	init: function(el) {
		this.$el = $(el);
		this.$confirmModal = $('.modal-reservation-confirm');
		this.$confirmModal.modal({ show : false, keyboard : true, backdrop : true });
		this.$successModal = $('.modal-reservation-success');
		this.$successModal.modal({ show : false, keyboard : true, backdrop : 'static' });

		_.bindAll(this);

		// Add listeners
		$('.button-reserve').on('click', this.onReserveClicked);
		this.$confirmModal.find('.button-no').on('click', this.onNoClicked);
		this.$confirmModal.find('.button-yes').on('click', this.onYesClicked);
		this.$successModal.find('.button-logout').on('click', this.onLogOutClicked);
		this.$successModal.find('.button-more').on('click', this.onMoreClicked);
		$.pubsub('subscribe', 'timeout.start', this.onTimeoutStart);
	},
	onReserveClicked: function(event) {
		var $reservations, margins;
		window.ReservationModel.provider = $(event.currentTarget).data('provider');
		$reservations = $(event.currentTarget).parents('.reservation');
		window.topMargins = [];
		$reservations.find('.v-progress-bar').each(function(index, item) {
			window.topMargins.push($(item).css('margin-top'));
		});
		window.topMargins.reverse();
		this.$confirmModal.find('.provider').html(' ' + window.ReservationModel.provider + ', ');
		setProgressBars(window.topMargins, this.$confirmModal.find('.v-progress-bar'));
		this.$confirmModal.modal('show');
	},
	onNoClicked: function(event) {
		this.$confirmModal.modal('hide');
	},
	onYesClicked: function(event) {
		var post = $.ajax({
			url: '/request-provider',
			type: "POST",
			data: { provider : window.ReservationModel.provider }
		});

		post
			.done(this.onReservationSuccess)
			.fail(this.onReservationFail);
	},
	onReservationSuccess: function() {
		this.$confirmModal.modal('hide');
		this.$successModal.find('.provider').html(' ' + window.ReservationModel.provider + ', ');
		setProgressBars(window.topMargins, this.$successModal.find('.v-progress-bar'));
		this.$successModal.modal('show');
	},
	onReservationFail: function() {
		console.log('reservation failed!');
		console.log(arguments);
	},
	onLogOutClicked: function(event) {
		this.$successModal.modal('hide');
		$.pubsub('publish', 'logout.click');
	},
	onMoreClicked: function(event) {
		window.ReservationModel.provider = null;
		this.$successModal.modal('hide');
	},
	onTimeoutStart: function() {
		this.$confirmModal.modal('hide');
		this.$successModal.modal('hide');
	}
};

$(document).ready(function() {

	$('.button-back').on('click', function(){ window.location.href = '/'});
	$('#btn-login').html("<i class='icon-lock icon-white'/>Log Out");
	window.ReservationController.init('.reservation-wrapper');
	randomizeProgressBars('.reservation-wrapper');
});