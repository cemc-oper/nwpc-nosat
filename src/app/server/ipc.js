const electron = require('electron');
const ipc = electron.ipcMain;
const { spawn } = require('child_process');

const yaml = require('js-yaml');
const fs   = require('fs');
const path = require('path');

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

function run_system_time_line_command(
  sub_command, config_file_path, params, event_config
){
  console.log('[ipc.js][run_system_time_line_command] begin');
  let system_running_time_analytics_config = null;
  try {
    config = yaml.safeLoad(fs.readFileSync(config_file_path, 'utf8'));
    system_running_time_analytics_config = config['system_running_time_analytics'];
    console.log(system_running_time_analytics_config);
  } catch (e) {
    console.error('[ipc.js][run_system_time_line_command] loading config file failed. Error is:');
    console.log(e);
    return;
  }

  let system_time_line_config = system_running_time_analytics_config['system_time_line']['config'];
  let system_time_line_project_base = system_running_time_analytics_config['system_time_line']['project']['base'];
  let python_exe_path = system_running_time_analytics_config['system_time_line']['python']['exe_path'];

  let system_time_line_config_path = path.join(
    path.dirname(config_file_path),
    system_time_line_config
  );

  let system_time_line_script_path = path.join(
    system_time_line_project_base,
    './nwpc_system_time_line/system_time_line_tool.py'
  );

  let param_array = [
    system_time_line_script_path,
    sub_command,
    `--config=${system_time_line_config_path}`
  ].concat(params);

  console.log(
    python_exe_path, param_array
  );

  let env = process.env;
  env.PYTHONPATH = ".";
  const system_time_line_tool = spawn(python_exe_path, param_array, {
    env: {
      PYTHONPATH: system_time_line_project_base
    }
  });

  system_time_line_tool.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
    if('stdout' in event_config){
      const config = event_config['stdout'];
      const sender = config['sender'];
      sender.send(config['channel'], ...config['params'], data);
    }
  });

  system_time_line_tool.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
    if('stderr' in event_config){
      const config = event_config['stderr'];
      const sender = config['sender'];
      sender.send(config['channel'], ...config['params'], data);
    }
  });

  system_time_line_tool.on('close', (code) => {
    console.log(code);
    if('close' in event_config){
      const config = event_config['close'];
      const action_type = config['action_type'];
      if(action_type === "callback"){
        const callback = config['callback'];
        callback(code);
      }
    }
  });
}


ipc.on('system-time-line.request.setup-env', function(event, config_file_path, repo_list){
  console.log('[ipc.js][system-time-line] request setup-env');
  let system_running_time_analytics_config = null;
  try {
    config = yaml.safeLoad(fs.readFileSync(config_file_path, 'utf8'));
    system_running_time_analytics_config = config['system_running_time_analytics'];
    console.log(system_running_time_analytics_config);
  } catch (e) {
    console.error('[ipc.js][system-time-line] loading config file failed. Error is:');
    console.log(e);
    return;
  }

  let system_time_line_config = system_running_time_analytics_config['system_time_line']['config'];
  let system_time_line_project_base = system_running_time_analytics_config['system_time_line']['project']['base'];
  let python_exe_path = system_running_time_analytics_config['system_time_line']['python']['exe_path'];

  let system_time_line_config_path = path.join(
    path.dirname(config_file_path),
    system_time_line_config
  );

  let system_time_line_script_path = path.join(
    system_time_line_project_base,
    './nwpc_system_time_line/system_time_line_tool.py'
  );

  async.eachSeries(repo_list, function(repo_object, callback){
    console.log(`setup env for ${repo_object.owner}/${repo_object.repo}`);

    let params = [
      `--owner=${repo_object.owner}`,
      `--repo=${repo_object.repo}`
    ];

    run_system_time_line_command('setup', config_file_path, params, {
      close: {
        action_type: 'callback',
        callback: function(code){
          callback(null, code);
        }
      }
    });


  }, function(err, code){
    console.log("[system-time-line.request.setup-env'] results:", code);
    if( err ) {
      console.error('[ipc.js][system-time-line]A repo is not set up.');
      console.log(err);
    } else {
      console.log('[ipc.js][system-time-line]All repos have been set up.');
    }
  });
});


ipc.on('system-time-line.request.load-log', function(
  event, config_file_path, owner, repo, log_file_path, begin_date, end_date
){
  console.log('[ipc.js][system-time-line] request load-log');


  let params = [
    `--owner=${owner}`,
    `--repo=${repo}`,
    `--log-file=${log_file_path}`,
    `--begin-date=${begin_date}`,
    `--end-date=${end_date}`
  ];

  run_system_time_line_command('load', config_file_path, params, {
    stdout: {
      channel: 'system-time-line.response.load-log.stdout',
      params: [owner, repo],
      sender: event.sender
    }
  });


});

ipc.on('system-time-line.request.process-data', function(
  event, config_file_path, owner, repo, begin_date, end_date
){
  console.log('[ipc.js][system-time-line] request process data');


  let params = [
    `--owner=${owner}`,
    `--repo=${repo}`,
    `--begin-date=${begin_date}`,
    `--end-date=${end_date}`
  ];

  run_system_time_line_command('process', config_file_path, params, {
    stdout: {
      channel: 'system-time-line.response.process-data.stdout',
      params: [owner, repo],
      sender: event.sender
    }
  });
});

ipc.on('system-time-line.request.generate-result', function(
  event, config_file_path, begin_date, end_date, output_dir
){
  console.log('[ipc.js][system-time-line] request generate result');

  let params = [
    `--begin-date=${begin_date}`,
    `--end-date=${end_date}`,
    `--output-dir=${output_dir}`
  ];

  run_system_time_line_command('generate', config_file_path, params, {
    stdout: {
      channel: 'system-time-line.response.generate-result.stdout',
      params: [],
      sender: event.sender
    }
  });
});