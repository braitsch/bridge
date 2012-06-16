
$(document).ready(function(){

// global data object that describes the available services //
	SERVICES = JSON.parse($("#services").val())
	
	socket = io.connect('/bridge');
	window.InventoryController = new function(){

		var category, catSchema; 

		var openEditor = function(e)
		{
			var n = e.target.name;
			for (var i = SERVICES.length - 1; i >= 0; i--) {
				if (n == SERVICES[i]['name']) {
					catSchema = SERVICES[i]; break;
				}
			}
			category = null;
			for (var i = ORG_DATA.inv.length - 1; i >= 0; i--){
				if (n == ORG_DATA.inv[i]['name']) {
					category = ORG_DATA.inv[i]; break;
				}
			};
			$('.modal-inventory fieldset').empty();
			$('.modal-inventory h3').text(capitalize(catSchema.name));
			for (var i=0; i < catSchema.fields.length; i++) {
				var fld = catSchema.fields[i];
				var val = getOrgFieldData(fld);
				var opt = '<label>' + fld;
					opt+= '<input class="input.input-xlarge", type="text", value="'+(val ? val.total : 0)+'", onkeydown="restrictInputFieldToNumbers(event)" />';
					opt+="</label>";
				$('.modal-inventory fieldset').append(opt);
			};
			editor.modal('show');
    	}

		var updateInventory = function()
		{
			if (category == null){
				addNewService();
			}	else{
				updateService();
			}
		}
		
		var addNewService = function()
		{
			category = { name : catSchema.name, avail : 0, total : 0, fields : [] };
			$('.modal-inventory label').each(function(i, o){
				var n = $(o).text();
				var v = $(o).find('input').val();	
				if (v != 0) category.fields.push({ name : n, avail : 0, total : v });
			});
			category.total = 0;
			for (var i = category.fields.length - 1; i >= 0; i--) category.total += parseInt(category.fields[i].total);
			if (category.total == 0){
				editor.modal('hide');
				removeItemFromView(category.name);				
			}	else{
			// update the outside world //	
				ORG_DATA.inv.push(category);			
				postToSockets()
				postToDatabase();
				appendItemToView(category.name);			
			}
		}
		
		var updateService = function()
		{
			$('.modal-inventory label').each(function(i, o){
				var n = $(o).text();
				var v = $(o).find('input').val();
				var f = getOrgFieldData(n);
				if (f){
					if (v != 0){
						f.total = v
					}	else{
						// splice field from category //						
						for (var i = category.fields.length - 1; i >= 0; i--) {
							if (category.fields[i].name == n) category.fields.splice(i, 1);
						};
					}
				}	else {
					if (v != 0){
					// field did not previously exist //	
						category.fields.push({ name : n, avail : 0, total : v });	
					}
				}
			});	
			category.total = 0;
			for (var i = category.fields.length - 1; i >= 0; i--) category.total += parseInt(category.fields[i].total);
			if (category.total == 0){
			//	remove category from org's inventory //
				removeItemFromView(category.name);
				for (var i = ORG_DATA.inv.length - 1; i >= 0; i--) if (ORG_DATA.inv[i].name == category.name) ORG_DATA.inv.splice(i, 1);
			}
		// update the outside world //	
			postToSockets()
			postToDatabase();					
		}
		
		var getOrgFieldData = function(n)
		{
			if (category){
				for (var i = category.fields.length - 1; i >= 0; i--){
					if (category.fields[i].name == n) return category.fields[i]; 
				}
			}
		}
		
		var postToSockets = function()
		{
			socket.emit('bridge-event', ORG_DATA);
		}
	
		var postToDatabase = function(catName)
		{
			$.ajax({
				url: '/inventory',
				type : "POST",
				data : { inv : category },
				success: function(data){
					editor.modal('hide');
				},
				error: function(jqXHR){
					editor.modal('hide');
					console.log('error', jqXHR.responseText+' :: '+jqXHR.statusText);
				}
			});
		}	
		
		var appendItemToView = function(n)
		{
			var img = $("<img src='/img/inv/option-"+n+".png' name='"+n+"' title='"+n+"'/>")
				img.click(openEditor);
			$('#offerings .content').append(img);			
		}	
		
		var removeItemFromView = function(n)
		{
			$('#offerings .content img').each(function(i, o){
				var k = $(o);
				if (k.attr('name') == n) k.remove();
			})
		}

		var editor = $('.modal-inventory');
    		editor.modal({ show : false, keyboard : true, backdrop : true });
			editor.on('shown', function() { $('.modal-inventory input')[0].focus(); });
		$('#categories img').click(openEditor);
		$('.modal-inventory #submit').click(updateInventory);

		// build our offerings list //
		for (var i = ORG_DATA.inv.length - 1; i >= 0; i--) appendItemToView(ORG_DATA.inv[i]['name']);
		
	}
});