/*
Steven Schoenmaker 10777679
Sources
- https://bl.ocks.org/larsenmtl/e3b8b7c2ca4787f77d78f58d41c3da91
- https://bl.ocks.org/mbostock/3884955
- https://bl.ocks.org/mbostock/3883245
- http://bl.ocks.org/jhubley/17aa30fd98eb0cc7072f
*/

var marginMap = {top: 20, right: 20, bottom: 40, left: 20};
var widthMap = 700 - marginMap.left - marginMap.right;
var heightMap = 800 - marginMap.top - marginMap.bottom;

var margin = 50;
var map; 
var width = 1000 - margin * 2;
var height = 600 - margin * 2;
var previousViews = [];
var g;
var data = {};
var currentYear = 1996;
var dataMapGlob;
var dataTopoGlob;
var dataLinesGlob;

// loads the 3 used json files
window.onload = function() {
    queue()
        .defer(d3.json, 'data/nld.data.json')
        .defer(d3.json, "data/nld.topo.json")
        .defer(d3.json, 'data/temp.data.json')
        .await(mainExecute);   
};

function mainExecute(error, dataMap, dataTopo, dataLines) {
    if (error) {
        alert("Could not load data!");
        throw error;
    }
    // sets json input as variables
    dataMapGlob = dataMap;
    dataLinesGlob = dataLines;
    dataTopoGlob = dataTopo;

    mapGraph(dataMap, dataTopo, dataLines);
    linesGraph(dataLinesGlob[currentYear]);
};

function changeYear(yearObject) {
    currentYear = yearObject.value
    updateMap(dataMapGlob, currentYear);
};


