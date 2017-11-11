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

  let setup_repo_function = repo_list.map(function(repo_object){
      return function(callback){
        console.log(repo_object.owner, repo_object.repo);
      }
  });

  async.series(setup_repo_function, function(err, results){

  });


});