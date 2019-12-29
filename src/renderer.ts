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
	charts.init_selector(reactor_data.datasets.map((dataset: Dataset) => {
		const selector_elements = [{
			label: dataset.name,
			id: dataset.id,
			set_or_series: "set"
		}];
		
		for (const series of dataset.series)
		{
			selector_elements.push({
				label: series.name,
				id: dataset.id,
				set_or_series: "series"
			});
		}
		
		return selector_elements;
	}));

	// reactor_status = 	require('./window.reactorstatus');
	// temperature_plot = 	require('./window.temperatureplot');
	// massflow_plot =		require('./window.massflowplot');	
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
	// Determines a dataset from the data
	const dataset = reactor_data.datasets.find((dset: Dataset) => dset.id === Number(selector.value));
	if (!dataset)
		return;
	if (selector.options[selector.selectedIndex].className === "series")
		charts.primary.select(dataset, dataset.series.find((ds: Dataseries) => selector.options[selector.selectedIndex].innerHTML.includes(ds.name)).id);
	else
		charts.primary.select(dataset);
	
	// Highlights the selected option
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


