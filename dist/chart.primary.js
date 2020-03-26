"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chart_js_1 = __importDefault(require("chart.js"));
var MICRO_TIME_SPAN = 15;
var CONVOLUTER_STRENGTH = 0.20;
exports.micro = null;
exports.macro = null;
exports.current_plot = null;
function init() {
    // TODO Figure out what type LegendItem has
    function legend_click_handler(e, legendItem) {
        function toggle_series(chart) {
            var index = legendItem.datasetIndex;
            var meta = chart.getDatasetMeta(index);
            // See controller.isDatasetVisible comment
            meta.hidden = meta.hidden === null ? !chart.data.datasets[index].hidden : null;
            // We hid a dataset ... rerender the chart
            chart.update();
        }
        toggle_series(exports.micro);
        toggle_series(exports.macro);
    }
    exports.micro = new chart_js_1.default(document.getElementById("dataplot-micro"), {
        type: 'scatter',
        // Set 'data' in charts.select()
        data: {
            datasets: []
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: false,
                text: "Micro"
                // Set 'text' in 'charts.select()'
            },
            scales: {
                xAxes: [{
                        type: 'linear',
                        position: 'bottom',
                    }],
                yAxes: [
                    {
                        type: 'linear',
                        position: 'right',
                        ticks: { suggestedMin: 0 },
                        scaleLabel: { display: true }
                        // Set 'text' in charts.select()
                    },
                    {
                        position: 'left',
                        ticks: { display: false },
                        gridLines: { display: false },
                        scaleLabel: {
                            display: true,
                            labelString: "Micro"
                        }
                    },
                ]
            },
            legend: {
                position: 'bottom',
                onClick: legend_click_handler
            },
            animation: {
                duration: 0
            }
        }
    });
    exports.macro = new chart_js_1.default(document.getElementById("dataplot-macro"), {
        type: 'scatter',
        // Set 'data' in charts.select()
        data: {
            datasets: []
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: false,
                text: "Macro"
                // Set 'text' in 'charts.select()'
            },
            scales: {
                xAxes: [{
                        type: 'linear',
                        position: 'bottom',
                        ticks: { suggestedMin: 0 },
                        scaleLabel: { display: true }
                    }],
                yAxes: [
                    {
                        type: 'linear',
                        position: 'right',
                        ticks: { suggestedMin: 0 },
                        scaleLabel: { display: true }
                    },
                    {
                        position: "left",
                        ticks: { display: false },
                        gridLines: { display: false },
                        scaleLabel: {
                            display: true,
                            labelString: "Macro"
                        }
                    },
                ]
            },
            legend: {
                display: false
            },
            animation: {
                duration: 0
            }
        }
    });
}
exports.init = init;
/*
 * 	new_data: A datatype object. Each datatype contains:
 *				- name
 * 				- ID
 *				- array of datasets
 *			  Each dataset contains:
 *			  	- name
 *				- ID
 *				- new data
 */
