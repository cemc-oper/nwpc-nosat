import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {Link} from 'react-router';

const electron = require('electron');
const ipc_render = electron.ipcRenderer;

import {
  Layout, Row, Col, Tabs,
  Button, message
} from 'antd';


import {NOSTFooter} from '../Core/components/NOSTFooter';
import {NOSTHeader} from '../Core/components/NOSTHeader';

import SetupEnvPage from './containers/SetupEnvPage';
import LoadLogPage from './containers/LoadLogPage';
import ProcessDataPage from './containers/ProcessDataPage';

import './index.css'
import {append_process_data_repo_command_output} from "./reducers";


const { Content } = Layout;
const TabPane = Tabs.TabPane;

class SystemRunningTimeAnalyticsApp extends Component{
  constructor(props) {
    super(props);
  }

  componentWillMount(){
    const {dispatch} = this.props;
    ipc_render.on('system-time-line.response.process-data.stdout', (event, owner, repo, data)=>{
      const repo_key = `${owner}/${repo}`;
      dispatch(append_process_data_repo_command_output({
        key: repo_key,
        data: data
      }))
    });
  }

  handleTabChange(tab_key) {
    // console.log("[SystemRunningTimeAnalyticsApp.handleTabChange] tab_key:", tab_key);
  }

  processData(params){
    const {owner, repo, begin_date, end_date, config_file_path} = params;
    ipc_render.send(
      'system-time-line.request.process-data',
      config_file_path, owner, repo, begin_date, end_date
    );
  }

  render() {
    const { system_running_time } = this.props;
    const { environment } = system_running_time;
    const tabs = [{
      title: '创建环境',
      key: 'setup-env',
      content: (
        <SetupEnvPage/>
      )
    }, {
      title: '载入日志',
      key: 'load-log',
      content: (
        <LoadLogPage/>
      )
    }, {
      title: '处理数据',
      key: 'process-data',
      content: <ProcessDataPage
        handler={{
          process_data_handler: this.processData.bind(this)
        }}
      />
    }, {
      title: '生成结果',
      key: 'generate-result',
      content: 'Generate result'
    }, {
      title: '绘制图形',
      key: 'draw-chart',
      content: 'Draw Charts'
    }, {
      title: '清理环境',
      key: 'clear-env',
      content: 'clear environment'
    }];

    const tab_panel_nodes = tabs.map(tab=>{
      return (
        <TabPane tab={tab.title} key={tab.key}>{tab.content}</TabPane>
      )
    });

    return (
      <Layout className="layout" style={{
        minHeight: '100vh'
      }}>
        <NOSTHeader default_selected_keys={['2']} />
        <Content style={{ padding: '25px 25px 0px 25px', background: '#fff' }}>
          <div>
            <Tabs defaultActiveKey={tabs[0].key} onChange={this.handleTabChange.bind(this)}>
              {tab_panel_nodes}
            </Tabs>
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
