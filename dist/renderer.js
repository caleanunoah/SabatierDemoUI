"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
var reactor_data_1 = __importDefault(require("./dist/reactor.data"));
// Serial Connection
// @ts-ignore
var serial = __importStar(require("./dist/serial"));
// UI Elements
// @ts-ignore
var status_indicator = __importStar(require("./dist/window.statuses"));
// @ts-ignore
var notebook = __importStar(require("./dist/window.notebook"));
// console.log(notebook)
// @ts-ignore
var charts = __importStar(require("./dist/window.charts"));
// IIFE To initialize the window
$(function () {
    charts.init_charts();
    charts.init_selector(reactor_data_1.default.datasets.map(function (dataset) {
        var selector_elements = [{
                label: dataset.name,
                id: dataset.id,
                set_or_series: "set"
            }];
        for (var _i = 0, _a = dataset.series; _i < _a.length; _i++) {
            var series = _a[_i];
            selector_elements.push({
                label: series.name,
                id: dataset.id,
                set_or_series: "series"
            });
        }
        return selector_elements;
    }));
    // reactor_status = 	require('./window.reactorstatus');
    // temperature_plot = 	require('./window.temperatureplot');
    // massflow_plot =		require('./window.massflowplot');	
    charts.primary.select(reactor_data_1.default.datasets[0]);
    notebook.append("UBC MARS COLONY\nReactor UI Initialized Successfully\n");
});
$(document).ready(function () {
    status_indicator.update(status_indicator.SCANNING);
    setInterval(function () {
        if (serial.connected())
            return;
        serial.detect()
            .then(function (ports) {
            // console.log(ports)
            if (ports.length === 0) {
                status_indicator.update(status_indicator.SCANNING);
                return;
            }
            else {
                status_indicator.update(status_indicator.ATTACHED);
                if (ports.length > 1)
                    notebook.append("Multiple COM Ports detected! Selecting " + ports[0].path, notebook.WARNING);
                // console.log("PORT DETECTED: " + ports[0].path);
                serial.attach(ports[0].path, function (bytestream) {
                    if (!bytestream)
                        return;
                    var parsed_dataset;
                    try {
                        parsed_dataset = serial.parse_reactor_data(bytestream);
                    }
                    catch (e) {
                        console.log("Parse Failed! Ignoring...");
                        return;
                    }
                    if (!parsed_dataset)
                        return;
                    parsed_dataset.name = reactor_data_1.default.name_from_id(parsed_dataset.id);
                    for (var i = 0; i < parsed_dataset.series.length; i++)
                        parsed_dataset.series[i].name = reactor_data_1.default.name_from_id(parsed_dataset.id, parsed_dataset.series[i].id);
                    reactor_data_1.default.update(parsed_dataset);
                    charts.primary.update(parsed_dataset);
                });
            }
        })
            .catch(function (e) { return alert(e); });
    }, 500);
});
function select_plot(selector) {
    // Determines a dataset from the data
    var dataset = reactor_data_1.default.datasets.find(function (dset) { return dset.id === Number(selector.value); });
    if (!dataset)
        return;
    if (selector.options[selector.selectedIndex].className === "series")
        charts.primary.select(dataset, dataset.series.find(function (ds) { return selector.options[selector.selectedIndex].innerHTML.includes(ds.name); }).id);
    else
        charts.primary.select(dataset);
    // Highlights the selected option
    for (var i = 0; i < selector.options.length; i++)
        selector.options[i].id =
            i === selector.selectedIndex ? "selected" : "";
    // Sets the option to the title option
    selector.value = "title";
}
function routine_connect_toggle() {
    if (serial.connected())
        routine_disconnect();
    else
        routine_connect();
}
function routine_connect() {
    if (serial.open()) {
        status_indicator.update(status_indicator.CONNECTED);
        notebook.append("Reactor Connection Opened!");
    }
    else {
        status_indicator.update(status_indicator.DISCONNECTED);
        notebook.append("Reactor Connection Failed", notebook.ERROR);
    }
}
function routine_disconnect() {
    serial.close();
    status_indicator.update(status_indicator.DISCONNECTED);
    notebook.append("Reactor Connection Terminated");
}
function routine_start() {
    notebook.append("Start Routine Not Implemented", notebook.ERROR);
}
function routine_stop() {
    notebook.append("Stop Routine Not Implemented", notebook.ERROR);
}
//# sourceMappingURL=renderer.js.map