import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { dispatch } from 'redux';
import { connect } from 'react-redux';
import {Link} from 'react-router';

const electron = require('electron');
const ipc_render = electron.ipcRenderer;

import {
  Layout, Row, Col, Steps,
  Form, Input, Button, Menu, Alert, Icon, message
} from 'antd';

import {ipcRenderer} from 'electron';

import {NOSTFooter} from '../Core/components/NOSTFooter';
import {NOSTHeader} from '../Core/components/NOSTHeader';

import SetupEnvPage from './containers/SetupEnvPage'

import './index.css'


const { Content } = Layout;
const { Step } = Steps;

class SystemRunningTimeAnalyticsApp extends Component{
  constructor(props) {
    super(props);
    this.state = {
      current_index: 0
    };
  }

  handleSetupEnv(config_file_path, repo_list){
    console.log(config_file_path, repo_list);
    ipc_render.send('system-time-line.request.setup-env',
      config_file_path, repo_list);
  }

  next() {
    const current_index = this.state.current_index + 1;
    this.setState({ current_index });
  }

  prev() {
    const current_index = this.state.current_index - 1;
    this.setState({ current_index });
  }

  render() {
    const { current_index } = this.state;
    const { system_running_time } = this.props;
    const { environment } = system_running_time;
    const steps = [{
      title: '创建环境',
      content: (
        <SetupEnvPage
          handler={{
            setup_env: this.handleSetupEnv.bind(this)
          }}
          environment={environment}
        />
      ),
    }, {
      title: '载入日志',
      content: 'Load Logs',
    }, {
      title: '处理数据',
      content: 'Process Data',
    }, {
      title: '生成结果',
      content: 'Generate Results',
    }, {
      title: '绘制图形',
      content: 'Plot Draws',
    }, {
      title: '清理环境',
      content: 'Cleanup Environment',
    }];

    return (
      <Layout className="layout" style={{
        minHeight: '100vh'
      }}>
        <NOSTHeader default_selected_keys={['2']} />
        <Content style={{ padding: '25px 25px 0px 25px', background: '#fff' }}>
          <div>
            <Steps current={current_index}>
              {steps.map(item => <Step key={item.title} title={item.title} />)}
            </Steps>
            <div className="steps-content" style={{ padding: '25px'}}>{steps[this.state.current_index].content}</div>
            <div className="steps-action">
              {
                current_index < steps.length - 1
                &&
                <Button type="primary" onClick={() => this.next()}>前进</Button>
              }
              {
                current_index === steps.length - 1
                &&
                <Button type="primary" onClick={() => message.success('成功!')}>完成</Button>
              }
              {
                current_index > 0
                &&
                <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                  后退
                </Button>
              }
            </div>
          </div>
        </Content>
        <NOSTFooter/>
      </Layout>
    );
  }
}

function mapStateToProps(state){
  return {
    system_running_time:state.system_running_time
  }
}

export default connect(mapStateToProps)(SystemRunningTimeAnalyticsApp)
