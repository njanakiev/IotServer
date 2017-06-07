$(document).ready(function() {

	// Update in fixed intervals
	setInterval(function() {
	
	console.log('Reading data...');
	var tableContent = '';
	
	$.getJSON('/api/data/accelerometer?elements=10', function(data) {
		$.each(data, function() {
			tableContent += '<tr>';
			tableContent += '<td>' + this.type + '</td>';
	    	tableContent += '<td>' + this.timestamp + '</td>';
	    	tableContent += '<td>' + this.values + '</td>';
	    	tableContent += '</tr>';
		});

		$('.json-table').html(tableContent);
	});
	}, 1000);
});