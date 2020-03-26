"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var serialport_1 = __importDefault(require("serialport"));
var port = null;
function detect() {
    // @ts-ignore
    return serialport_1.default.list();
}
exports.detect = detect;
function attach(path, on_receive) {
    // @ts-ignore
    port = new serialport_1.default(path, {
        baudRate: 2000000,
        autoOpen: false
    });
    var parser = port.pipe(new serialport_1.default.parsers.Ready({ delimiter: 'RSIP>>' }));
    parser.on('ready', function () { return console.log('Data incoming'); });
    parser.on('data', on_receive);
}
exports.attach = attach;
function open() {
    if (port == null)
        return false;
    // TODO implement async handling for port opening successes and errors
    port.open();
    return true;
}
exports.open = open;
function close() {
    if (port == null)
        return;
    port.close();
    port = null;
}
exports.close = close;
function connected() {
    if (port == null)
        return false;
    if (!port.isOpen)
        return false;
    return true;
}
exports.connected = connected;
function parse_reactor_data(bytestream) {
    bytestream = bytestream.slice(6); // Take off the indicator "RSIP>>"
    // console.log("RAW-->");
    // console.log(data);
    // console.log("Class: " + data[0]);
    // console.log("Descriptor: " + data[1]);
    // console.log("Datapoint: " + data[2] + " X " + data[3]);
    if (bytestream[1] > 5)
        return;
    if (bytestream[3] === 0)
        return;
    var dataset = {
        name: null,
        id: bytestream[1],
        units: null,
        series: []
    };
    var _loop_1 = function (i) {
        var buffer = bytestream.slice(4 + i * bytestream[3], 4 + (i + 1) * bytestream[3]);
        // console.log(buffer);
        if (buffer.length === 0)
            return { value: void 0 };
        var view = new DataView(new ArrayBuffer(bytestream[3]));
        for (var j = 0; j < bytestream[3]; j++)
            view.setInt8(j, buffer[j]);
        // console.log(view);
        var next_ser_id = view.getInt16(0, true);
        var series_index = dataset.series.findIndex(function (s) { return s.id === next_ser_id; });
        if (series_index === -1) {
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
    };
    for (var i = 0; i < bytestream[2]; i++) {
        var state_1 = _loop_1(i);
        if (typeof state_1 === "object")
            return state_1.value;
    }
    // console.log(datapoints);
    return dataset;
}
exports.parse_reactor_data = parse_reactor_data;
//# sourceMappingURL=serial.js.map