/*
Steven Schoenmaker 10777679
Sources
- https://bl.ocks.org/larsenmtl/e3b8b7c2ca4787f77d78f58d41c3da91
- https://bl.ocks.org/mbostock/3884955
- https://bl.ocks.org/mbostock/3883245
- http://bl.ocks.org/jhubley/17aa30fd98eb0cc7072f
*/

var parseDate = d3.time.format("%Y%m%d").parse;
var bisectDate = d3.bisector(function(d) { return d.Date; }).left;
var colour = ['#FF8C00', '#32CD32', '#6495ED'];
var margin = 50;
var width = 1000 - margin * 2;
var height = 600 - margin * 2;
var g;

var xAxis = d3.time.scale()
    .range([0, width]);

var yAxis = d3.scale.linear()
    .range([height, 0]);

// x-axis orientation
var xAxisOri = d3.svg.axis()
  .scale(xAxis)
  .orient("bottom")
  .tickFormat(d3.time.format("%B"));

// y-axis orientation
var yAxisOri = d3.svg.axis()
  .scale(yAxis)
  .orient("left");

// creates line element
var line = d3.svg.line().interpolate("basis")
    .x(function(d) {
    return xAxis(d.Date);
    })
    .y(function(d) {
    return yAxis(d.Temperature);
	});
    
function linesGraph(data) {    
    // makeMenu(data);
	drawInitialLines(data);
}


// updates the graph after new dataset has been chosen
function updateGraph(data, province, newProvince) {
	var datasets = data[province];
	var lines = d3.select(".lines")
	// prevent double date and data formatting
	if (newProvince == 1) { 
		changeValues(datasets);
	}
	// select the part we want to apply our changes to
	for (var set in datasets) {
		lines.selectAll('.line.' + set)
			.attr('d', line(datasets[set]));
	};
	// update title for new province
	makeTitle(province, currentYear)
	};


// builds the initial multichart

