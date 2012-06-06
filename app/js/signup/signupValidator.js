
function SignupValidator()
{

	this.alert = $('.modal-alert');
	this.error = $('.modal-form-errors');
    this.error.modal({ show : false, keyboard : true, backdrop : true });

	this.p1fields = [	$('#org-name'), $('#org-addy1'), $('#org-city'), $('#org-state'), $('#org-phone'), $('#org-website')];
	this.p2fields = [	$('#user-name'), $('#user-position'), $('#user-phone'), $('#user-email'), $('#user-pass1'), $('#user-pass2')];
}

SignupValidator.prototype.validateString = function(s)
{
	return s.length != 0;
}

SignupValidator.prototype.validateEmail = function(e)
{
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(e);	
}

SignupValidator.prototype.validatePhone = function(s)
{
	return s.length == 10 || s.length == 12;	
}

SignupValidator.prototype.validatePassword = function(s)
{
	return s.length >= 8;
}

SignupValidator.prototype.showAlert = function(h, m)
{
    this.alert.modal({ show : false, keyboard : true, backdrop : true });				
	this.alert.find('.modal-header h3').text(h);
	this.alert.find('.modal-body p').html(m);
	this.alert.modal('show');
}

SignupValidator.prototype.showSuccess = function(h, m)
{
    this.alert.modal({ show : false, keyboard : false, backdrop : 'static' });	
	this.alert.find('.modal-header h3').text(h);
	this.alert.find('.modal-body p').html(m);
	this.alert.modal('show');	
	this.alert.find('button').click(function(){ window.location.href = '/'; })
	setTimeout(function(){window.location.href = '/';}, 3000);
}

SignupValidator.prototype.showFormErrors = function(a)
{
	var ul = this.error.find('.modal-body ul');
		ul.empty();
	for (var i=0; i < a.length; i++) ul.append('<li>'+a[i]+'</li>');
	this.error.modal('show');
}

SignupValidator.prototype.validatePage1 = function ()
{	
//	return true;
	var e = [];
	for (var i=0; i < this.p1fields.length; i++) this.p1fields[i].removeClass('error');
	if (this.validateString(this.p1fields[0].find('input').val()) == false) {
		this.p1fields[0].addClass('error'); e.push("Please Enter Your Organization's Name");
	}
	if (this.validateString(this.p1fields[1].find('input').val()) == false) {
		this.p1fields[1].addClass('error'); e.push("Please Enter Your Organization's Address");
	}
	if (this.validateString(this.p1fields[2].find('input').val()) == false) {
		this.p1fields[2].addClass('error'); e.push("Please Enter Your Organization's City");
	}
	if (this.validateString(this.p1fields[3].find('select').val()) == false) {
		this.p1fields[3].addClass('error'); e.push('Please Choose A State');
	}
	if (this.validatePhone(this.p1fields[4].find('input').val()) == false) {
		this.p1fields[4].addClass('error'); e.push("Please Enter A Phone Number in Format 415-XXX-XXXX");
	}
	if (this.validateString(this.p1fields[5].find('input').val()) == false) {
		this.p1fields[5].addClass('error'); e.push("Please Enter Your Organization's Website Address");
	}		
	if (e.length) this.showFormErrors(e);
	return e.length === 0;
}

SignupValidator.prototype.validatePage2 = function ()
{	
//	return true;	
	var e = [];
	for (var i=0; i < this.p2fields.length; i++) this.p2fields[i].removeClass('error');
	if (this.validateString(this.p2fields[0].find('input').val()) == false) {
		this.p2fields[0].addClass('error'); e.push("Please Enter Your Name");
	}
	if (this.validateString(this.p2fields[1].find('input').val()) == false) {
		this.p2fields[1].addClass('error'); e.push("Please Enter Your Title or Position");
	}
	if (this.validatePhone(this.p2fields[2].find('input').val()) == false) {
		this.p2fields[2].addClass('error'); e.push("Please Enter Your Phone Number");
	}
	if (this.validateEmail(this.p2fields[3].find('input').val()) == false) {
		this.p2fields[3].addClass('error'); e.push('Please Enter Your Email Address');
	}
	if (this.validatePassword(this.p2fields[4].find('input').val()) == false) {
		this.p2fields[4].addClass('error'); e.push("Your password should be at least 8 characters");
	}
	if (this.p2fields[5].find('input').val() != this.p2fields[4].find('input').val()){
		this.p2fields[5].addClass('error'); e.push("Your passwords do not match");
	}
	if (e.length) this.showFormErrors(e);
	return e.length === 0;
}


