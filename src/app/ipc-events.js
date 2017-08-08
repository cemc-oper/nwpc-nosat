const electron = require('electron');
const ipc = electron.ipcMain;
const ssh2 = require('ssh2');


/**
 *  test session
 *      1. ssh login
 *      2. interpreter
 *      3. script
 *      4. analytics version
 */

ipc.on('session-system.session.test.get', function(event, session){
  let ssh_auth_config = {
    host: session.host,
    port: session.port,
    username: session.user,
    password: session.password
  };

  let Client = ssh2.Client;
  let conn = new Client();
  conn.on('ready', function() {

    // let command = "if [ -x \""+ analytics_program.interpreter_path +"\" ]; then echo OK; else echo ERROR; fi" + ;
    // conn.exec(command, function(err, stream) {
    //     let std_out = '';
    //     if (err) throw err;
    //     stream.on('close', function(code, signal) {
    //
    //         event.sender.send('session-system-test-session-reply', std_out);
    //     }).on('data', function(data) {
    //         std_out += data;
    //     }).stderr.on('data', function(data) {
    //
    //     });
    // });

    conn.end();
    event.sender.send('session-system.session.test.get.reply', {
      'app': 'operation-system-analytics-tool',
      'type': 'session-test',
      'timestamp': Date.now(),
      'data':{
        'status': 'success',
        'session': session
      }
    });
  }).on('error', function(err){
    conn.end();
    event.sender.send('session-system.session.test.get.reply', {
      'app': 'operation-system-analytics-tool',
      'type': 'session-test',
      'timestamp': Date.now(),
      'data':{
        'status': 'fail',
        'session': session,
      }
    });
  }).connect(ssh_auth_config);

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
