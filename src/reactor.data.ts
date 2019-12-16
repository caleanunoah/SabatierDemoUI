import { readFileSync } from "fs";
import { Dataset, Dataseries, Datapoint } from "./models/data.model";
const path = require('path')

const MAX_DATASET_LEN = 300;  // About 5kb per set

// Read the JSON file, which contains data and lookup values for reactor data
console.log(path.join(__dirname, "../res/reactor.data.json"));
const raw = readFileSync(path.join(__dirname, "../res/reactor.data.json"), "utf8");  // Pause execution until file is read
const parsed_datasets = JSON.parse(raw) as Array<Dataset>;

export default {
	datasets: parsed_datasets,
	
	name_from_id: function(dataset_id: number, series_id?: number)
	{
		// Dataset
		const di = this.datasets.findIndex((ds: Dataset) => ds.id === dataset_id);
		if (this.datasets[di] == undefined)
			return undefined;
		if (series_id == undefined)
			return this.datasets[di].name;
		
		// Dataseries
		const si = this.datasets[di].series.findIndex((ds: Dataseries) => ds.id === series_id);
		if (this.datasets[di].series[si] == undefined)
			return undefined;
		return this.datasets[di].series[si].name;
	},
	
	update: function(update_dataset: Dataset) {
		const set_index = this.datasets.findIndex((dset: Dataset) => dset.id === update_dataset.id);
		if (set_index === -1)  // No matching dataset found; Exit function
			return;
		
		// Iterate over the incoming series data
		update_dataset.series.forEach(update_series => {
			// Check for a matching data series
			const series_index = this.datasets[set_index].series.findIndex(
				(series: Dataseries) => series.id === update_series.id);
			if (series_index === -1)  // No match found; Go to next iteration
				return;
			
			// Concatenate the new data to the dataset
			this.datasets[set_index].series[series_index].data =
				this.datasets[set_index].series[series_index].data.concat(update_series.data);
		});
	},
	
	to_csv: function(dataset: number | Dataset) {
		if (typeof dataset === "number")
		{
			dataset = this.datasets.find((dset: Dataset) => dset.id === dataset);
			if (!dataset)
				return false;
		}
		
		// Stub
	},
	
	clear_half: function(dataset: number) {
		// Stub
	}
};
