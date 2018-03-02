/*
Steven Schoenmaker 10777679
Source http://bl.ocks.org/mapsam/6090056
*/

window.onload = function() {

  queue()
	.defer(d3.json, 'KNMI_1996.json')
  .defer(d3.json, 'KNMI_2017.json')
  .await(conLog);
  function conLog(error, data1996, data2017){
    console.log(data1996, data2017)
  }
};