# coding: utf-8
import datetime
import json
import sys
import socket

import click
from paramiko import SSHClient, AutoAddPolicy, SSHException


analytics_program = {
    'interpreter_path': "/cma/g3/wangdp/usr/local/bin/python3",
    'script_path': "/cma/g3/wangdp/work/2016/nwpc-operation-system-tool/"
                   "submit_analytics/llsubmit4_error_analyzer.py"
}


@click.group()
def cli():
    pass


@cli.command('test_connect')
@click.option('--session-config', required=True)
@click.option('--socket-config')
def test_connect(session_config, socket_config):
    request_date_time = datetime.datetime.now()
    request_time_string = request_date_time.strftime("%Y-%m-%d %H:%M:%S")

    session_config_dict = json.loads(session_config)
    host = session_config_dict['host']
    port = session_config_dict['port']
    user = session_config_dict['user']
    password = session_config_dict['password']

    s = None
    if socket_config:
        socket_flag = True
        socket_server_dict = json.loads(socket_config)
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.connect((socket_server_dict['server']['host'], socket_server_dict['server']['port']))
    else:
        socket_flag = False
        socket_server_dict = dict()

    client = SSHClient()
    client.set_missing_host_key_policy(AutoAddPolicy())
    try:
        client.connect(host, port, user, password)
    except SSHException as ssh_exception:
        result = {
            'app': 'submit_log_analytics_tool',
            'type': 'result',
            'timestamp': datetime.datetime.now().timestamp(),
            'data': {
                'request': {
                    'command': 'test_connect',
                    'session': session_config_dict
                },
                'response': {
                    'status': 'error',
                    'message': str(ssh_exception)
                }
            }
        }
        if s:
            s.send(json.dumps(result).encode('utf-8'))
        else:
            print(json.dumps(result, indent=4))
        return

    result = {
        'app': 'submit_log_analytics_tool',
        'type': 'result',
        'timestamp': datetime.datetime.now().timestamp(),
        'data': {
            'request': {
                'command': 'test_connect',
                'session': session_config_dict
            },
            'response': {
                'status': 'success',
                'message': ''
            }
        }
    }

    if s:
        s.send(json.dumps(result).encode('utf-8'))
    else:
        print(json.dumps(result, indent=4))
    return


@cli.command('get')
@click.option('--session-config', required=True)
@click.option('--data-config', required=True)
@click.option('--analyzer-config', required=True)
@click.option('--socket-config')
def get(session_config, data_config, analyzer_config, socket_config):
    request_date_time = datetime.datetime.now()
    request_time_string = request_date_time.strftime("%Y-%m-%d %H:%M:%S")

    session_config_dict = json.loads(session_config)
    data_config_dict = json.loads(data_config)
    analyzer_config_dict = json.loads(analyzer_config)
    s = None
    if socket_config:
        socket_flag = True
        socket_server_dict = json.loads(socket_config)
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.connect((socket_server_dict['server']['host'], socket_server_dict['server']['port']))
    else:
        socket_flag = False
        socket_server_dict = dict()

    host = session_config_dict['host']
    port = session_config_dict['port']
    user = session_config_dict['user']
    password = session_config_dict['password']

    if analyzer_config_dict['analytics_command'] == 'count':
        command = analytics_program['interpreter_path'] + " " \
                  + analytics_program['script_path'] + " " \
                  + "count -f " + data_config_dict['error_log_path'] + " " \
                  + "--type=" + analyzer_config_dict['analytics_type'] \
                  + " --begin-date=" + analyzer_config_dict['begin_date'] \
                  + " --end-date=" + analyzer_config_dict['end_date']
    elif analyzer_config_dict['analytics_command'] == 'grid':
        command = analytics_program['interpreter_path'] + " " \
                  + analytics_program['script_path'] + " " \
                  + "grid -f " + data_config_dict['error_log_path'] \
                  + " --x-type=" + analyzer_config_dict['x_type'] \
                  + " --y-type=" + analyzer_config_dict['y_type'] \
                  + " --begin-date=" + analyzer_config_dict['begin_date'] \
                  + " --end-date=" + analyzer_config_dict['end_date']
    else:
        print('command not supported:', analyzer_config_dict['analytics_command'])
        sys.exit(-1)

    if s:
        socket_message = {
            'app': 'submit_log_analytics_tool',
            'type': 'message',
            'timestamp': datetime.datetime.now().timestamp(),
            'data': {
                'message': '正在连接远程服务器...'
            }
        }
        s.send(json.dumps(socket_message).encode('utf-8'))

    client = SSHClient()
    client.set_missing_host_key_policy(AutoAddPolicy())
    client.connect(host, port, user, password)

    if s:
        socket_message = {
            'app': 'submit_log_analytics_tool',
            'type': 'message',
            'timestamp': datetime.datetime.now().timestamp(),
            'data': {
                'message': '正在远程服务器上执行命令...'
            }
        }
        s.send(json.dumps(socket_message).encode('utf-8'))

    stdin, stdout, stderr = client.exec_command(
        command
    )

    std_out_string = stdout.read().decode('UTF-8')
    std_error_string = stderr.read().decode('UTF-8')

    if s:
        socket_message = {
            'app': 'submit_log_analytics_tool',
            'type': 'result',
            'timestamp': datetime.datetime.now().timestamp(),
            'data': {
                'response': {
                    'std_out': std_out_string,
                    'std_err': std_error_string
                },
                'request': {
                    'command': 'get',
                    'session': session_config_dict,
                    'data': data_config_dict,
                    'analyzer': analyzer_config_dict,
                    'socket': socket_server_dict
                }
            }
        }
        s.send(json.dumps(socket_message).encode('utf-8'))
    else:
        print(std_out_string)
        print(std_error_string)

    client.close()
    return


