import { Dataset } from  "./models/data.model";
import { remote } from "electron";
const window_manager = remote.require('electron-window-manager');

export function pop(dataset_name: string) {
	// Prepare the data
	if (window_manager.get(dataset_name))
	{
		console.log("Window already popped! Bringing to front...");
		window_manager.restore(dataset_name);
		return;
	}
	
	window_manager.open(
		dataset_name,
		dataset_name,
		("file://" + __dirname + "../window.chart.html"),
		false,
		{ resizable: true }
	);
};

export function update(datasets: Array<Dataset>)
{
	window_manager.sharedData.set("datasets", datasets);
}

export function close_all()
{
	window_manager.closeAll();
}