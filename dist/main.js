"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var path = require('path');
var url = require('url');
var window = null;
// Wait until the app is ready
electron_1.app.once('ready', function () {
    // Create a new window
    window = new electron_1.BrowserWindow({
        // Set the initial width to 500px
        width: 1366,
        // Set the initial height to 400px
        height: 768,
        fullscreen: true,
        // set the title bar style
        titleBarStyle: 'hiddenInset',
        // set the background color to black
        backgroundColor: "#111",
        // Don't show the window until it's ready, this prevents any white flickering
        show: false,
        // Set icon to Sabatier project logo
        icon: path.join(__dirname, "../assets/sabatier-logo.png")
    });
    window.loadURL(path.join(__dirname, "../window.html"));
    // window.registerShortcut("CmdOrCtrl+C", () => {
    // });
    window.once('ready-to-show', function () {
        window.show();
    });
});
//# sourceMappingURL=main.js.map