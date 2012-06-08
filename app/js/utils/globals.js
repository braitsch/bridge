
// global functions shared across modules //

var capitalize = function(s)
{
	return s.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

var restrictInputFieldToNumbers = function(evt)
{
	var e = evt || window.event;
	var k = e.keyCode || e.which;
	// allow tab & delete keys //
	if (k == 8 || k == 9) return true;
	 	k = String.fromCharCode( k );
	var regex = /[0-9]/;
	if (regex.test(k) == false) {
		e.returnValue = false;
		if (e.preventDefault) e.preventDefault();
	}
}