function update(dataset) {
    if (exports.current_plot !== dataset.name)
        return;
    var _loop_1 = function (series) {
        var i = exports.macro.data.datasets.findIndex(function (ds) { return ds.label === series.name; });
        if (i === -1)
            return "break";
        var mapped_data = series.data
            .map(function (dp) { return ({ x: dp.time, y: dp.value }); })
            .filter(function (cp) { return cp.x != undefined && cp.y != undefined; });
        // @ts-ignore
        exports.macro.data.datasets[i].data = exports.macro.data.datasets[i].data.concat(mapped_data);
        // @ts-ignore
        exports.micro.data.datasets[i].data = exports.micro.data.datasets[i].data.concat(mapped_data);
    };
    // Append data to the plots
    for (var _i = 0, _a = dataset.series; _i < _a.length; _i++) {
        var series = _a[_i];
        var state_1 = _loop_1(series);
        if (state_1 === "break")
            break;
    }
    // Make the x-axis max scale consistently
    var max_xval = 0;
    for (var _b = 0, _c = exports.micro.data.datasets; _b < _c.length; _b++) {
        var series = _c[_b];
        if (series.data[series.data.length - 1].x > max_xval)
            max_xval = series.data[series.data.length - 1].x;
    }
    exports.macro.options.scales.xAxes[0].ticks.suggestedMax = Math.ceil(max_xval / 2) * 2;
    exports.micro.options.scales.xAxes[0].ticks.suggestedMax = Math.ceil(max_xval / 2) * 2;
    // Convolute the macro-scale plot data so we don't keep re-rendering a ton of data
    convolute_chart(exports.macro, CONVOLUTER_STRENGTH);
    // Cut off the micro-scale plot
    // 1. Make sure the axis scales consistently
    var micro_cutoff = Math.ceil(max_xval / 2) * 2 - Math.floor(MICRO_TIME_SPAN / 2) * 2;
    exports.micro.options.scales.xAxes[0].ticks.suggestedMin = (micro_cutoff > 0 ? micro_cutoff : 0);
    // Filter values to those in the desired range
    for (var i = 0; i < exports.micro.data.datasets.length; i++)
        exports.micro.data.datasets[i].data =
            // Typescript doesn't like the filter call.
            // @ts-ignore
            exports.micro.data.datasets[i].data.filter(function (dp) { return dp.x > micro_cutoff; });
    // Push the update to the screen
    exports.micro.update();
    exports.macro.update();
}
exports.update = update;
// Each axis parameter contains the following:
//		type_id: ID of the type of data to show;
//		dataset_id: ID of the specific dataset of the type
// If x_axis is undefined, it defaults to time
function select(dataset, visible_dataset_id) {
    function configure_chart(chart) {
        chart.data.datasets = []; // Don't do .length = 0, as this may clear the actual dataset
        var colors = ["#00AAAA", "#FF0000", "#0000FF", "#B8860B"];
        for (var i = 0; i < dataset.series.length; i++) {
            chart.data.datasets[i] = {
                // The data itself
                label: dataset.series[i].name,
                data: dataset.series[i].data.map(function (d) { return ({ x: d.time, y: d.value }); }),
                // Datapoint formatting
                radius: 1,
                backgroundColor: colors[i],
                // Curve formatting
                showLine: true,
                borderWidth: 1,
                borderColor: colors[i],
                fill: false,
                // Other
                hidden: ( // Draws or hides the data
                visible_dataset_id != undefined
                    && dataset.series[i].id !== visible_dataset_id)
            };
            // Options
            chart.options.scales.xAxes[0].scaleLabel.labelString = 'Time [s]';
            chart.options.scales.yAxes[0].scaleLabel.labelString = '[' + dataset.units + ']';
        }
    }
    ;
    // Set the charts to the current data
    configure_chart(exports.macro);
    configure_chart(exports.micro);
    // Reduce the amount of data we show
    convolute_chart(exports.macro, CONVOLUTER_STRENGTH);
    // Update the chart visuals
    exports.macro.update();
    exports.micro.update();
    document.getElementById("dataplot-title").innerHTML = dataset.name;
    exports.current_plot = dataset.name;
}
exports.select = select;
/*
 * Author: Thomas Richmond
 * Purpose: Reduce the number of datapoints in the chart such that we
 *			retain as few points as needed while still indicating the
 *			plot behaviour. For instance, the sequential values
 *			{ 0.9, 1.1, 1.05, 1.02, 0.95 } may as well be represented by
 *			a single datapoint (~1) and we can let a bezier curve fit the
 *			rest of the the data.
 * Parameters:  chart [Chart] - The chart whose data you wish to convolute
 *		strength [number] - The maximum percent error between datapoints
 *					for which data will be convoluted.
 *					Value must be positive.
 */
function convolute_chart(chart, strength) {
    if (strength < 0)
        throw new RangeError("Convoluter strength cannot be less than zero!");
    for (var i = 0; i < chart.data.datasets.length; i++) {
        // Create a convolution buffer so that we can delete data 
        // without affecting the chart object
        var conv_buffer = exports.macro.data.datasets[i].data;
        // Loop over the entire dataset, excluding the most recent element,
        // in reverse order and three elements at a time. 
        for (var n = conv_buffer.length - 1; n > 3; n--) {
            // Get three neighboring elements of the array.
            // We only care about their y-values, so extract those.
            var _a = conv_buffer.slice(n - 3, n)
                // @ts-ignore
                .map(function (dp) { return dp.y; }), x3 = _a[0], x2 = _a[1], x1 = _a[2];
            // Convolute the data:
            // 	If the percent difference of x3 and x1 is within the convoluter strength, 
            // 	then we consider x2 as being unimportant to the overall trend of the data.
            if (Math.abs(x1 - x3) / (Math.abs(x1) / 2 + Math.abs(x3) / 2) < strength)
                conv_buffer.splice(n - 2, 1);
        }
        // Repopulate the chart series with the convoluted data.
        chart.data.datasets[i].data = conv_buffer;
    }
}
//# sourceMappingURL=chart.primary.js.map