const electron = require('electron');
const ipc = electron.ipcMain;
const ssh2 = require('ssh2');

ipc.on('llsubmit4-error-analytics-message', function (event, auth, config) {
    console.log(auth, config);
    let command = "/cma/g3/wangdp/usr/local/bin/python3 "
        + "/cma/g3/wangdp/work/2016/nwpc-operation-system-tool/submit_analytics/llsubmit4_error_analyzer.py "
        + "count -f " + config.error_log_path + " "
        + "--type="+ config.analytics_type +" --begin-date=" + config.begin_date + " --end-date=" + config.end_date;
    let Client = ssh2.Client;
    let conn = new Client();
    conn.on('ready', function() {
        console.log('Client :: ready');
        conn.exec(command, function(err, stream) {
            let std_out = '';
            if (err) throw err;
            stream.on('close', function(code, signal) {
                console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
                conn.end();
                console.log(std_out);
                event.sender.send('llsubmit4-error-analytics-reply', std_out);
            }).on('data', function(data) {
                std_out += data;
            }).stderr.on('data', function(data) {
                console.log('STDERR: ' + data);
            });
        });
    }).connect({
        host: auth.host,
        port: auth.port,
        username: auth.user,
        password: auth.password
    });
});

ipc.on('session-system-test-session-message', function(event, session){
    let ssh_auth_config = {
        host: session.host,
        port: session.port,
        username: session.user,
        password: session.password
    };

    let Client = ssh2.Client;
    let conn = new Client();
    conn.on('ready', function() {
        conn.end();
        event.sender.send('session-system-test-session-reply', {
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
        event.sender.send('session-system-test-session-reply', {
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