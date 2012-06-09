
// data that will eventually come in from db //
var invModel = [
	{name : 'beds', fields : ['male', 'female', 'family', 'veteran']},
	{name : 'showers', fields : ['male', 'female']},
	{name : 'meals', fields : ['breakfast', 'lunch', 'dinner']},	
]

$(document).ready(function(){
	
	window.InventoryController = new function(){

		var orgData, locData; 

		var buildInventoryView = function()
		{
			for (var i = invModel.length - 1; i >= 0; i--){
				var n = invModel[i]['name'];
				var img = $("<img src='/img/inv/option-"+n+".png' name='"+n+"' title='"+n+"'/>")
					img.click(openEditor);
				$('#offerings .content').append(img);
			};
		}
		
		var openEditor = function(e)
		{
			var n = e.target.name;
			for (var i = invModel.length - 1; i >= 0; i--) {
				if (n == invModel[i]['name']) {
					locData = invModel[i]; break;
				}
			}
			var orgHasCategory = false;
			for (var i = ORG_DATA.inv.length - 1; i >= 0; i--){
				if (n == ORG_DATA.inv[i]['name']){
					orgHasCategory = true;
					orgData = ORG_DATA.inv[i]; break;
				}
			};
			if (!orgHasCategory) { orgData = { name : n, fields : [] }; ORG_DATA.inv.push(orgData); }
			$('.modal-inventory fieldset').empty();
			$('.modal-inventory h3').text(capitalize(locData.name));
			for (var i=0; i < locData.fields.length; i++) {
				var val = orgData.fields[i] ? orgData.fields[i].total : 0;
				var opt = '<label>'+locData.fields[i];
					opt+= '<input class="input.input-xlarge", type="text", value="'+val+'", onkeydown="restrictInputFieldToNumbers(event)" />';
					opt+="</label>";
				$('.modal-inventory fieldset').append(opt);
			};
			editor.modal('show');
    	}

		var updateInventory = function()
		{
			$('.modal-inventory label').each(function(i, o){
				var fieldExists = false;				
				for (var i = orgData.fields.length - 1; i >= 0; i--){
					if (orgData.fields[i].name == $(o).text()){
						fieldExists = true;
						orgData.fields[i].total = $(o).find('input').val(); break;
					}
				};
			// add the new field to the locData array //	
				if (!fieldExists) orgData.fields.push({name : $(o).text(), avail : 0, total : $(o).find('input').val()});
			});
			$.ajax({
				url: '/inventory',
				type : "POST",
				data : {inv : orgData},
				success: function(data){
					editor.modal('hide');
				},
				error: function(jqXHR){
					editor.modal('hide');
					console.log('error', jqXHR.responseText+' :: '+jqXHR.statusText);
				}
			});
		}

		var editor = $('.modal-inventory');
    		editor.modal({ show : false, keyboard : true, backdrop : true });
			editor.on('shown', function() { $('.modal-inventory input')[0].focus(); });
		$('#categories img').click(openEditor);
		$('.modal-inventory #submit').click(updateInventory);

		buildInventoryView();
		
	}
});