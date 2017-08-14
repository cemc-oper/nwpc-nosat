const electron = require('electron');
const ipc = electron.ipcMain;
const ssh2 = require('ssh2');
const { spawn } = require('child_process');
const path = require('path');

let analytics_program = {
  interpreter_path: "/cma/g3/wangdp/usr/local/bin/python3",
  script_path: "/cma/g3/wangdp/work/2016/nwpc-operation-system-tool/submit_analytics/llsubmit4_error_analyzer.py"
};


let python_exe_path = path.join(__dirname, './vendor/python/python.exe');
let submit_log_analytics_tool_path =
  path.join(__dirname, './vendor/submit-log-analytics-tool/submit_log_analytics_tool.py');


/**
 *  test session
 *      1. ssh login
 *      2. interpreter
 *      3. script
 *      4. analytics version
 */

ipc.on('session-system.session.test.get', function(event, session){
  let analytics_tool_stdout = '';

  const analytics_tool = spawn(python_exe_path, [
    submit_log_analytics_tool_path,
    'test_connect',
    '--session-config=' + JSON.stringify(session)
  ]);

  analytics_tool.stdout.on('data', (data) => {
    // console.log('[session-system.session.test.get] data:', data);
    analytics_tool_stdout+=data;
  });

  // analytics_tool.stderr.on('data', (data) => {
  //   console.log(`analytics_tool stderr: ${data}`);
  // });

  analytics_tool.on('close', (code) => {
    console.log(`analytics_tool process exited with code ${code}`);
    console.log('[session-system.session.test.get] analytics_tool_stdout:', analytics_tool_stdout);
    let received_string = analytics_tool_stdout.toString();
    let received_result = JSON.parse(received_string);
    event.sender.send('session-system.session.test.get.reply', received_result);
  });

  //
  // let Client = ssh2.Client;
  // let conn = new Client();
  // conn.on('ready', function() {
  //
  //   // let command = "if [ -x \""+ analytics_program.interpreter_path +"\" ]; then echo OK; else echo ERROR; fi" + ;
  //   // conn.exec(command, function(err, stream) {
  //   //     let std_out = '';
  //   //     if (err) throw err;
  //   //     stream.on('close', function(code, signal) {
  //   //
  //   //         event.sender.send('session-system-test-session-reply', std_out);
  //   //     }).on('data', function(data) {
  //   //         std_out += data;
  //   //     }).stderr.on('data', function(data) {
  //   //
  //   //     });
  //   // });
  //
  //   conn.end();
  //   event.sender.send('session-system.session.test.get.reply', {
  //     'app': 'operation-system-analytics-tool',
  //     'type': 'session-test',
  //     'timestamp': Date.now(),
  //     'data':{
  //       'status': 'success',
  //       'session': session
  //     }
  //   });
  // }).on('error', function(err){
  //   conn.end();
  //   event.sender.send('session-system.session.test.get.reply', {
  //     'app': 'operation-system-analytics-tool',
  //     'type': 'session-test',
  //     'timestamp': Date.now(),
  //     'data':{
  //       'status': 'fail',
  //       'session': session,
  //     }
  //   });
  // }).connect(ssh_auth_config);

});


ipc.on('llsubmit4.error-log.info.get', function (event, session, error_log_path) {
  let command = analytics_program.interpreter_path + " "
    + analytics_program.script_path + " "
    + "info -f " + error_log_path;

  let Client = ssh2.Client;
  let conn = new Client();
  conn.on('ready', function() {
    conn.exec(command, function(err, stream) {
      let std_out = '';
      if (err) throw err;
      stream.on('close', function(code, signal) {conn.end();
        console.log(std_out);
        event.sender.send('llsubmit4.error-log.info.get.reply', std_out);
      }).on('data', function(data) {
        std_out += data;
      }).stderr.on('data', function(data) {
      });
    });
  }).connect({
    host: session.host,
    port: session.port,
    username: session.user,
    password: session.password
  });
});
