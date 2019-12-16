export let primary: any = null;
export let popped: any = null;

/*
 * chart_options is an array of name-id pairs.
 */
export function init_charts() {
	primary 	= require("./window.charts.primary");
	primary.init();
	popped 	= require("./window.charts.popped");
}

type SetOrSeries = "set" | "series";
type SelectorOption = Array<{
	label: string,
	id: number,
	set_or_series: SetOrSeries
}>;
export function init_selector(selector_options: Array<SelectorOption>)
{
	console.log(selector_options);
	const plot_select_el = document.getElementById('dataplot-selector-preset'); 
	for (let opt of selector_options)
	{
		for (let i = 0; i < opt.length; i++)
		{
			if (opt[i].set_or_series === "series")
				opt[i].label = '&emsp;' + opt[i].label;
				
			plot_select_el.innerHTML +=
				'<option class="' + opt[i].set_or_series + '" value="' + opt[i].id + '">' + opt[i].label + '</option>'; 
		}
	}
}