@cli.command('info')
@click.option('--session-config', required=True)
@click.option('--data-config', required=True)
@click.option('--socket-config')
def info(session_config, data_config, socket_config):
    request_date_time = datetime.datetime.now()
    request_time_string = request_date_time.strftime("%Y-%m-%d %H:%M:%S")

    session_config_dict = json.loads(session_config)
    data_config_dict = json.loads(data_config)
    s = None
    if socket_config:
        socket_flag = True
        socket_server_dict = json.loads(socket_config)
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.connect((socket_server_dict['server']['host'], socket_server_dict['server']['port']))
    else:
        socket_flag = False
        socket_server_dict = dict()

    host = session_config_dict['host']
    port = session_config_dict['port']
    user = session_config_dict['user']
    password = session_config_dict['password']

    command = analytics_program['interpreter_path'] + " " \
        + analytics_program['script_path'] + " " \
        + "info -f " + data_config_dict['error_log_path']

    if s:
        socket_message = {
            'app': 'submit_log_analytics_tool',
            'type': 'message',
            'timestamp': datetime.datetime.now().timestamp(),
            'data': {
                'request': {
                    'command': 'info',
                    'session': session_config_dict,
                    'data': data_config_dict,
                    'socket': socket_server_dict
                },
                'message': '正在连接远程服务器...'
            }
        }
        s.send(json.dumps(socket_message).encode('utf-8'))

    client = SSHClient()
    client.set_missing_host_key_policy(AutoAddPolicy())

    try:
        client.connect(host, port, user, password)
    except SSHException as ssh_exception:
        result = {
            'app': 'submit_log_analytics_tool',
            'type': 'result',
            'timestamp': datetime.datetime.now().timestamp(),
            'data': {
                'response': {
                    'status': 'error',
                    'message': str(ssh_exception)
                },
                'request': {
                    'command': 'info',
                    'session': session_config_dict,
                    'data': data_config_dict,
                    'socket': socket_server_dict
                }
            }
        }
        if s:
            s.send(json.dumps(result).encode('utf-8'))
        else:
            print(json.dumps(result, indent=4))
        return

    if s:
        socket_message = {
            'app': 'submit_log_analytics_tool',
            'type': 'message',
            'timestamp': datetime.datetime.now().timestamp(),
            'data': {
                'request': {
                    'command': 'info',
                    'session': session_config_dict,
                    'data': data_config_dict,
                    'socket': socket_server_dict
                },
                'message': '正在远程服务器上执行命令...'
            }
        }
        s.send(json.dumps(socket_message).encode('utf-8'))

    stdin, stdout, stderr = client.exec_command(
        command
    )

    std_out_string = stdout.read().decode('UTF-8')
    std_error_string = stderr.read().decode('UTF-8')

    if s:
        socket_message = {
            'app': 'submit_log_analytics_tool',
            'type': 'result',
            'timestamp': datetime.datetime.now().timestamp(),
            'data': {
                'response': {
                    'status': 'success',
                    'std_out': std_out_string,
                    'std_err': std_error_string
                },
                'request': {
                    'command': 'info',
                    'session': session_config_dict,
                    'data': data_config_dict,
                    'socket': socket_server_dict
                }
            }
        }
        s.send(json.dumps(socket_message).encode('utf-8'))
    else:
        print(std_out_string)
        print(std_error_string)

    client.close()
    return


if __name__ == "__main__":
    cli()
