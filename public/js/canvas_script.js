function map (value, start1, stop1, start2, stop2) {
    return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}
function canvasSupport () {
	return !!document.createElement('canvas').getContext;
}

var canvas;
var context;

$(document).ready(function() {
	if (!canvasSupport()) { return; }
	canvas = document.getElementById("canvas");
	context = canvas.getContext("2d");
	console.log("Drawing Canvas");

	setInterval(function() {
		$.getJSON('/api/data/accelerometer?elements=50', function(data) {
			drawGraphs(data);
		});
	}, 100);
});

function drawGraphs(data) {
	
	if(data.length <= 0) return;

	context.clearRect(0, 0, canvas.width, canvas.height);
	var graphColors = ["red", "blue", "green"];
	for (var axis_idx = 0; axis_idx < 3; axis_idx++) {
		
		// Minimum and maximum search 
		var min = {"x":data[0].timestamp, "y":-40};
		var max = {"x":data[0].timestamp, "y": 40};
		for (var i = 0; i < data.length; i++) {
			//if(data[i].values[axis_idx] < min.y) min.y = data[i].values[axis_idx];
			//if(data[i].values[axis_idx] > max.y) max.y = data[i].values[axis_idx];
			if(data[i].timestamp < min.x) min.x = data[i].timestamp;
			if(data[i].timestamp > max.x) max.x = data[i].timestamp;
		};

		// Draw path
		context.beginPath();
		context.lineWidth = 1;
		context.strokeStyle = graphColors[axis_idx];
		var x = map(data[0].timestamp, min.x, max.x, 0, canvas.width);
		var y = map(data[0].values[axis_idx], min.y, max.y, 0, canvas.height);
		context.moveTo(x, y);
		for (var i = 1; i < data.length; i++) {
			var x = map(data[i].timestamp, min.x, max.x, 0, canvas.width);
			var y = map(data[i].values[axis_idx], min.y, max.y, 0, canvas.height);
			context.lineTo(x, y);
		};
		context.stroke();
		context.closePath();
	}
}