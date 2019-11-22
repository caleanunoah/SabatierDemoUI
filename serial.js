const SerialPort = require("serialport");
const ReadyParser = require("@serialport/parser-ready");
const serial = {};  // Exported module

let port = null;

serial.detect = function() {
	return SerialPort.list();
}

serial.open = function(path, on_receive) {
	port = new SerialPort(path, {
		baudRate: 2000000  // 2 Mb/s
	});
	
	const parser = port.pipe(new ReadyParser({delimiter: 'RSIP>>'}));
	parser.on('ready', () => console.log('Data incoming'));
	parser.on('data', on_receive);
}

serial.parse_reactor_data = function(data) {
	data = data.slice(6);  // Take off the indicator
	
	console.log("RAW-->");
	console.log(data);
	console.log("Class: " + data[0]);
	console.log("Descriptor: " + data[1]);
	console.log("Datapoint: " + data[2] + " X " + data[3]);
	
	if (data[1] > 5)
		return;
	
	if (data[3] === 0)
		return;
	
	datapoints = [];
	for (let i = 0; i < data[2]; i++)
	{
		let buffer = data.slice(4 + i * data[3], 4 + (i + 1) * data[3]);
		console.log(buffer);
		if (buffer.length === 0)
			return;
		let view = new DataView(new ArrayBuffer(data[3]));
		for (let j = 0; j < data[3]; j++)
			view.setInt8(j, buffer[j]);
			
		console.log(view);
		datapoints[datapoints.length] = {
			id: view.getInt16(0, true),
			time: view.getInt32(2, true),
			value: view.getFloat32(6, true)
		};
	}
	// console.log(datapoints);
	return {
		id: data[1],
		datapoints: datapoints
	};
}

module.exports = serial;
