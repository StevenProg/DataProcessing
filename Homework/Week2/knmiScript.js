/* 
Temperature in De Bilt(1996). 
Steven Schoenmaker, 10777679

*/


var xhttp = new XMLHttpRequest();
xhttp.open("GET", "KNMI_1996.csv", true);
xhttp.onreadystatechange = function() {
  	if (xhttp.readyState === 4 && xhttp.status === 200) { 
		document = xhttp.responseText; 
		var domain_min = 0
        var domain_max = 600;
        var range_min = 0
        var range_max = 375;
        var margin = 50;
        line_sep = document.getElementById("rawdata").innerHTML.split('\n');
        day_array = [];
        temp_array = [];
        for (i = 0; i < line_sep.length; i++){

            temporary_date = line_sep[i].split(',')[0].slice(0,4) + '-' + 
                                line_sep[i].split(',')[0].slice(4,6) + '-' + 
                                line_sep[i].split(',')[0].slice(6,9);

            day_array.push(new Date(temporary_date));
            temp_array.push(Number(line_sep[i].split(',')[1]));
        }

        function trans_x(x, xList) {
            return ((domain_max - (2 * margin)) / xList.length) * x + margin;
        }
        var max_tem = Math.max(...temp_array.slice(1,-1));
        var min_tem = Math.min(...temp_array.slice(1,-1));

        function trans_y(y) {
            var min_tem_adjust = ((range_max - (2 * margin)) /
                                (max_tem - min_tem)) * min_tem * -1;

            var out = ((range_max - (2 * margin)) / (max_tem - min_tem)) * 
                        y * -1 + range_max - margin - min_tem_adjust;

            return out
        }

        function trans_y_labels(y, yNum) {
            var min_tem_adjust = ((range_max - (2 * margin)) /
                                (yNum)) * min_tem * -1;

            var out = ((range_max - (2 * margin)) / (yNum)) * 
                        y * -1 + range_max - margin - min_tem_adjust;

            return out
        }

        function draw() {
            var canvas = document.getElementById('canvas');
            if (canvas.getContext) {
                var ctx = canvas.getContext('2d');

                // axes
                var xLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                for (i = 0; i<xLabels.length; i++) {
                    var curLabel = trans_x(i, xLabels)	
                    ctx.beginPath();
                    ctx.moveTo(curLabel, range_max - margin);
                    ctx.lineTo(curLabel, range_max - margin + 15);
                    ctx.fillText(xLabels[i], curLabel, range_max - margin + 25);
                    ctx.stroke();
                }
                ctx.beginPath();
                ctx.moveTo(margin, margin);
                ctx.lineTo(margin, range_max - margin);
                ctx.lineTo(domain_max - margin, range_max - margin);
                ctx.stroke();


                var yNum = 10;
                for (var j = 1; j < yNum + 1; j++) {
                    var curLabel = ((range_max - margin * 2) / yNum) * j * -1 + (range_max - margin)
                    ctx.beginPath();
                    ctx.moveTo(margin, curLabel);
                    ctx.lineTo(margin - 10, curLabel);
                    var yStep = (max_tem - min_tem) / yNum;
                    ctx.fillText(Math.round((yStep * j - 100) / 10), margin - 20, curLabel - 5);
                    ctx.stroke();
                }

                ctx.beginPath();
                ctx.moveTo(trans_x(i, day_array), trans_y(temp_array[i]));

                for (i = 1; i < day_array.length; i++) {
                    ctx.lineTo(trans_x(i, day_array), trans_y(temp_array[i]));
                }
                ctx.strokeStyle = 'red';
                ctx.stroke();

                // title 
                ctx.font = 'bold 20px Arial';
				ctx.fillText('Temperature in De Bilt (1996)', (range_max / 2), 25);

                // x-axis label
				ctx.font = 'bold 15px Arial';
				ctx.fillText('Month', (range_max - margin), range_max - (margin / 6));

                // y-axis label
                ctx.font = 'bold 15px Arial'
			    ctx.translate(-margin, 0.5 * range_max);
				ctx.rotate(270 * Math.PI / 180);
				ctx.fillText('Mean temperature (°C)', 0, 0.2 * range_max);
            }
        }
		draw();
  	}
}
xhttp.send(null);