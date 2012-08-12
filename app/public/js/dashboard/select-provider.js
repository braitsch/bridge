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

		// Add view listeners
		$('.button-reserve').on('click', this.onReserveClicked);
		this.$confirmModal.find('.button-no').on('click', this.onNoClicked);
		this.$confirmModal.find('.button-yes').on('click', this.onYesClicked);
		this.$successModal.find('.button-logout').on('click', this.onLogOutClicked);
		this.$successModal.find('.button-more').on('click', this.onMoreClicked);
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
	}
};

$(document).ready(function() {

	$('.button-back').on('click', function(){ window.location.href = '/'});
	$('#btn-login').html("<i class='icon-lock icon-white'/>Log Out");

	window.ReservationController.init();

});