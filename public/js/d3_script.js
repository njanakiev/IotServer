function drawUnnumberedList(data) {
	"use strict";
	// Clear ul
	d3.select("ul").remove();

	d3.select("body")
		.append("ul")
		.selectAll("li")
		.data(data)
		.enter()
		.append("li")
		.text(function (d) {
			return d.type + ": " + d.values[0];
		});
}

function drawSimpleSvg(data) {
	"use strict";
	var margin = 50,
		width = 1000,
		height = 400;

	// Clear svg
	d3.select("svg").remove();

	// Scaling
	var time_extent = d3.extent(data, function(d){return d.timestamp});
	var time_scale = d3.scale.linear()
						.range([margin, width-margin])
						.domain(time_extent);
	var extent = d3.extent(data, function(d){return d.values[0]});
	var scale = d3.scale.linear()
					.range([height-margin, margin])
					.domain(extent);

	// Initialization
	d3.select("body")
		.append("svg")
		.attr("width", width)
		.attr("height", height)
		.attr("class", "chart");

	// Axis
	var time_axis = d3.svg.axis()
		.scale(time_scale);
	d3.select("svg")
		.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + (height-margin) + ")")
		.call(time_axis);

	var count_axis = d3.svg.axis()
		.scale(scale)
		.orient("left");
	d3.select("svg")
		.append("g")
		.attr("class", "y axis")
		.attr("transform", "translate(" + margin + ",0)")
		.call(count_axis);

	// Draw Graph
	var axisLabel = ["x", "y", "z"];
	for (var i = 0; i < 3; i++) {
		// Mapping
		extent = d3.extent(data, function(d){return d.values[i]});
		scale = d3.scale.linear()
						.range([height-margin, margin])
						.domain(extent);

		// Adding circles
		d3.select("svg")
			.selectAll("circle." + axisLabel[i])
			.data(data)
			.enter()
			.append("circle")
			.attr("class", axisLabel[i])

		// Draw circles
		d3.selectAll("circle." + axisLabel[i])
			.attr("cx", function(d){return time_scale(d.timestamp)})
			.attr("cy", function(d){return scale(d.values[i])})
			.attr("r", 3);

		// Path
		var line = d3.svg.line()
			.x(function(d){return time_scale(d.timestamp)})
			.y(function(d){return scale(d.values[i])});
		d3.select("svg")
			.append("path")
			.attr("d", line(data))
			.attr("class", axisLabel[i]);
	};
	
				
}

setInterval(function() {
	var host = "http://localhost:3000/api/data/accelerometer?elements=30";
	//d3.json(host, drawUnnumberedList);
	d3.json(host, drawSimpleSvg);
}, 10);