const electron = require('electron');
const ipc = electron.ipcMain;
const { spawn } = require('child_process');
const path = require('path');


let python_exe_path = path.join(__dirname, '../vendor/python/python.exe');
let submit_log_analytics_tool_path =
  path.join(__dirname, '../vendor/submit-log-analytics-tool/submit_log_analytics_tool.py');


function request_llsubmit4_error_log_analytics_get(event, session_config, data_config, analyzer_config, socket_config) {
  const analytics_tool = spawn(python_exe_path, [
    submit_log_analytics_tool_path,
    'get',
    '--session-config=' + JSON.stringify(session_config),
    '--data-config=' + JSON.stringify(data_config),
    '--analyzer-config=' + JSON.stringify(analyzer_config),
    '--socket-config=' + JSON.stringify(socket_config)
  ]);

  // analytics_tool.stdout.on('data', (data) => {
  //   console.log(`analytics_tool stdout: ${data}`);
  // });
  //
  // analytics_tool.stderr.on('data', (data) => {
  //   console.log(`analytics_tool stderr: ${data}`);
  // });

  analytics_tool.on('close', (code) => {
    console.log(`analytics_tool process exited with code ${code}`);
    if (code === 0) {
      event.sender.send('llsubmit4.error-log.analytics.get.reply.success');
    } else {
      event.sender.send('llsubmit4.error-log.analytics.get.reply.error');
    }
  });
}


function receive_llsubmit4_error_log_analytics_response(event, message) {
  if(message.type === 'message') {
    console.log('[receive_llsubmit4_error_log_analytics_response] message');
    let message_string = message.data.message;
    event.sender.send('llsubmit4.error-log.analytics.message', message_string);
  } else if (message.type === 'result') {
    console.log('[receive_llsubmit4_error_log_analytics_response] result');
    let std_out = message.data.response.std_out;
    event.sender.send('llsubmit4.error-log.analytics.get.reply', std_out);
  }
}

module.exports = {
  request_llsubmit4_error_log_analytics_get,
  receive_llsubmit4_error_log_analytics_response
};
