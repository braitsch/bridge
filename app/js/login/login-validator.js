
function LoginValidator(){
   	
	this.loginModal = $('.modal-alert');
    this.loginModal.modal({ show : false, keyboard : true, backdrop : true });

	this.emailModal = $('.modal-email');
    this.emailModal.modal({ show : false, keyboard : true, backdrop : true });

	this.emailModal.on('shown', function(){ $('#email-form #email').focus(); });
	this.emailModal.on('hidden', function(){ $('#login-form #email').focus(); });
	
	this.emailAlert = $('#email-form .alert');	

}

LoginValidator.prototype.validateLogin = function()
{
	var e = $('#login-form #email').val();
	var p = $('#login-form #passw').val();
	if (this.validateEmail(e) == false){
		this.showLoginModal('Whoops!', 'Please enter a valid email address.');
		return false;
	}	else if (p.length < 6){
		this.showLoginModal('Whoops!', 'Please enter a valid password.');
		return false;
	}	else{
		return true;
	}
}

LoginValidator.prototype.validateEmail = function(e)
{
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(e);
}

// modal windows //

LoginValidator.prototype.showLoginModal = function(h, m)
{
    $('.modal-alert .modal-header h3').text(h);
    $('.modal-alert .modal-body p').text(m);
    this.loginModal.modal('show');
}

LoginValidator.prototype.showEmailModal = function()
{
    this.emailModal.modal('show');
}

// mini alerts bound to email modal window //

LoginValidator.prototype.showEmailAlert = function(m, ok)
{
	var c = ok ? 'alert-success' : 'alert-error';
	this.emailAlert.attr('class', 'alert '+c);
	this.emailAlert.html(m);
	this.emailAlert.show();
}

LoginValidator.prototype.hideEmailAlert = function(m)
{
	this.emailAlert.hide();
}

