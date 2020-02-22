// The reactor's data
import { Dataset, Dataseries, Datapoint } from "./models/data.model";

// @ts-ignore
import reactor_data from './dist/reactor.data';

// Serial Connection

// @ts-ignore
import * as serial from './dist/serial';
import SerialPort from 'serialport';  // Type

// UI Elements
// @ts-ignore
import * as status_indicator from './dist/window.statuses';
// @ts-ignore
import * as notebook from "./dist/window.notebook";
// console.log(notebook)
// @ts-ignore
import * as charts from "./dist/window.charts";


// IIFE To initialize the window
$(() => {
	charts.init_charts();
	charts.init_selector(reactor_data.datasets);
	
	charts.primary.select(reactor_data.datasets[0]);
	notebook.append("UBC MARS COLONY\nReactor UI Initialized Successfully\n");
});

$(document).ready(function () {
	status_indicator.update(status_indicator.SCANNING);
	setInterval(() => {
		if (serial.connected())
			return;
		serial.detect()
			.then((ports: Array<any>) => {			
				// console.log(ports)
				if (ports.length === 0)
				{
					status_indicator.update(status_indicator.SCANNING);
					return;
				}
				else
				{
					status_indicator.update(status_indicator.ATTACHED);
					if (ports.length > 1)
						notebook.append("Multiple COM Ports detected! Selecting " + ports[0].path, notebook.WARNING);
					// console.log("PORT DETECTED: " + ports[0].path);
					serial.attach(ports[0].path, (bytestream: number[]) => {
						if (!bytestream)
							return;
						
						let parsed_dataset: Dataset;
						try {
							parsed_dataset = serial.parse_reactor_data(bytestream);
						} catch (e) {
							console.log("Parse Failed! Ignoring...");
							return;
						}
						if (!parsed_dataset)
							return;
						
						parsed_dataset.name = reactor_data.name_from_id(parsed_dataset.id);
						for (let i = 0; i < parsed_dataset.series.length; i++)
							parsed_dataset.series[i].name = reactor_data.name_from_id(parsed_dataset.id, parsed_dataset.series[i].id);
						
						reactor_data.update(parsed_dataset);
						charts.primary.update(parsed_dataset);						
					});
				}
			})
			.catch((e: Error) => alert(e));
	}, 500);
});

function select_plot(selector: HTMLSelectElement)
{
	// Retrieve and parse the datakey as follows:
	// 	- The number before the colon is the dataset ID, and is required; 
	//	- The number after the colon is the dataseries ID, and is optional.
	const datakey = selector.options[selector.selectedIndex].value.split(':');
	let dataset: Dataset;
	let series: Array<number>;
	
	if (datakey[0] == undefined)
		throw new Error("Selector was unable to find a dataset associated with element: " + selector.innerHTML)
	dataset = reactor_data.datasets.find((dset: Dataset) => dset.id === Number(datakey[0]));
	
	if (datakey[1] != undefined)
		series = datakey[1].split(',').map(Number);

	// If no series were specified, that field remains undefined, and is subsequently ignored by the function.
	charts.primary.select(dataset, series);
	
	// Highlights the selected option while turning off all other selected options
	for (let i = 0; i < selector.options.length; i++)
		selector.options[i].id =
			i === selector.selectedIndex ? "selected" : "";
	// Sets the option to the title option
	selector.value = "title";
}

function routine_connect_toggle()
{
	if (serial.connected())
		routine_disconnect();
	else
		routine_connect();
}

function routine_connect()
{
	if (serial.open())
	{
		status_indicator.update(status_indicator.CONNECTED);
		notebook.append("Reactor Connection Opened!");
	}
	else
	{
		status_indicator.update(status_indicator.DISCONNECTED);
		notebook.append("Reactor Connection Failed", notebook.ERROR);
	}
}

function routine_disconnect()
{
	serial.close();
	status_indicator.update(status_indicator.DISCONNECTED);
	notebook.append("Reactor Connection Terminated");
}

function routine_start()
{
	notebook.append("Start Routine Not Implemented", notebook.ERROR);
}

function routine_stop()
{
	notebook.append("Stop Routine Not Implemented", notebook.ERROR);
}


