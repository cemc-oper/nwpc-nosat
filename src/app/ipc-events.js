const electron = require('electron');
const ipc = electron.ipcMain;
const { spawn } = require('child_process');
const path = require('path');

let analytics_program = {
  interpreter_path: "/cma/g3/wangdp/usr/local/bin/python3",
  script_path: "/cma/g3/wangdp/work/2016/nwpc-operation-system-tool/submit_analytics/llsubmit4_error_analyzer.py"
};


let python_exe_path = path.join(__dirname, './vendor/python/python.exe');
let submit_log_analytics_tool_path =
  path.join(__dirname, './vendor/submit-log-analytics-tool/submit_log_analytics_tool.py');




