var inventory = [ 	{name:"van", avail: 10, total: 100}, 
					{name:"group", avail:20, total:100}, 
					{name:"budget", avail: 30, total: 100},
					{name:"resume", avail: 40, total: 100},
					{name:"attire", avail: 50, total: 100},
					{name:"critical", avail: 60, total: 100},
					{name:"breakfast", avail: 70, total: 100},
					{name:"individual", avail: 80, total: 100}
				];
var socket = io.connect('/bridge');
// Stub out the socket handler...
socket.on('bridge-event', function(inv) {
	console.log(inv);
	// inv will be an array of eight objects mapped to the categories
});

function updateProgressBars(type) {
	_.each(inventory, function(service) {
		var $service, $progress, percent;
		$service = $('div[data-'+type+'="'+service.name+'"]');
		$progress = $service.find('.v-progress-bar');
		// our fuel gauges are 100px high so this works out well
		percent = parseInt(100 * (service.avail / service.total), 10);
		$progress.css({ 'margin-top': percent + 'px' });
	});
}

window.ReservationModel = {
	provider: null
};

window.ReservationController = {
	$confirmModal: null,
	$successModal: null,
	init: function() {
		this.$confirmModal = $('.modal-reservation-confirm');
		this.$confirmModal.modal({ show : false, keyboard : true, backdrop : true });
		this.$successModal = $('.modal-reservation-success');
		this.$successModal.modal({ show : false, keyboard : true, backdrop : true });

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
		window.ReservationModel.provider = $(event.currentTarget).data('provider');
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
		console.log('reservation succeeded');
		this.$confirmModal.modal('hide');
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

	window.ReservationController.init();
	updateProgressBars('sub');
});