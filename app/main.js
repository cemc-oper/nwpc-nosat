const electron = require('electron');
// Module to control application life.
const {app} = electron;
// Module to create native browser window.
const {BrowserWindow} = electron;

const path = require('path');
const url = require('url');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow () {
    // Create the browser window.
    mainWindow = new BrowserWindow({width: 1024, height: 840});

    // and load the index.html of the app.
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    // Open the DevTools.
    // mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

const ipc = electron.ipcMain;
const ssh2 = require('ssh2');

ipc.on('llsubmit4-error-analytics-message', function (event, auth, config) {
    console.log(auth, config);
    let command = "/cma/g3/wangdp/usr/local/bin/python3 "
        + "/cma/g3/wangdp/work/2016/nwpc-operation-system-tool/submit_analytics/llsubmit4_error_analyzer.py "
        + "count -f " + config.error_log_path + " "
        + "--type="+ config.analytics_type +" --begin-date=" + config.begin_date + " --end-date=" + config.end_date;
    let Client = ssh2.Client;
    let conn = new Client();
    conn.on('ready', function() {
        console.log('Client :: ready');
        conn.exec(command, function(err, stream) {
            let std_out = '';
            if (err) throw err;
            stream.on('close', function(code, signal) {
                console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
                conn.end();
                console.log(std_out);
                event.sender.send('llsubmit4-error-analytics-reply', std_out);
            }).on('data', function(data) {
                std_out += data;
            }).stderr.on('data', function(data) {
                console.log('STDERR: ' + data);
            });
        });
    }).connect({
        host: auth.host,
        port: auth.port,
        username: auth.user,
        password: auth.password
    });
});
