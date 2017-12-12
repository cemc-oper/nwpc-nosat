const electron = require('electron');
const ipc = electron.ipcMain;
const { spawn } = require('child_process');
const path = require('path');


let python_exe_path = path.join(__dirname, '../vendor/python/python.exe');
let submit_log_analytics_tool_path =
  path.join(__dirname, '../vendor/submit-log-analytics-tool/submit_log_analytics_tool.py');


function request_llsubmit4_error_log_analytics_test_connect(event, session_config, socket_config) {
  const analytics_tool = spawn(python_exe_path, [
    submit_log_analytics_tool_path,
    'test_connect',
    '--session-config=' + JSON.stringify(session_config),
    '--socket-config=' + JSON.stringify(socket_config)
  ]);

  analytics_tool.on('close', (code) => {
    console.log(`analytics_tool process exited with code ${code}`);
    if (code === 0) {
      event.sender.send('llsubmit4.error-log.analytics.test_connect.reply.success');
    } else {
      event.sender.send('llsubmit4.error-log.analytics.test_connect.reply.error');
    }
  });
}


function request_llsubmit4_error_log_analytics_get(event, session_config, data_config, analyzer_config, socket_config) {
  const analytics_tool = spawn(python_exe_path, [
    submit_log_analytics_tool_path,
    'get',
    '--session-config=' + JSON.stringify(session_config),
    '--data-config=' + JSON.stringify(data_config),
    '--analyzer-config=' + JSON.stringify(analyzer_config),
    '--socket-config=' + JSON.stringify(socket_config)
  ]);

  analytics_tool.on('close', (code) => {
    console.log(`analytics_tool process exited with code ${code}`);
    if (code === 0) {
      event.sender.send('llsubmit4.error-log.analytics.get.reply.success');
    } else {
      event.sender.send('llsubmit4.error-log.analytics.get.reply.error');
    }
  });
}

function request_llsubmit4_error_log_analytics_info(event, session_config, data_config, socket_config) {
  const analytics_tool = spawn(python_exe_path, [
    submit_log_analytics_tool_path,
    'info',
    '--session-config=' + JSON.stringify(session_config),
    '--data-config=' + JSON.stringify(data_config),
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
      event.sender.send('llsubmit4.error-log.analytics.info.reply.success');
    } else {
      event.sender.send('llsubmit4.error-log.analytics.info.reply.error');
    }
  });
}


function receive_server_response(event, message) {
  if(message.type === 'message') {
    console.log('[receive_llsubmit4_error_log_analytics_response] message');

    let message_string = message.data.message;
    event.sender.send('llsubmit4.error-log.analytics.message', message_string);

  } else if (message.type === 'result') {
    let request = message.data.request;

    if (request.command === "test_connect") {
      event.sender.send('session-system.session.test.get.reply', message);

    } else if(request.command === 'get') {
      console.log('[receive_llsubmit4_error_log_analytics_response] result');
      let std_out = message.data.response.std_out;
      event.sender.send('llsubmit4.error-log.analytics.get.reply', std_out);

    } else if (request.command === 'info') {
      let response = message.data.response;
      event.sender.send('llsubmit4.error-log.info.get.reply', response);

    } else {
      console.log('[receive_llsubmit4_error_log_analytics_response] request command not supported:', request.command);
    }

  } else {
    console.log('[receive_llsubmit4_error_log_analytics_response] message type not supported:', message.type)
  }
}


function register_to_server(tcp_port) {
  ipc.on('llsubmit4.error-log.analytics.get', function (event, session_config, data_config, analyzer_config) {
    let socket_config = {
      "server": {
        "host": "localhost",
        "port": tcp_port
      }
    };
    request_llsubmit4_error_log_analytics_get(
      event, session_config, data_config, analyzer_config, socket_config);
  });


  ipc.on('llsubmit4.error-log.info.get', function (event, session, error_log_path) {
    let data_config = {
      error_log_path: error_log_path
    };
    let socket_config = {
      "server": {
        "host": "localhost",
        "port": tcp_port
      }
    };
    request_llsubmit4_error_log_analytics_info(event, session, data_config, socket_config);
  });


  /**
   *  test session
   *      1. ssh login
   *      2. interpreter
   *      3. script
   *      4. analytics version
   */
  ipc.on('session-system.session.test.get', function(event, session){
    let socket_config = {
      "server": {
        "host": "localhost",
        "port": tcp_port
      }
    };
    request_llsubmit4_error_log_analytics_test_connect(event, session, socket_config);
  });
}

module.exports = {
  register_to_server,
  receive_server_response
};
