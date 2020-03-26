"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var primary = __importStar(require("./chart.primary"));
exports.primary = primary;
var popped = __importStar(require("./chart.popped"));
exports.popped = popped;
/*
 * chart_options is an array of name-id pairs.
 */
function init_charts() {
    primary.init();
}
exports.init_charts = init_charts;
function init_selector(selector_options) {
    console.log(selector_options);
    var plot_select_el = document.getElementById('dataplot-selector-preset');
    for (var _i = 0, selector_options_1 = selector_options; _i < selector_options_1.length; _i++) {
        var opt = selector_options_1[_i];
        for (var i = 0; i < opt.length; i++) {
            if (opt[i].set_or_series === "series")
                opt[i].label = '&emsp;' + opt[i].label;
            plot_select_el.innerHTML +=
                '<option class="' + opt[i].set_or_series + '" value="' + opt[i].id + '">' + opt[i].label + '</option>';
        }
    }
}
exports.init_selector = init_selector;
//# sourceMappingURL=window.charts.js.map