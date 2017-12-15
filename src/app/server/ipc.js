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
    console.log("setup env for " + repo_object.owner + "/" + repo_object.repo);

    // console.log(
    //   python_exe_path, [
    //     system_time_line_script_path,
    //     'setup',
    //     '--config=' + system_time_line_config_path,
    //     '--owner=' + repo_object.owner,
    //     '--repo=' + repo_object.repo
    //   ]
    // );

    let env = process.env;
    env.PYTHONPATH = ".";
    const system_time_line_tool = spawn(python_exe_path, [
      system_time_line_script_path,
      'setup',
      '--config=' + system_time_line_config_path,
      '--owner=' + repo_object.owner,
      '--repo=' + repo_object.repo
    ], {
      env: {
        PYTHONPATH: system_time_line_project_base
      }
    });

    system_time_line_tool.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    system_time_line_tool.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
    });

    system_time_line_tool.on('close', (code) => {
      console.log(code);
      callback(null, code)
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
  console.log('[ipc.js][system-time-line] request load log');
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


  console.log("setup env for " + owner + "/" + repo);

  console.log(
    python_exe_path, [
      system_time_line_script_path,
      'load',
      `--config=${system_time_line_config_path}`,
      `--owner=${owner}`,
      `--repo=${repo}`,
      `--log-file=${log_file_path}`,
      `--begin-date=${begin_date}`,
      `--end-date=${end_date}`
    ]
  );

  let env = process.env;
  env.PYTHONPATH = ".";
  const system_time_line_tool = spawn(python_exe_path, [
    system_time_line_script_path,
    'load',
    `--config=${system_time_line_config_path}`,
    `--owner=${owner}`,
    `--repo=${repo}`,
    `--log-file=${log_file_path}`,
    `--begin-date=${begin_date}`,
    `--end-date=${end_date}`
  ], {
    env: {
      PYTHONPATH: system_time_line_project_base
    }
  });

  system_time_line_tool.stdout.on('data', (data) => {
    event.sender.send('system-time-line.response.load-log.stdout', owner, repo, data);
    console.log(`stdout: ${data}`);
  });

  system_time_line_tool.stderr.on('data', (data) => {
    // event.sender.send('system-time-line.response.load-log.stderr', owner, repo, data);
    console.log(`stderr: ${data}`);
  });

  system_time_line_tool.on('close', (code) => {
    console.log(code);
  });
});