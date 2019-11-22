const primary = {};  // Exported module

primary.init = function() {
	function legend_click_handler(e, legendItem) {
		function toggle_series(chart) {
			let index = legendItem.datasetIndex;
			let meta = chart.getDatasetMeta(index);

			// See controller.isDatasetVisible comment
			meta.hidden = meta.hidden === null ? !chart.data.datasets[index].hidden : null;
			
			// We hid a dataset ... rerender the chart
			chart.update();
		}
		toggle_series(primary.micro);
		toggle_series(primary.macro);
	}
	
	primary.micro = new Chart(
		document.getElementById("dataplot-micro"), {
		type: 'scatter',
		// Set 'data' in charts.select()
		data: {
			datasets: []
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			title: {
				display: true,
				text: "Micro-Scale"
				// Set 'text' in 'charts.select()'
			},
			scales: {
				xAxes: [{
					type: 'linear',
					position: 'bottom'
				}],
				yAxes: [{
					type: 'linear',
					position: 'right',
					ticks: {suggestedMin: 0},
					scaleLabel: {display: true}
					// Set 'text' in charts.select()
				}]
			},			
			legend: {
				position: 'bottom',
				onClick: legend_click_handler
			},
			animation: {
				duration: 0
			},
			elements: {
				point: {radius: 1},
				line: {borderWidth: 1}
			}
		}
	});
	primary.macro = new Chart(
		document.getElementById("dataplot-macro"),  {
		type: 'scatter',
		// Set 'data' in charts.select()
		data: {
			datasets: []
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			title: {
				display: true,
				text: "Macro-Scale"
				// Set 'text' in 'charts.select()'
			},
			scales: {
				xAxes: [{
					type: 'linear',
					position: 'bottom'
				}],
				yAxes: [{
					type: 'linear',
					position: 'right',
					ticks: {suggestedMin: 0},
					scaleLabel: {display: true}
				}]
			},			
			legend: {
				display: false
			},
			animation: {
				duration: 0
			},
			elements: {
				point: {radius: 1},
				line: {borderWidth: 1}
			}
		}
	});
}


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
primary.update = function(new_data) {
	if (!primary.micro.options.scales.yAxis.text.contains(new_data.name))
		return;
	
	
	function update_chart(chart) {
		for (let i = 0; i < new_data.length; i++)
		{
			let dataset_index = chart.data.datasets.findIndex(
				data => data.label === new_data[i].name);
			if (dataset_index !== -1)
			{
				chart.data.datasets[dataset_index].data = 
					chart.data.datasets[dataset_index].data.concat(
						...new_data[i].data
				);
			}
		}
		
		// Renders the update
		chart.update();
	}
	
	update_chart(primary.micro);
	update_chart(primary.macro);
}

// Each axis parameter contains the following:
//		type_id: ID of the type of data to show;
//		dataset_id: ID of the specific dataset of the type
// If x_axis is undefined, it defaults to time
primary.select = function(datatype, visible_dataset_id) {
	function configure_chart(chart) {
		chart.data.datasets = [];  // Don't do .length = 0, as this may clear the actual dataset
		// console.log("---------");
		
		const colors = ["#00AAAA", "#FF0000", "#AAAA00", "#0000FF"];
		for (let i = 0; i < datatype.datasets.length; i++)
		{
			chart.data.datasets[i] = {
				label: datatype.datasets[i].name,
				fill: false,
				data: datatype.datasets[i].data,
				borderColor: colors[i],
				backgroundColor: colors[i],
				hidden: (
					visible_dataset_id !== undefined 
					&& datatype.datasets[i].id !== visible_dataset_id
				)
			};
			// Options
			chart.options.scales.xAxes[0].scaleLabel.labelString = 'Time [s]';
			chart.options.scales.yAxes[0].scaleLabel.labelString = '[' + datatype.units + ']';
		}
		chart.update();
	};
	
	configure_chart(primary.micro);
	configure_chart(primary.macro);
}

module.exports = primary;