import {app, BrowserWindow} from "electron";
const path = require('path')
const url = require('url')

let electron_window: Electron.BrowserWindow = null;

// Wait until the app is ready
app.once('ready', () => {
  // Create a new window
  electron_window = new BrowserWindow({
    // Set the initial width to 500px
    width: 1366,
    // Set the initial height to 400px
    height: 768,
    // set the title bar style
    titleBarStyle: 'hiddenInset',
    // set the background color to black
    backgroundColor: "#111",
    // Don't show the window until it's ready, this prevents any white flickering
    show: false
  })

  electron_window.loadURL(path.join(__dirname, "../window.html"));
  // url.format({
    // pathname: path.join(__dirname, '../../window.html'),
    // protocol: 'file:',
    // slashes: true
  // }))
  electron_window.once('ready-to-show', () => {
    electron_window.show();
  })  
})
