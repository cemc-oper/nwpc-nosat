const electron = require('electron');
const ipc = electron.ipcMain;
const net = require('net');

// let tcp_server = null;

// function receive_llsubmit4_error_log_analytics_get_result(event, message) {
//   let std_out = message.data.response.std_out;
//   console.log(std_out);
//   console.log(event);
//   event.sender.send('system-running-time-analytics.draw.reply', std_out);
// }
//
// function createTcpServer(event) {
//   tcp_server = net.createServer();
//
//   tcp_server.on('listening', function(e){
//     let server_address = tcp_server.address();
//     console.log(server_address.port);
//   });
//
//   tcp_server.on('connection', function(sock){
//     console.log('CONNECTED: ' +
//       sock.remoteAddress +':'+ sock.remotePort);
//
//     sock.on('data', function(data){
//       console.log("receive data:");
//       let received_string = data.toString();
//       let message = JSON.parse(received_string);
//       console.log(message);
//       if(message.app === 'submit_log_analytics_tool') {
//         receive_llsubmit4_error_log_analytics_get_result(event, message);
//       }
//     });
//
//   });
//
//   tcp_server.listen(62853);
// }
//
// ipc.on('system-running-time-analytics.draw.click', function (event) {
//   if(tcp_server === null) {
//     createTcpServer(event)
//   }
//
// });