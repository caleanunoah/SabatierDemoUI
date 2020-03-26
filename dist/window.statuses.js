"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Status;
(function (Status) {
    Status["UNKNOWN"] = "Unknown";
    Status["SCANNING"] = "Scanning";
    Status["ATTACHED"] = "Attached";
    Status["CONNECTED"] = "Connected";
    Status["DISCONNECTED"] = "Disconnected"; // Serial connection unexpectedly closed; attempting recovery
})(Status || (Status = {}));
;
exports.UNKNOWN = Status.UNKNOWN;
exports.SCANNING = Status.SCANNING;
exports.ATTACHED = Status.ATTACHED;
exports.CONNECTED = Status.CONNECTED;
exports.DISCONNECTED = Status.DISCONNECTED;
function update(status) {
    document.getElementById('reactor-status').style.color =
        status === Status.CONNECTED ? 'green' :
            status === Status.DISCONNECTED ? 'red' :
                /*  Default  */ 'black';
    document.getElementById('reactor-status').innerHTML = status;
    var connect_toggle_button = document.getElementById('connect-toggle-button');
    connect_toggle_button.disabled = (status === exports.UNKNOWN || status === exports.SCANNING);
    if (status !== exports.ATTACHED && status !== exports.DISCONNECTED)
        connect_toggle_button.innerHTML = "DISCONNECT";
    else
        connect_toggle_button.innerHTML = "CONNECT";
}
exports.update = update;
//# sourceMappingURL=window.statuses.js.map