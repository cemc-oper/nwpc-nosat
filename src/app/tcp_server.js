const electron = require('electron');
const ipc = electron.ipcMain;
const net = require('net');

let tcp_server = null;

function createTcpServer() {
  tcp_server = net.createServer();

  tcp_server.on('listening', function(e){
    let server_address = tcp_server.address();
    console.log(server_address.port);
  });

  tcp_server.on('connection', function(sock){
    console.log('CONNECTED: ' +
      sock.remoteAddress +':'+ sock.remotePort);

    sock.on('data', function(data){
      console.log("receive data:");
      console.log(data.toString());
    });

  });

  tcp_server.listen(62853);
}

ipc.on('system-running-time-analytics.draw.click', function () {
  if(tcp_server === null) {
    createTcpServer()
  }

});