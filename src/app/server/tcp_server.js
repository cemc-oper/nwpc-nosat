const electron = require('electron');
const ipc = electron.ipcMain;
const { spawn } = require('child_process');
const path = require('path');
const net = require('net');
const submit_log_server = require('./submit_log_server');

let analytics_tool_server = null;

let tcp_port = 62861;


function createTcpServer(event) {
  analytics_tool_server = net.createServer();

  analytics_tool_server.on('listening', function(e){
    let server_address = analytics_tool_server.address();
    console.log(server_address.port);

    ipc.on('llsubmit4.error-log.analytics.get', function (event, session_config, data_config, analyzer_config) {
      let socket_config = {
        "server": {
          "host": "localhost",
          "port": tcp_port
        }
      };
      submit_log_server.request_llsubmit4_error_log_analytics_get(
        event, session_config, data_config, analyzer_config, socket_config);
    });

  });

  analytics_tool_server.on('connection', function(sock){
    console.log('CONNECTED: ' +
      sock.remoteAddress +':'+ sock.remotePort);

    sock.on('data', function(data){
      let received_string = data.toString();
      console.log('[data] ', received_string);
      //console.log(received_string);
      let message = JSON.parse(received_string);
      // console.log('============analytics_tool_server receive data================\n', message);
      if(message.app === 'submit_log_analytics_tool') {
        submit_log_server.receive_llsubmit4_error_log_analytics_response(event, message);
      }
    });

  });

  analytics_tool_server.listen(tcp_port);
}

function closeTcpServer(event) {
  analytics_tool_server.close();
  analytics_tool_server = null;
}

ipc.on('analytics-tool.server.start', function (event) {
  if(analytics_tool_server === null) {
    console.log('start analytics-tool server');
    createTcpServer(event)
  }

});

ipc.on('analytics-tool.server.stop', function (event) {
  if(analytics_tool_server) {
    console.log('stop analytics-tool server');
    closeTcpServer(event)
  }
});