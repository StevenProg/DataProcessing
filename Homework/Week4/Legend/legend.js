/*
Steven Schoenmaker 10777679
Source
*/
window.onload = function(){
    var data = [{"colour":"#ffffb2", "text":"A"},{"colour":"#fecc5c", "text":"B"},{"colour":"#fd8d3c", "text":"C"},{"colour":"#f03b20", "text":"D"},{"colour":"#bd0026", "text":"E"},{"colour":"grey", "text":"Missing Letter"}];

    var svg = d3.select("body")
                .append("svg")
                .attr("width", 500)
                .attr("height", 500);

    var rect = svg.selectAll("rect")
                .data(data)
                .enter()
                .append("rect");

    var rectAttributes = rect
                .attr("width", 50)
                .attr("height", 50)
                .attr("stroke", "black")
                .attr("x", 5)
                .attr("y", function(d,i) {return(i * 70)})
                .attr("fill", function(d,i) {return(d.colour)});

    var text = svg.selectAll("text")
                .data(data)
                .enter()
                .append("text");

    var textAttributes = text
                .attr("font-size", "30px")
                .attr("font-family", "sans-serif")
                .attr("x", 100)
                .attr("fill", "black")
                .attr("y", function(d,i) {return(i * 70 + 45)})
                .text(function(d,i) {return(d.text)});
}