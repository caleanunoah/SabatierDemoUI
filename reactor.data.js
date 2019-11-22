const fs = require('fs');

// Read the JSON file, which contains data and lookup values for reactor data
const raw = fs.readFileSync('./reactor.data.json');  // Pause execution until file is read
module.exports = JSON.parse(raw);


// COMMENTED FOR NOW
// // var reactor_data = {};
// reactor_data.data = JSON.parse(raw);
// reactor_data.bind = function(datatype){
	// binding = datatype;
// }

// // Access using the syntax:
// //		reactor_datasets.type.[dataset_id]
// //
// // Types describe the general data type (i.e. temperatures, flowrates, pressures...)
// // Each Type contains:
// //		id: Type's unique identifying integer
// //		units: Symbol for that datasets units (i.e. temperature has C, flowrates has L/min)
// //		datasets: A non-specific number of sets of data; see below.
// //
// // Types contain a non-specific number of datasets, each of which contains:
// // 		name: Human-readable dataset name
// //		id: Dataset's unique identifying integer
// //		data: Array of x-y values, where x and y are time and value (in units corresponding to the Type), respectively.
// module.exports = reactor_data;