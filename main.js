const { app, BrowserWindow } = require("electron");
const path  = require("path");
const url = require("url");


let win;


function createWindow() {
    win = new BrowserWindow( { width: 1300, height: 700 });

    //fefef
    win.loadURL(
        url.format({
            pathname: path.join(__dirname, '/dist/index.html'),
            protocol: "file:",
            slashes: true
        })
    );

}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }

});

app.on("activate", () => {
    if (win === null) {
        createWindow();
    }

});

