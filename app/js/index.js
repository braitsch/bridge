
$(document).ready(function() {
	socket = io.connect();
	socket.on('bridge-status', function (data) {
		var c = data.connections;
		var i=0; for (p in c) i++;
		var s = i > 1 ? ' are '+i+' People ' : ' is '+i+' Person ';
		$('#connection-count').html('There '+s+' Currently Connected');
	});
	socket.on('bridge-event', onBridgeData);
});

function onBridgeData(data)
{
	var tds = $('#'+data.cat+' td');
	if (data.cat == 'beds'){
		$(tds[0]).text(data.inv.total[0] + ' / ' + data.inv.total[1]);
		$(tds[1]).text(data.inv.male[0] + ' / ' + data.inv.male[1]);
		$(tds[2]).text(data.inv.female[0] + ' / ' + data.inv.female[1]);
		$(tds[3]).text(data.inv.family[0] + ' / ' + data.inv.family[1]);
	}	else if (data.cat == 'showers'){
		$(tds[0]).text(data.inv.total[0] + ' / ' + data.inv.total[1]);
		$(tds[1]).text(data.inv.male[0] + ' / ' + data.inv.male[1]);
		$(tds[2]).text(data.inv.female[0] + ' / ' + data.inv.female[1]);
	}	else if (data.cat == 'meals'){
		$(tds[0]).text(data.inv.total[0] + ' / ' + data.inv.total[1]);
		$(tds[1]).text(data.inv.bfast[0] + ' / ' + data.inv.bfast[1]);
		$(tds[2]).text(data.inv.lunch[0] + ' / ' + data.inv.lunch[1]);
		$(tds[3]).text(data.inv.dinner[0] + ' / ' + data.inv.dinner[3]);
	}
}