/*
Steven Schoenmaker 10777679
Sources
- https://bl.ocks.org/larsenmtl/e3b8b7c2ca4787f77d78f58d41c3da91
- https://bl.ocks.org/mbostock/3884955
- https://bl.ocks.org/mbostock/3883245
- http://bl.ocks.org/jhubley/17aa30fd98eb0cc7072f
- maps referentie
*/
var nld_topo;
var currentProvince;
var projection = d3.geo.mercator()
    .scale(1)
    .translate([0, 0]);

var path = d3.geo.path()
    .projection(projection);

// create d3 tooltip to show on mouseover 
var mapTip = d3.tip(name)
    .attr("class", "tip")
    .attr("id", "mapTip")
    .offset([-10, 0])
    .html("<span style='color:midnightblue'>" + "</span>") // + name nog



// draws map of the netherlands including legend and year number 

function mapGraph() {

    d3.json("data/nld.topo.json", function(error, data) {
        if (error) {
            alert("Could not load data!");
            throw error;
        }

    var map = d3.select(".map")
        .append("g")
        .attr("width", 1000)
        .attr("height", heightMap);

    var l = topojson.feature(data, data.objects.subunits).features[3],
        b = path.bounds(l),
        s = .2 / Math.max((b[1][0] - b[0][0]) / widthMap, (b[1][1] - b[0][1]) / heightMap),
        t = [-300, 6400];

    projection.scale(s)
        .translate(t);

    nld_topo = map.selectAll("path")
        .data(topojson.feature(data, data.objects.subunits).features).enter()
        .append("path")
        .attr("class", function(d, i) { return d.properties.name; })
        .attr("d", path)
        .style("stroke", "black")
        .style("fill", "green")
        .attr("stroke-width", "0.8px")
        // create mouse events 
        .call(mapTip)
        .on("mouseover", drawTooltip)
        .on("mouseout", removeTooltip);
        // .on("click", onClick);
        
        function drawTooltip() {
            var currentProvince = d3.select(this).attr("class");
            mapTip.show(currentProvince)
            d3.select(this)
                .style("fill", "crimson")
        }
        function removeTooltip() {
            mapTip.hide()
            d3.select(this)
            .style("fill", "green");
        }

        function onClick() {
            // d3.select(this).attr("class"); // invulling om te switchen naar ander station
            // updateGraph();
        }
    });

};


