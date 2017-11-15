const electron = require('electron');
const ipc = electron.ipcMain;

const yaml = require('js-yaml');
const fs   = require('fs');

const async = require("async");

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


// system time line

ipc.on('system-time-line.request.setup-env', function(event, config_file_path, repo_list){
  console.log('[ipc.js][system-time-line] request setup-env');
  try {
    let system_time_line_config = yaml.safeLoad(fs.readFileSync(config_file_path, 'utf8'));
    console.log(system_time_line_config);
  } catch (e) {
    console.error('[ipc.js][system-time-line] loading config file failed. Error is:');
    console.log(e);
    return;
  }

  async.eachSeries(repo_list, function(repo_object, callback){
    console.log("setup env for " + repo_object.owner + "/" + repo_object.repo);
    callback()
  }, function(err){
    if( err ) {
      console.error('[ipc.js][system-time-line]A repo is not set up.');
      console.log(err);
    } else {
      console.log('[ipc.js][system-time-line]All repos have been set up.');
    }
  });
});