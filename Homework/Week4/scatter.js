/*
Steven Schoenmaker 10777679
Source
- https://bl.ocks.org/mbostock/3887118
*/

window.onload = function(){

    // set height, width and margin
    var margin = 100,
        width = 1100 - margin * 2,
        height = 650 - margin * 2;

    // x-axis range (linear range)
    var x = d3.scale.linear()
        .range([0, width]);

    // y-axis range (log range)
    var y = d3.scale.log()
        .base(10)
        .range([height, 0]);

    // enable dots to be coloured
    var colour = d3.scale.category10();

    // x-axis orientation
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    // y-axis orientation and set log scale ticks
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(2);

        
    // tip functionality
    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            return "<strong>Country: </strong>" + d.Country + "</span>" + "<br>" +
            "<strong>GDP/Capita: </strong>" + "$" + d.GDPCapita + "</span>" + "<br>" +
            "<strong>AverageLifeExpectancy: </strong>" + d.AverageLifeExpectancy + "</span>" + "<br>" +
            "<strong>Population: </strong>" + d.Population + "</span>";
    });


    // append svg to html body
    var svg = d3.select(".chart").append("svg")
        .attr("width", width + margin * 2)
        .attr("height", height + margin * 2)
    .append("g")
        .attr("transform", "translate(" + margin + "," + margin + ")");

    // call tips, so that they appear when mouse hovers over the bar
    svg.call(tip);

    // get the data for the chart and check if it works
    d3.json("happyData.json", function(error, data) {
        if(error) throw error;

        // convert data from string (as in json) to integer (for display purposes)
        data.forEach(function(d) {
            d.Population = +d.Population;
            d.AverageLifeExpectancy = +d.AverageLifeExpectancy;
            d.GDPCapita = +d.GDPCapita;
    });

    // scale dots based on data
    var rscale = d3.scale.linear()
        .domain(d3.extent(data, function(d) { return d.Population; })).nice()
        .range([5,20]);

    // set axes division
    x.domain(d3.extent(data, function(d) { return d.AverageLifeExpectancy; })).nice();
    y.domain(d3.extent(data, function(d) { return d.GDPCapita; })).nice();

    // create x-axis and title
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", 50)
        .style("text-anchor", "end")
        .text("Average Life Expectancy");

    // create y-axis and title
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", -80)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("GDP per Capita ($)");
    
    // create graph title
    svg.append("g")
        .attr("class", "title")
        .append("text")
        .attr("x", (width + margin * 2) * .032)
        .attr("y", - margin / 1.7)
        .attr("dx", ".71em")
        .attr("font-size", "20px")
        .style("text-anchor", "begin")
        .text("Life expentancy and log GDP related to region and population size per country (years)");  

    // create dots
    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", function(d) { return "dot " + d.Region.replace(/\s/g, ''); })
        .attr("r", function(d) { return rscale(d.Population); })
        .attr("cx", function(d) { return x(d.AverageLifeExpectancy); })
        .attr("cy", function(d) { return y(d.GDPCapita); })
        .style("fill", function(d) { return colour(d.Region); })

        // tip-on-hovering functionality
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

    // create legend
    var legend = svg.selectAll(".legend")
        .data(colour.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(" + (width + margin - 15) + "," + i * 25 + ")"; })


    // legend coloured rectangles
    legend.append("rect")
        .attr("class", function(d) { return "dot " + d.replace(/\s/g, ''); })
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", colour);

    // legend text
    legend.append("text")
        .attr("x", -5)
        .attr("y", 8)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function (d) { return d; });
    });
}