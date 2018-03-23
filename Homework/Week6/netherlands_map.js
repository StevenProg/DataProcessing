/*
Steven Schoenmaker 10777679
Sources
- https://bl.ocks.org/larsenmtl/e3b8b7c2ca4787f77d78f58d41c3da91
- https://bl.ocks.org/mbostock/3884955
- https://bl.ocks.org/mbostock/3883245
- http://bl.ocks.org/jhubley/17aa30fd98eb0cc7072f
- https://github.com/markmarkoh/datamaps/blob/master/README.md#using-custom-maps
*/

var nld_topo;
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
        return "<text style='color:red'>"+ currentProvince +":</text><div><text>" + hoursOfSun + " hours of sun</text></div>"});

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
    // sets maps element
    var map = d3.select(".map")
        .append("g")
        .attr("width", 1000)
        .attr("height", 500);

    // enable provinces to be colored
    var color = d3.scale.category10();

    // sets parameters to set json topo data in map element
    var l = topojson.feature(dataTopo, dataTopo.objects.subunits).features[3],
        b = path.bounds(l),
        s = .2 / Math.max((b[1][0] - b[0][0]) / widthMap, (b[1][1] - b[0][1]) / heightMap),
        t = [-325, 6405];

    makeTitle();

    // create the map of the netherlands 
    projection.scale(s)
        .translate(t);
    nld_topo = map.selectAll("path")
        .data(topojson.feature(dataTopo, dataTopo.objects.subunits).features).enter()
        .append("path")
        .attr("class", function(d, i) { return d.properties.name})
        // only provinces of the Netherlands, not all parts (St Eustatius, Bonaire..)
        .attr("sunHours", function(d, i)  {if (i > 0 && i !=5 && i !=6 && i != 7 ) { 
            return (dataMap[currentYear][d.properties.name]["hoursOfSun"] )}})
        .attr("d", path)
        .style("stroke", "black")
        .style("fill", "green")
        // sets opacity, use a scale between 751 and 0 (instead of 1751 and 0)
        .attr("fill-opacity", function(d, i) {if (i > 0 && i !=5 && i !=6 && i != 7 ) { 
            return (dataMap[currentYear][d.properties.name]["hoursOfSun"] - 1000) / 751}})
        .attr("stroke-width", "1px")
        // create mouse events 
        .call(mapTip)
        .on("mouseover", drawTooltip)
        .on("mouseout", removeTooltip)
        .on("click", onClick);
        // hoover over function, shows province name and hours of sun
        function drawTooltip() {
            currentProvince = d3.select(this).attr("class");
            hoursOfSun = d3.select(this).attr("sunHours");
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
            currentProvinceClick = d3.select(this).attr("class");
            var newProvince = 0;
            // prevent double date and data formatting
            if (clickedProvince.includes(currentProvinceClick) == false) {
                    clickedProvince.push(currentProvinceClick);
                    newProvince = 1;
            };	

            // colours the clicked crimson and gives them a yellow edge, update the multiline
            if (clicked == 0) {
                map.selectAll("path").style("fill", "green").style("stroke", "none");
                d3.select(this)
                    .style("stroke", "yellow")
                    .style("stroke-width", "5px")
                    .style("fill", "crimson");
                updateGraph(dataLines[1996], currentProvinceClick, newProvince);
                clicked = 1;
            }

            // if the same province is clicked again, remove yellow lines
            else if (currentProvinceClick == previousProvince) {
                map.selectAll("path")
                .style("stroke", "black")
                .style("fill", "green")
                .style("stroke-width", "1px")
                clicked = 0;
            }

            // if a different province is clicked, with yellow lines being active, change them to the clicked province
            else {
                map.selectAll("path").style("fill", "green").style("stroke", "none");
                d3.select(this)
                    .style("stroke", "yellow")
                    .style("stroke-width", "5px")
                    .style("fill", "crimson");
                updateGraph(dataLines[1996], currentProvinceClick, newProvince);
                clicked = 1;
            }
            previousProvince = currentProvinceClick;
        }

        // allows the legend to be coloured
        var color = d3.scale.quantile()
            .domain([1300, 1375, 1450, 1525, 1600, 1675, 1750]);

        var legend = map.selectAll(".legend")
            .data(color.domain())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { 
                return "translate(0," + i * 23 + ")"; 
            });

        // add legend colors 
        legend.append("rect")
            .attr("data-name", function(d) {return d})
            .attr("x", widthMap -250)
            .attr("y", heightMap -650)
            .attr("width", 25)
            .attr("height", 20)
            .style("fill", "green")
            .attr("fill-opacity", function(d, i) {return (0.4 + 0.1 * i)});


        // add labels
        legend.append("text")
            .attr("class", "legendLabel")
            .attr("data-name", function(d) {return d})
            .attr("x", widthMap -200)
            .attr("y", heightMap -643)
            .attr("dy", ".35em")
            .style("fill", "#717A89")
            .style("text-anchor", "start")
            .text(function(d) {
                if (d == 1300){
                    return "up to 1300 hours";
                }   
                else if (d == 1375){
                    return "1300 to 1375 hours";
                }
                else if (d == 1450){
                    return "1375 to 1450 hours";
                }
                else if (d == 1525){
                    return "1450 to 1525 hours";
                }
                else if (d == 1600){
                    return "1525 to 1600 hours";
                }
                else if (d == 1675){
                    return "1600 to 1675 hours";
                }
                else if (d == 1750){
                    return "1675 to 1750 hours";
                }
            });

        // legend title
        map.append("text")
            .attr("class", "legend-title")
            .attr("x", widthMap -250)
            .attr("y", heightMap -660)
            .style("fill", "#5e6572")
            .text("Amount of sun hours");
};
// updates map colors and year number
function updateMap(dataMap, currentYear) {

    nld_topo.attr("fill-opacity", function(d, i) {
            if (i > 0 && i !=5 && i !=6 && i != 7 ) {
            return (dataMap[currentYear][d.properties.name]["hoursOfSun"] - 1000) / 751}})
        .attr("sunHours", function(d, i)  {
            if (i > 0 && i !=5 && i !=6 && i != 7 ) { 
            return (dataMap[currentYear][d.properties.name]["hoursOfSun"] )}})

    d3.select(".mapTitle").text('Average, maximum and minimum sunhours measured per province in the Netherlands in ' + currentYear);

};