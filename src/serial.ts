import SerialPort from "serialport";
import { Dataset, Dataseries, Datapoint } from "./models/data.model";

let port: SerialPort = null;

export function detect()
{
// @ts-ignore
	return SerialPort.list();
}

type SerialReceiveCallback = (bytestream: Array<number>) => void;
export function attach(path: string, on_receive: SerialReceiveCallback)
{
// @ts-ignore
	port = new SerialPort(path, {
		baudRate: 2000000,  // 2 Mb/s
		autoOpen: false
	});
	
	const parser = port.pipe(new SerialPort.parsers.Ready({delimiter: 'RSIP>>'}));
	parser.on('ready', () => console.log('Data incoming'));
	parser.on('data', on_receive);
}

export function open(): boolean
{
	if (port == null)
		return false
	
	// TODO implement async handling for port opening successes and errors
	port.open();
	return true;
}

export function close()
{
	if (port == null)
		return;
		
	port.close();
	port = null;
}

export function connected(): boolean
{
	if (port == null)
		return false;
	if (!port.isOpen)
		return false;
	return true;
}

export function parse_reactor_data(bytestream: Array<number>): Dataset
{
	bytestream = bytestream.slice(6);  // Take off the indicator "RSIP>>"
	
	// console.log("RAW-->");
	// console.log(data);
	// console.log("Class: " + data[0]);
	// console.log("Descriptor: " + data[1]);
	// console.log("Datapoint: " + data[2] + " X " + data[3]);
	
	if (bytestream[1] > 5)
		return;
	
	if (bytestream[3] === 0)
		return;
	
	let dataset: Dataset = {
		name: null,			// Don't need to define this here
		id: bytestream[1],
		units: null,		// Don't need to define this here
		series: []
	};
	for (let i = 0; i < bytestream[2]; i++)
	{
		let buffer = bytestream.slice(4 + i * bytestream[3], 4 + (i + 1) * bytestream[3]);
		// console.log(buffer);
		if (buffer.length === 0)
			return;
		const view = new DataView(new ArrayBuffer(bytestream[3]));
		for (let j = 0; j < bytestream[3]; j++)
			view.setInt8(j, buffer[j]);
			
		// console.log(view);
		const next_ser_id = view.getInt16(0, true);
		let series_index = dataset.series.findIndex((s: Dataseries) => s.id === next_ser_id);
		if (series_index === -1)
		{
			series_index = dataset.series.length;
			dataset.series[series_index] = {
				name: null,
				id: next_ser_id,
				data: []
			};
		}
		
		dataset.series[series_index].data.push({
			time: view.getInt32(2, true) / 1000.0,
			value: view.getFloat32(6, true)
		});
	}
	// console.log(datapoints);
	return dataset;
}
