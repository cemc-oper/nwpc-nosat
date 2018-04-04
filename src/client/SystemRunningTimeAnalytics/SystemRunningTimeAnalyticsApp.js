import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';

const electron = require('electron');
const ipc_render = electron.ipcRenderer;

import {
  Layout, Tabs
} from 'antd';


import {NOSATFooter} from '../Core/components/NOSATFooter';
import {NOSATHeader} from '../Core/components/NOSATHeader';

import SetupEnvPage from './containers/SetupEnvPage';
import LoadLogPage from './containers/LoadLogPage';
import ProcessDataPage from './containers/ProcessDataPage';
import GenerateResultPage from './containers/GenerateResultPage';
import PlotChartPage from './containers/PlotChartPage';
import ClearEnvPage from './containers/ClearEnvPage';

import './index.scss'
import {
  append_process_data_repo_command_output,
  append_generate_data_command_output,
  append_plot_chart_command_output
} from "./reducers";


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

    ipc_render.on('system-time-line.response.generate-result.stdout', (event, data)=>{
      dispatch(append_generate_data_command_output({
        data: data
      }))
    });

    ipc_render.on('system-time-line.response.plot_chart.stdout', (event, data)=>{
      dispatch(append_plot_chart_command_output({
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

  generateResult(params){
    const {config_file_path, begin_date, end_date, output_dir} = params;
    ipc_render.send(
      'system-time-line.request.generate-result',
      config_file_path, begin_date, end_date, output_dir
    );
  }

  plotChart(params){
    const {config_file_path, begin_date, end_date, data_dir, output_dir} = params;
    ipc_render.send(
      'system-time-line.request.plot-chart',
      config_file_path, begin_date, end_date, data_dir, output_dir
    );
  }

  clearEnv(params){
    const {config_file_path, repo_list} = params;

    ipc_render.send('system-time-line.request.clear-env',
      config_file_path, repo_list);
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
      content: <GenerateResultPage
        handler={{
          generate_result_handler: this.generateResult.bind(this)
        }}
        />
    }, {
      title: '绘制图形',
      key: 'draw-chart',
      content: <PlotChartPage
        handler={{
          plot_chart_handler: this.plotChart.bind(this)
        }}
        />
    }, {
      title: '清理环境',
      key: 'clear-env',
      content: (<ClearEnvPage
        handler={{
          clear_env_handler: this.clearEnv.bind(this)
        }}
      />)
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
        <NOSATHeader default_selected_keys={['2']} />
        <Content style={{ padding: '25px 25px 0px 25px', background: '#fff' }}>
          <div>
            <Tabs defaultActiveKey={tabs[0].key} onChange={this.handleTabChange.bind(this)}>
              {tab_panel_nodes}
            </Tabs>
          </div>
        </Content>
        <NOSATFooter/>
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
