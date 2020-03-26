"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Severity;
(function (Severity) {
    Severity["ERROR"] = "#FF0000";
    Severity["WARNING"] = "#FFFF00";
    Severity["VERBOSE"] = "#FFFFFF";
})(Severity || (Severity = {}));
;
exports.ERROR = Severity.ERROR;
exports.WARNING = Severity.WARNING;
exports.VERBOSE = Severity.VERBOSE;
var bottom_line_id = 0;
function append(str, severity) {
    console.log("Printed to Console: '" + str + "'");
    /*
     * Function sets text color based on severity
     */
    var line_id = 'console-line-' + ++bottom_line_id;
    var fmt_str = '<span '
        + 'id="' + line_id + '" '
        + 'style="color: ' + (severity || Severity.VERBOSE) + '">'
        + str
        + '</span>\n';
    // Append the string
    document.getElementById("reactor-console-output").innerHTML += fmt_str;
    scroll_to_bottom();
}
exports.append = append;
function scroll_to_bottom() {
    document.getElementById('console-line-' + bottom_line_id).scrollIntoView();
}
exports.scroll_to_bottom = scroll_to_bottom;
function clear() {
    console.log('Clearing Console');
    document.getElementById("reactor-console-output").innerHTML = '';
}
exports.clear = clear;
function test() {
    append("Reactor Started!");
    append("Received data is simulated!", Severity.WARNING);
    // notebook.append("---Reactor Console Test Start---");
    // notebook.append("This is a verbose output. It should be WHITE",
    // notebook.severity.VERBOSE);
    // notebook.append("This is a warning output. It should be YELLOW",
    // notebook.severity.WARNING);
    // notebook.append("This is an error output. It should be RED",
    // notebook.severity.ERROR);
    // notebook.append("---Reactor Console Test Finished---");
}
exports.test = test;
//# sourceMappingURL=window.notebook.js.map