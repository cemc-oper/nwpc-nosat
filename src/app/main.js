const electron = require('electron');
// Module to control application life.
const {app} = electron;
// Module to create native browser window.
const {BrowserWindow} = electron;

const path = require('path');
const url = require('url');

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 840
  });

  let main_url = url.format({
    pathname: path.join(__dirname, 'client/index.html'),
    protocol: 'file:',
    slashes: true
  });
  mainWindow.loadURL(main_url);

  // Set development tools.
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
    const local_app_data_dir = process.env.LOCALAPPDATA;
    const extension_list = [
      "Google\\Chrome\\User Data\\Default\\Extensions\\fmkadmapgofadopljbjfkapdkoienihi\\2.5.2_0",
      "Google\\Chrome\\User Data\\Default\\Extensions\\lmhkpmbekcpmknklioeibfkpmmfibljd\\2.15.1_0"
    ];
    extension_list.forEach(extension=>{
      BrowserWindow.addDevToolsExtension(path.join(local_app_data_dir, extension));
    });
  }

  mainWindow.webContents.on('did-finish-load', ()=>{
    if(!mainWindow) {
      throw new Error("Main window is not created.");
    }
    mainWindow.show();
    mainWindow.focus();
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    const tcp_server = require('./server/tcp_server');
    tcp_server.closeTcpServer();
    app.quit();
  }
});


require('./server/ipc');
