const net = require('net');
const submit_log_server = require('./submit_log_server');

let analytics_tool_server = null;

let tcp_port = 62861;

function isTcpServerCreated(){
  return analytics_tool_server !== null;
}

function createTcpServer(event) {
  analytics_tool_server = net.createServer();

  analytics_tool_server.on('listening', function(e){
    let server_address = analytics_tool_server.address();
    console.log(server_address.port);

    submit_log_server.register_to_server(tcp_port);
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
        submit_log_server.receive_server_response(event, message);
      }
    });

  });

  analytics_tool_server.listen(tcp_port);
}

function closeTcpServer(event) {
  analytics_tool_server.close();
  analytics_tool_server = null;
}

module.exports = {
  isTcpServerCreated,
  createTcpServer,
  closeTcpServer
};
