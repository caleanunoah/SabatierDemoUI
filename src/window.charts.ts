import { Dataset, Dataseries } from "./models/data.model";
import * as primary from "./chart.primary";
import * as popped from "./chart.popped";
export { primary, popped };

/*
 * chart_options is an array of name-id pairs.
 */
export function init_charts()
{
	primary.init();
}

/* Author: Thomas Richmond
 * Description: Populates the chart selector with a nested-style list
 *				encompassing each dataset in the reactor_data.json resource file.
 *				The list automatically accomodates new entries into this file.
 * Purpose: datasets [Array<Dataset>] - All plottable datasets. Note: For this to
 *										work properly, each dataset and associated
 *										dataseries must have a name and ID.
 */
export function init_selector(datasets: Array<Dataset>)
{
	// Get the HTML selector element. We will populate its fields below.
	const plot_selector = document.getElementById('dataplot-selector-preset') as HTMLSelectElement; 
	
	// Iterate over every dataset in the provided array.
	// Each dataset and all of its series will be added to the selector.
	for (let dset of datasets)
	{
		// The "primary" option corresponds to the entire dataset. When selected, all dataseries
		// within the dataset are shown on the plot.
		plot_selector.innerHTML +=
			"<option class='set' value='" + dset.id + "'>" + dset.name + "</option>"
		
		// Iterate over each series within the dataset
		for (let dser of dset.series)
			// The 'secondary' options correspond to the indiviudal series within a dataset. When selected,
			// that dataseries will be shown on the plot.
			plot_selector.innerHTML +=
				"<option class='series' value='" + dset.id + ":" + dser.id + "'>&nbsp;" + dser.name + "</option>";
	}
}