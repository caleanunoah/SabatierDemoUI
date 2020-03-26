"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path = require('path');
var MAX_DATASET_LEN = 300; // About 5kb per set
// Read the JSON file, which contains data and lookup values for reactor data
console.log(path.join(__dirname, "../res/reactor.data.json"));
var raw = fs_1.readFileSync(path.join(__dirname, "../res/reactor.data.json"), "utf8"); // Pause execution until file is read
var parsed_datasets = JSON.parse(raw);
exports.default = {
    datasets: parsed_datasets,
    name_from_id: function (dataset_id, series_id) {
        // Dataset
        var di = this.datasets.findIndex(function (ds) { return ds.id === dataset_id; });
        if (this.datasets[di] == undefined)
            return undefined;
        if (series_id == undefined)
            return this.datasets[di].name;
        // Dataseries
        var si = this.datasets[di].series.findIndex(function (ds) { return ds.id === series_id; });
        if (this.datasets[di].series[si] == undefined)
            return undefined;
        return this.datasets[di].series[si].name;
    },
    update: function (update_dataset) {
        var _this = this;
        var set_index = this.datasets.findIndex(function (dset) { return dset.id === update_dataset.id; });
        if (set_index === -1) // No matching dataset found; Exit function
            return;
        // Iterate over the incoming series data
        update_dataset.series.forEach(function (update_series) {
            // Check for a matching data series
            var series_index = _this.datasets[set_index].series.findIndex(function (series) { return series.id === update_series.id; });
            if (series_index === -1) // No match found; Go to next iteration
                return;
            // Concatenate the new data to the dataset
            _this.datasets[set_index].series[series_index].data =
                _this.datasets[set_index].series[series_index].data.concat(update_series.data);
        });
    },
    to_csv: function (dataset) {
        if (typeof dataset === "number") {
            dataset = this.datasets.find(function (dset) { return dset.id === dataset; });
            if (!dataset)
                return false;
        }
        // Stub
    },
    clear_half: function (dataset) {
        // Stub
    }
};
//# sourceMappingURL=reactor.data.js.map