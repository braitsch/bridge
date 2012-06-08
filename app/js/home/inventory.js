
// data that will eventually come in from db //
var invModel = [
	{name : 'beds', opts : ['male', 'female', 'family', 'veteran']},
	{name : 'showers', opts : ['male', 'female']},
	{name : 'meals', opts : ['breakfast', 'lunch', 'dinner']},	
]

$(document).ready(function(){
	
	window.InventoryController = new function(){

		var category;

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
			for (var i = invModel.length - 1; i >= 0; i--) {
				if (e.target.name == invModel[i]['name']) { category = invModel[i]; break; }
			}
			$('.modal-inventory fieldset').empty();
			$('.modal-inventory h3').text(capitalize(category.name));
			for (var i=0; i < category.opts.length; i++) {
				var opt = '<label>'+category.opts[i];
					opt+= '<input class="input.input-xlarge", type="text", onkeydown="restrictInputFieldToNumbers(event)" />';
					opt+="</label>";
				$('.modal-inventory fieldset').append(opt);
			};
			editor.modal('show');
    	}

		var sendInventory = function()
		{
			var data = { org : 'test', inv : { name : category.name, vals : [] } };
			$('.modal-inventory label').each(function(i, o){
				data.inv.vals.push({name : $(o).text(), total : $(o).find('input').val()});
			});
			$.ajax({
				url: '/inventory/update',
				type : "POST",
				data : data,
				success: function(data){
					console.log('ok');
				},
				error: function(jqXHR){
					console.log('error', jqXHR.responseText+' :: '+jqXHR.statusText);
				}
			});
		}
		
		var editor = $('.modal-inventory');
    		editor.modal({ show : false, keyboard : true, backdrop : true });
			editor.on('shown', function() { $('.modal-inventory input')[0].focus(); });
		$('#categories img').click(openEditor);
		$('.modal-inventory #submit').click(sendInventory);

		buildInventoryView();
		
	}
});