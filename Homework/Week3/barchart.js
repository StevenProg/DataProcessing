/*
* Name: Steven Schoenmaker
* Student number: 10777679
* Sources:
* https://bost.ocks.org/mike/bar/3/
* http://bl.ocks.org/Caged/6476579
*/

// sets margins, x and y axis, the number display when hoovering over a bar and
// the svg element, containing height and width
var margin = 50,
    width = 960 - margin * 2,
    height = 500 - margin * 2;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom");

var yAxis = d3.svg.axis()
  .scale(y)
  .orient("left")

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return " <span style='color:green'>" + d.Temp +"<strong>&#176;C</strong></span>";
  })

var svg = d3.select("body").append("svg")
    .attr("width", width + margin * 2)
    .attr("height", height + margin * 2)
  .append("g")
    .attr("transform", "translate(" + margin + "," + margin + ")");

svg.call(tip);

// loads dataset and iterates over it
d3.json("temps.json", function(error, data) {
  if (error) console.log("Error with data.");

  data.forEach(function(d) {
    d.Temp = +d.Temp;
  });

  // divides x and y axis
  x.domain(data.map(function(d) {return d.Date;}));
  y.domain([0, d3.max(data, function(d) {return d.Temp;})]);

  // creates x axis and x-labels
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .append("text")
      .attr("transform", "translate(0," + 0.1 * height + ")")
      .attr("x", width / 2)
      .attr("font-size", "18px")
      .text("Year");

  // creates y axis and y-labels
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -30)
      .style("text-anchor", "end")
      .attr("font-size", "18px")
      .text("Temperature (degrees C)");

  // creates bars and sets mouse hoovering effects
  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.Date); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.Temp); })
      .attr("height", function(d) { return height - y(d.Temp); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
});
  