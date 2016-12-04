const electron = require('electron');
const ipc = electron.ipcMain;
const ssh2 = require('ssh2');


var analytics_program = {
    interpreter_path: "/cma/g3/wangdp/usr/local/bin/python3",
    script_path: "/cma/g3/wangdp/work/2016/nwpc-operation-system-tool/submit_analytics/llsubmit4_error_analyzer.py"
};


ipc.on('llsubmit4.error-log.analytics.get', function (event, session_config, data_config, analyzer_config) {
    console.log(session_config, data_config, analyzer_config);

    let command = "";
    switch(analyzer_config.analytics_command){
        case 'count':
            command = analytics_program.interpreter_path + " "
                + analytics_program.script_path + " "
                + "count -f " + data_config.error_log_path + " "
                + "--type="+ analyzer_config.analytics_type
                + " --begin-date=" + analyzer_config.begin_date + " --end-date=" + analyzer_config.end_date;
            break;
        case 'grid':
            command = analytics_program.interpreter_path + " "
                + analytics_program.script_path + " "
                + "grid -f " + data_config.error_log_path + " "
                + "--x-type=" + analyzer_config.x_type + " --y-type=" + analyzer_config.y_type  + " "
                + " --begin-date=" + analyzer_config.begin_date + " --end-date=" + analyzer_config.end_date;
            break;
        default:
            console.error("command not supported:", analyzer_config.analytics_command);
            return;
    }

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
                event.sender.send('llsubmit4.error-log.analytics.get.reply', std_out);
            }).on('data', function(data) {
                std_out += data;
            }).stderr.on('data', function(data) {
                console.log('STDERR: ' + data);
            });
        });
    }).connect({
        host: session_config.host,
        port: session_config.port,
        username: session_config.user,
        password: session_config.password
    });
});

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