const electron = require('electron');
const ipc = electron.ipcMain;

const tcp_server = require('./tcp_server');


ipc.on('analytics-tool.server.start', function (event) {
  if(!tcp_server.isTcpServerCreated()) {
    console.log('start analytics-tool server');
    tcp_server.createTcpServer(event)
  }

});


ipc.on('analytics-tool.server.stop', function (event) {
  if(tcp_server.isTcpServerCreated()) {
    console.log('stop analytics-tool server');
    tcp_server.isTcpServerCreated(event)
  }
});