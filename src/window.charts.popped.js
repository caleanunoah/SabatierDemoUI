const { remote } = require('electron');
const window_manager = remote.require('electron-window-manager');

const popped = {}  // Exported Module

popped.create = function(datatype) {
	// Create a new window
	
	// Prepare the data
	popped.update(datatype);
	window_manager.open(
		datatype.name,
		datatype.name,
		('file://' + __dirname + '/window.chart.html'),
		false,
		{ resizable: true }
	);
};

popped.update = function(datatype)
{
	// Setting the variable will trigger the data observers.
	// To save memory, only update with new data.
	window_manager.sharedData.set(datatype.name, datatype.datasets);
}

popped.close_all = function()
{
	window_manager.closeAll();
}

module.exports = popped;