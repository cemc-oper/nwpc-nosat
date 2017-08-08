const electron = require('electron');
const ipc = electron.ipcMain;
const { spawn } = require('child_process');
const path = require('path');
const net = require('net');

let python_exe_path = path.join(__dirname, '../vendor/python/python.exe');
let submit_log_analytics_tool_path =
  path.join(__dirname, '../vendor/submit-log-analytics-tool/submit_log_analytics_tool.py');

let tcp_server = null;

let tcp_port = 62861;


ipc.on('llsubmit4.error-log.analytics.get', function (event, session_config, data_config, analyzer_config) {
  let socket_config = {
    "server": {
      "host": "10.28.32.175",
      "port": tcp_port
    }
  };

  const analytics_tool = spawn(python_exe_path, [
    submit_log_analytics_tool_path,
    'get',
    '--session-config=' + JSON.stringify(session_config),
    '--data-config=' + JSON.stringify(data_config),
    '--analyzer-config=' + JSON.stringify(analyzer_config),
    '--socket-config=' + JSON.stringify(socket_config)
  ]);

  analytics_tool.stdout.on('data', (data) => {
    console.log(`analytics_tool stdout: ${data}`);
  });

  analytics_tool.stderr.on('data', (data) => {
    console.log(`analytics_tool stderr: ${data}`);
  });

  analytics_tool.on('close', (code) => {
    console.log(`analytics_tool process exited with code ${code}`);
    if (code > 0 || code < 0) {
      event.sender.send('llsubmit4.error-log.analytics.get.reply.error');
    }
  });
});


function receive_llsubmit4_error_log_analytics_get_result(event, message) {
  let std_out = message.data.response.std_out;
  event.sender.send('llsubmit4.error-log.analytics.get.reply', std_out);
}


function createTcpServer(event) {
  tcp_server = net.createServer();

  tcp_server.on('listening', function(e){
    let server_address = tcp_server.address();
    console.log(server_address.port);
  });

  tcp_server.on('connection', function(sock){
    console.log('CONNECTED: ' +
      sock.remoteAddress +':'+ sock.remotePort);

    sock.on('data', function(data){
      let received_string = data.toString();
      let message = JSON.parse(received_string);
      console.log('============tcp_server receive data================\n', message);
      if(message.app === 'submit_log_analytics_tool') {
        receive_llsubmit4_error_log_analytics_get_result(event, message);
      }
    });

  });

  tcp_server.listen(tcp_port);
}

ipc.on('llsubmit4.error-log.analytics.server.start', function (event) {
  if(tcp_server === null) {
    console.log('start llsubmit4 error-log analytics server');
    createTcpServer(event)
  }

});