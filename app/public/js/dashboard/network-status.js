
$(document).ready(function() {
	
	socket = io.connect('/bridge');
	window.DashboardController = new function(){
		var cnt = null;
		socket.on('bridge-event', function(org){
			cnt = $('#'+org.name.replace(' ', '-')+' #services');
			for (var i = org.inv.length - 1; i >= 0; i--){
				var service = org.inv[i];
				var service_d = cnt.find('#'+service.name);
				if (!service_d.length) {
					addService(org, service);
				}	else{
					service_d.find('.avail').text(service.avail+' / '+service.total);
					for (var k = service.fields.length - 1; k >= 0; k--){
						var field = service.fields[k];
						var field_d = cnt.find('#'+service.name+'-'+field.name);
						var field_a = field_d.find('.avail');
						var field_a_t = field_a.text();
						var old_avail = parseInt(field_a_t.substr(0, field_a_t.indexOf('/')));
						if (old_avail != field.avail){
							field_d.find('.bkgd').show();
							field_d.find('.bkgd').fadeOut();
							field_a.text(field.avail+' / '+field.total);
						}
					};
				}
			}
		});
		// function addService(o, s)
		// {
		// 	var div = "<div class='service'>";
		// 		div+= "<div id='"+s.name+"' class='cat'>";
		// 		div+= "<div class='icon'><img src=/img/icons/small/icon-"+s.name+"-general.png /></div>";
		// 		div+= "<div class='text'>";
		// 		div+= "<div class='name'>"+capitalize(s.name)+"</div>";
		// 		div+= "<div class='avail'>"+s.avail+' / '+s.total+"</div>";
		// 		div+= "</div>";
		// 		div+= "<hr>";
		// 		for (var n = s.fields.length - 1; n >= 0; n--){
		// 			var f = s.fields[n];
		// 			div+= "<div id='"+s.name+'-'+f.name+"' class='sub'>";
		// 			div+= "<div class='bkgd'></div>";
		// 			div+= "<div class='icon'><img src=/img/icons/small/icon-"+s.name+'-'+f.name+".png /></div>";
		// 			div+= "<div class='text'>";
		// 			div+= "<div class='name'>"+capitalize(f.name.replace('-', ' '))+"</div>";
		// 			div+= "<div class='avail'>"+f.avail+' / '+f.total+"</div>";
		// 			div+= "</div></div>";
		// 		}
		// 		div+= "</div></div>";
		// 	cnt.append(div);
		// }
		for (var i = orgs.length - 1; i >= 0; i--){
			var div = $('#'+orgs[i].name.replace(/\s/g, '-'));
			div.find('.service').each(function(n, s_div){
				var s_obj = null; // service object //
				var c_div = $(s_div).find('.cat');
				for (var n = orgs[i].inv.length - 1; n >= 0; n--) if (orgs[i].inv[n].name == c_div.attr('id')) { s_obj = orgs[i].inv[n]; break; }
				if (s_obj == null){
					$(this).css('display', 'none');
				}	else{
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
							$(f_div).find('.avail').text(f_obj.avail+' / '+f_obj.total);
						}
					})
				}
			})
		}
	}

});
