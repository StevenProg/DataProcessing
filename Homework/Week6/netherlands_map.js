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
var previousProvince = [];
var clickedProvince = ["Overijssel"];
var projection = d3.geo.mercator()
    .scale(1)
    .translate([0, 0]);
var path = d3.geo.path()
    .projection(projection);
var clicked = 0;
// create d3 tooltip to show on mouseover 
var mapTip = d3.tip()
    .attr("class", "tip")
    .attr("id", "mapTip")
    .offset([-10, 0])
    .html(function(currentProvince, hoursOfSun) {
        return "<text style='color:red'>"+ currentProvince +":</text><div><text>" + hoursOfSun + " zon uren</text></div>"});

// draws map of the netherlands including legend and year number 

function mapGraph(dataMap, dataTopo, dataLines) {

    function makeTitle() {
        d3.select('.map').select('g')
            .append('text')
            .attr('class', 'mapTitle')
            .text('Average, maximum and minimum sunhours measured per province in the Netherlands in 1996')
            .attr('text-anchor', 'middle')
            .attr('x', widthMap / 2 + 100)
            .attr('y', (heightMap / 2) - 355)
            .attr("font-size", "20px")
    };
    var map = d3.select(".map")
        .append("g")
        .attr("width", 1000)
        .attr("height", 500);

    // enable scatterplot dots to be colored
    var color = d3.scale.category10();

    var l = topojson.feature(dataTopo, dataTopo.objects.subunits).features[3],
        b = path.bounds(l),
        s = .2 / Math.max((b[1][0] - b[0][0]) / widthMap, (b[1][1] - b[0][1]) / heightMap),
        t = [-300, 6405];

    makeTitle();

    projection.scale(s)
        .translate(t);
    nld_topo = map.selectAll("path")
        .data(topojson.feature(dataTopo, dataTopo.objects.subunits).features).enter()
        .append("path")
        .attr("class", function(d, i) { return d.properties.name})
        .attr("sunHours", function(d, i)  {if (i > 0 && i !=5 && i !=6 && i != 7 ) { return (dataMap[1996][d.properties.name]["hoursOfSun"] )}})
        .attr("d", path)
        .style("stroke", "black")
        .style("fill", "green")
        .attr("fill-opacity", function(d, i) {if (i > 0 && i !=5 && i !=6 && i != 7 ) { return (dataMap[1996][d.properties.name]["hoursOfSun"] - 1000) / 581}})
        .attr("stroke-width", "1px")
        // create mouse events 
        .call(mapTip)
        .on("mouseover", drawTooltip)
        .on("mouseout", removeTooltip)
        .on("click", onClick);
        function drawTooltip() {
            var currentProvince = d3.select(this).attr("class");
            var hoursOfSun = d3.select(this).attr("sunHours");
            mapTip.show(currentProvince, hoursOfSun);
            d3.select(this)
                .style("fill", "crimson")
        };
        function removeTooltip() {
            mapTip.hide()
            d3.select(this)
                .style("fill", "green");
        }

        function onClick() {
            var currentProvince = d3.select(this).attr("class");
            var newProvince = 0;
            // prevent double date and data formatting
            if (clickedProvince.includes(currentProvince) == false) {
                    clickedProvince.push(currentProvince);
                    newProvince = 1;
            };	

            // select the part we want to apply our changes to
            if (clicked == 0) {
                map.selectAll("path").style("fill", "green").style("stroke", "none");
                d3.select(this)
                    .style("stroke", "yellow")
                    .style("stroke-width", "5px")
                    .style("fill", "crimson");
                updateGraph(dataLines, currentProvince, newProvince);
                clicked = 1;
            }

            else if (currentProvince == previousProvince) {
                map.selectAll("path")
                .style("stroke", "black")
                .style("fill", "green")
                .style("stroke-width", "1px")
                clicked = 0;
            }

            else {
                map.selectAll("path").style("fill", "green").style("stroke", "none");
                d3.select(this)
                    .style("stroke", "yellow")
                    .style("stroke-width", "5px")
                    .style("fill", "crimson");
                updateGraph(dataLines, currentProvince, newProvince);
                clicked = 1;
            }
            previousProvince = currentProvince;
        }

        
        var color = d3.scale.quantile()
            .domain([400, 640, 800, 960, 1120, 1280, 1440]);

        var legend = map.selectAll(".legend")
            .data(color.domain())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { 
                return "translate(0," + i * 23 + ")"; 
            });

        // add legend colors and interactivity
        legend.append("rect")
            .attr("data-name", function(d) {return d})
            .attr("x", widthMap -30)
            .attr("y", heightMap -495)
            .attr("width", 25)
            .attr("height", 20)
            .style("fill", "green")
            .attr("fill-opacity", function(d, i) {return (0.4 + 0.1 * i)});


        // add labels
        legend.append("text")
            .attr("class", "legendLabel")
            .attr("data-name", function(d) {return d})
            .attr("x", widthMap +5)
            .attr("y", heightMap -490)
            .attr("dy", ".35em")
            .style("fill", "#717A89")
            .style("text-anchor", "start")
            .text(function(d) {
                if (d == 400){
                    return "up to 1120 hours";
                }   
                else if (d == 640){
                    return "1180 to 1240 hours";
                }
                else if (d == 800){
                    return "1300 to 1360 hours";
                }
                else if (d == 960){
                    return "1360 to 1420 hours";
                }
                else if (d == 1120){
                    return "1420 to 1480 hours";
                }
                else if (d == 1280){
                    return "1480 to 1540 hours";
                }
                else if (d == 1440){
                    return "1540 to 1600 hours";
                }
            });

        // legend title
        map.append("text")
            .attr("class", "legend-title")
            .attr("x", widthMap -30)
            .attr("y", heightMap - 500)
            .style("fill", "#5e6572")
            .text("Amount of sun hours");
};
