"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var window_manager = electron_1.remote.require('electron-window-manager');
function pop(dataset_name) {
    // Prepare the data
    if (window_manager.get(dataset_name)) {
        console.log("Window already popped! Bringing to front...");
        window_manager.restore(dataset_name);
        return;
    }
    window_manager.open(dataset_name, dataset_name, ("file://" + __dirname + "../window.chart.html"), false, { resizable: true });
}
exports.pop = pop;
;
function update(datasets) {
    window_manager.sharedData.set("datasets", datasets);
}
exports.update = update;
function close_all() {
    window_manager.closeAll();
}
exports.close_all = close_all;
//# sourceMappingURL=chart.popped.js.map