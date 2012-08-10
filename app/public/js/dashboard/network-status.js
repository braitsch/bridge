
$(document).ready(function() {
	
	socket = io.connect('/bridge');
	window.DashboardController = new function(){
		var div = null;
		socket.on('bridge-event', function(org){
			div = $('#'+org.name.replace(/\s/g, '-'));
			onServiceUpdate(div, org, true);
		});
		for (var i = orgs.length - 1; i >= 0; i--){
			div = $('#'+orgs[i].name.replace(/\s/g, '-'));
			onServiceUpdate(div, orgs[i], false);
		}
		function onServiceUpdate(org_div, org, animate)
		{
			org_div.find('.service').each(function(n, s_div){
				var s_obj = null; // service object //
				var c_div = $(s_div).find('.cat');
				for (var n = org.inv.length - 1; n >= 0; n--) if (org.inv[n].name == c_div.attr('id')) { s_obj = org.inv[n]; break; }
				if (s_obj == null){
					$(this).css('display', 'none');
				}	else{
					$(this).css('display', 'inline');
				// update category avail & total //
					c_div.find('.avail').text(s_obj.avail+' / '+s_obj.total);
				// iterate over subcategories //
					$(s_div).find('.sub').each(function(n, f_div){
						var f_obj = null;
						for (var j = s_obj.fields.length - 1; j >= 0; j--) if (s_obj.name+'-'+s_obj.fields[j].name == $(f_div).attr('id')) { f_obj = s_obj.fields[j]; break; }
						if (f_obj == null){
							$(this).css('display', 'none');
						}	else{
						// update sub-category avail & total //
							var field_a = $(f_div).find('.avail');
							var field_a_t = field_a.text();
							if (animate == false){
								field_a.text(f_obj.avail+' / '+f_obj.total);
							}	else{
								var old_avail = parseInt(field_a_t.substr(0, field_a_t.indexOf('/')));
								if (old_avail != f_obj.avail){
									$(f_div).find('.bkgd').show();
									$(f_div).find('.bkgd').fadeOut();
									field_a.text(f_obj.avail+' / '+f_obj.total);
								}
							}
						}
					})
				}
			})
		}
	}
});
