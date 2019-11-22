"use-strict"

/*
 * 	PROGRAM MODULES
 */
// The reactor's data
const reactor_data 	= require('./reactor.data');
// const reactor_console 	= require('./window.console');
// const reactor_statuses  = require('./window.statuses');

const serial 		= require('./serial');

const charts 		= require('./window.charts');
const notebook 		= require('./window.notebook');


// IIFE To initialize the window
$(() => {
	charts.init(
		reactor_data.map(data => ({name: data.name, id: data.id}))
	);
	charts.primary.select(reactor_data[0]);
	
	serial.detect()
		.then((ports) => {
			console.log(ports)
			if (ports.length === 1)
				serial.open(ports[0].path, data => {
					if (!data)
						return;
					try {
						parsed_data = serial.parse_reactor_data(data);
					} catch (e) {
						console.log("Parse Failed! Ignoring...");
						return;
					}
					console.log(parsed_data);
					if (!parsed_data || parsed_data.length === 0)
						return;
					let i = reactor_data.findIndex(d => parsed_data.id === d.id);
					if (i === -1)
						return;
					parsed_data.datapoints.forEach(p => {
						let j = reactor_data[i].datasets.findIndex(d => p.id === d.id);
						if (j === -1)
							return;
						reactor_data[i].datasets[j].data.push({
							x: p.time / 1000,
							y: p.value
						});
					});
					charts.primary.micro.update();
					charts.primary.macro.update();
				});
		})
		.catch((err) => alert(err));
	
	document.getElementById('reactor-status').style.color = 'green';
	document.getElementById('reactor-status').innerHTML = "Connected";

	// reactor_status = 	require('./window.reactorstatus');
	// temperature_plot = 	require('./window.temperatureplot');
	// massflow_plot =		require('./window.massflowplot');	
	// reactor_status.set(reactor_status.status.DISCONNECTED);
});

$(document).ready(function () {
	// Set up any looping actions
	// setTimeout(() => {reactor_statuses.set(reactor_statuses.status.CONNECTED)}, 1000);
	// setTimeout(() => {reactor_statuses.set(reactor_statuses.status.DISCONNECTED)}, 5000);
});

function select_plot(selector)
{
	charts.primary.select(reactor_data.find(data => {
		return data.id == selector.value;  // Purposeful double-equals, because the selector.value string must be cast to a number
	}));
	document.getElementById("dataplot-title").innerHTML = selector.options[selector.selectedIndex].innerHTML;
	
	// Highlights the selected option
	for (let i = 0; i < selector.options.length; i++)
		selector.options[i].className =
			i === selector.selectedIndex ? "selected" : "";
	// Sets the option to the title option
	selector.value = "title";	
}
