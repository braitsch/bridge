
$(document).ready(function() {
	
	socket = io.connect('/bridge');
	window.DashboardController = new function(){
		
		socket.on('status', function (connections) {
			var i=0; for (p in connections) i++;
			var s = i > 1 ? ' are '+i+' People ' : ' is '+i+' Person ';
			$('#connection-count').html('There '+s+' Currently Connected');
		});
		socket.on('bridge-event', function(org){
			var oid = org.name.replace(' ', '-');
			var div = $('#'+oid);
				div.empty();
				console.log(org.inv.length)
			var dta = '<p class="orgName">'+ capitalize(org.name) +'</p>';
			for (var i = org.inv.length - 1; i >= 0; i--){
				var cat = org.inv[i];		
					dta+= '<table class="table table-bordered table-striped">';
					dta+= '<thead>';
					dta+= '<th>Available '+capitalize(cat.name)+'</th>'
				for (var k = cat.fields.length - 1; k >= 0; k--){
					var fld = cat.fields[k];
					dta+= '<th>'+capitalize(fld.name)+' '+capitalize(cat.name)+'</th>';
				};
					dta+= '</thead>';
					dta+= '<tbody><tr><td>'+ cat.avail + ' / ' + cat.total + '</td>';
				for (var k = cat.fields.length - 1; k >= 0; k--){
					var fld = cat.fields[k];
					dta+= '<td>'+fld.avail+ ' / ' +fld.total+'</td>';
				};					
				dta+= '</tr></tbody></table>';					
			};
			div.append(dta);
		});
	}
	
});
