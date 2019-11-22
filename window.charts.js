const charts = {};  // Exported module

charts.primary = null
charts.popped = null;

/*
 * chart_options is an array of name-id pairs.
 */
charts.init = function(chart_options) {
	charts.primary 	= require("./window.charts.primary");
	charts.primary.init();
	charts.popped 	= require("./window.charts.popped");
	
	for (let opt of chart_options)
		document.getElementById('dataplot-selector-preset').innerHTML +=
			'<option value="' + opt.id + '">' + opt.name + '</option>'; 
}

module.exports = charts;