function drawInitialLines(data) {

	// draw first graph with first province in data
	var firstProvince = Object.keys(data)[0],
		datasets = data[firstProvince];

	// get sets for the legend
	var sets = [];
        for (var set in datasets) {
            sets.push(set);
        };
	// change data to correct type
	changeValues(datasets);

	// scale all datasets to fit in graph area
	xAxis.domain(d3.extent(datasets['Minimum'], function(d) { 
		return d.Date; 
	})).nice();

	// sets the range for the highest and lowest temperature
	yAxis.domain([
		d3.min(datasets['Minimum'], function(data) { return data.Temperature; }),
		d3.max(datasets['Maximum'], function(data) { return data.Temperature; })
	]).nice();

	var lines = d3.select(".lines")
        .append("g")
        .attr("width", width + margin * 2)
        .attr("height", height + margin * 2)
		.attr("transform", "translate(" + margin + "," + margin + ")");
		
	// draw the axis
    // create x-axis and title
    lines.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxisOri)
        .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", 45)
        .style("text-anchor", "end")
        .text("Date in months");

    // create y-axis and title
    lines.append("g")
        .attr("class", "y axis")
        .call(yAxisOri)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Temperature in degrees C");

	// draw the graph lines
	var i = 0;
	for (var set in datasets) {
		lines.append('path')
			.datum(datasets[set])
			.attr('class', 'line ' + set)
			.attr('fill', 'none')
			.attr('stroke', colour[i])
			.attr('stroke-linejoin', 'round')
			.attr('stroke-linecap', 'round')
			.attr('stroke-width', 1.5)
			.attr('d', line);
		i++;
	};
	makeTitle(firstProvince, currentYear);

    var legend = lines.selectAll(".legend")
		.data(sets)
		.enter().append("g")
		.attr("class", "legend")
		.attr("transform", function(d, i) { return "translate(" + (width + margin - 15) + "," + i * 25 + ")"; })


    // legend coloured rectangles
    legend.append("rect")
        .attr("class", function(d) { return "dot " + d.replace(/\s/g, ''); })
        .attr("width", 18)
        .attr("height", 18)
        .style('fill', function(d, i) { return colour[i]; });
        
    // legend text
    legend.append("text")
        .attr("x", -5)
        .attr("y", 8)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function (d) { return d; });

	var mouseG = lines.append("g")
		.attr("class", "mouse-over-effects");

 	// this is the black vertical line to follow mouse
	mouseG.append("path")
		.attr("class", "mouse-line")
		.style("stroke", "black")
		.style("stroke-width", "1px")
		.style("opacity", "0");
		
	var lines = document.getElementsByClassName('line');

	var mousePerLine = mouseG.selectAll('.mouse-per-line')
		.data(function(d, i) { return colour;})
		.enter()
		.append("g")
		.attr("class", "mouse-per-line");

	// sets the circle for each line
	mousePerLine.append("circle")
		.attr("r", 6)
		.style("stroke", function(d, i) {
			return colour[i]})
		.style("fill", "none")
		.style("stroke-width", "2.5px")
		.style("opacity", "0");

	mousePerLine.append("text")
		.attr("transform", "translate(10,3)")
		.style("stroke-width", "2.5px")
		.style("font-weight", "bold")

	// append a rect to catch mouse movements on canvas
	mouseG.append('svg:rect') 
		.attr('width', width) 
		.attr('height', height)
		.attr('fill', 'none')
		.attr('pointer-events', 'all')
		.on('mouseout', function() {
			d3.select(".mouse-line")
			.style("opacity", "0");
			d3.selectAll(".mouse-per-line circle")
			.style("opacity", "0");
			d3.selectAll(".mouse-per-line text")
			.style("opacity", "0");
		})

		// on mouse in show line, circles and text
		.on('mouseover', function() { 
			d3.select(".mouse-line")
			.style("opacity", "1");
			d3.selectAll(".mouse-per-line circle")
			.style("opacity", "1");
			d3.selectAll(".mouse-per-line text")
			.style("opacity", "1");
		})

		// mouse moving over canvas
		.on('mousemove', function() { 
			var mouse = d3.mouse(this);
			d3.select(".mouse-line")
			.attr("d", function() {
				var d = "M" + mouse[0] + "," + height;
				d += " " + mouse[0] + "," + 0;
				return d;
			});

		d3.selectAll(".mouse-per-line")
            .attr("transform", function(d, i) {
			var xDate = xAxis.invert(mouse[0])
			var bisect = d3.bisector(function(d) { return d.Date; }).right;
			var idx = bisect(i, xDate);
			var beginning = 0;
			var end = lines[i].getTotalLength();
			var target = null;
			var pos = null;

			// I do understand how the loop works now (after a verrryy long time), yet I still did not manage to rewrite it
			// or to change the 'true' condition into the break conditions. Very very frustrated because of this right now.
			while (true){
				target = Math.floor((beginning + end) / 2);
				pos = lines[i].getPointAtLength(target);
				if ((target === end || target === beginning) && pos.x !== mouse[0]) {
					break;
				}
				if (pos.x > mouse[0])      end = target;
				else if (pos.x < mouse[0]) beginning = target;
				else break; //position found
				}

			d3.select(this).select('text')
				.text(yAxis.invert(pos.y).toFixed(2));
			
			return "translate(" + mouse[0] + "," + pos.y +")";
		});
	});
};


// changes data to correct types
function changeValues(d) {
	for (var set in d) {
		d[set].forEach(function(d) {
			d.Date = parseDate(d.Date);
			d.Temperature = (+ d.Temperature) / 10;
		});
	};
};

function makeTitle(s, y) {
	
	// remove previous title
	d3.selectAll('.title').remove();

	d3.select('.lines').select('g')
		.append('text')
		.attr('class', 'title')
		.text('Average, maximum and minimum temperature measured in ' + s + ' in 1996')
		.attr('text-anchor', 'middle')
		.attr('x', width / 2)
		.attr('y', (margin / 2) - 20)
		.attr("font-size", "20px")
};

