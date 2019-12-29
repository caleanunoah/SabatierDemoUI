import { Dataset } from  "./models/data.model" 
import { remote } from "electron";
const window_manager = remote.require('electron-window-manager');

export function create(dataset: Dataset) {
	// Prepare the data
	if (window_manager.get(dataset.name) != undefined)
	{
		window_manager.restore(dataset.name);
		return;
	}
	
	window_manager.open(
		dataset.name,
		dataset.name,
		("file://" + __dirname + "/window.chart.html"),
		false,
		{ resizable: true }
	);
};

export function update(dataset: Dataset)
{
	// Setting the variable will trigger the data observers.
	// To save memory, only update with new data.
	window_manager.sharedData.set(dataset.name, dataset);
}

export function close_all()
{
	window_manager.closeAll();
}