import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { dispatch } from 'redux'
import { connect } from 'react-redux'
import {ipcRenderer} from 'electron'
import moment from 'moment'
import {Link} from 'react-router'

import {
  Layout, Row, Col,
  Form, Input, Button, Menu, Alert, Icon
} from 'antd';

import "../Core/containers/nost_box.scss"

const { Header, Footer, Content } = Layout;


import HpcAuth from './components/HpcAuth/index'
import ErrorAnalyzerConfig from './components/llsubmit4/ErrorAnalyzerConfig/ErrorAnalyzerConfig'
import ErrorAnalyzerDataConfig from './components/llsubmit4/ErrorAnalyzerDataConfig'
import AnalyzerResult from './components/llsubmit4/AnalyzerResult/index'

import {NOSTFooter} from '../Core/components/NOSTFooter';
import {NOSTHeader} from '../Core/components/NOSTHeader';

import {
  requestErrorLogAnalytics,
  receiveErrorLogAnalytics,
  receiveErrorLogAnalyticsFailure,
  receiveErrorLogAnalyticsMessage,
  changeErrorLogPath,
  loadErrorLog,
  saveErrorLog,
  requestErrorLogInfo,
  receiveErrorLogInfo,
  changeAnalyzerConfig,
  changeAnalyzerConfigCommand
} from './actions/llsubmit4_error_log_action'

import { saveSession, loadSession, requestTestSession, receiveTestSessionResponse} from './actions/session_action'

class SubmitLogAnalyticsApp extends Component{
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { dispatch } = this.props;

    ipcRenderer.on('llsubmit4.error-log.analytics.get.reply', function (event, result) {
      console.log('llsubmit4.error-log.analytics.get.reply');
      let analytics_result = JSON.parse(result);
      dispatch(receiveErrorLogAnalytics(analytics_result));
    });

    ipcRenderer.on('llsubmit4.error-log.analytics.get.reply.error', function (event) {
      console.log('llsubmit4.error-log.analytics.get.reply.error');
      dispatch(receiveErrorLogAnalyticsFailure());
    });

    ipcRenderer.on('session-system.session.test.get.reply', function (event, result) {
      console.log('session-system.session.test.get.reply');
      dispatch(receiveTestSessionResponse(result));
    });

    ipcRenderer.on('llsubmit4.error-log.info.get.reply', function (event, result) {
      console.log('llsubmit4.error-log.info.get.reply');
      let log_info_response = JSON.parse(result);
      dispatch(receiveErrorLogInfo(log_info_response));
    });

    ipcRenderer.on('llsubmit4.error-log.analytics.message', function (event, message) {
      console.log("[SubmitLogAnalyticsApp.componentDidMount] llsubmit4.error-log.analytics.message", message);
      dispatch(receiveErrorLogAnalyticsMessage(message));
    });

    // this.runAnalyzer();
  }

  runAnalyzer() {
    let session = this.refs.hpc_auth.getSession();
    let data_config = this.refs.data_config.getConfig();

    let {error_log_analyzer_config} = this.props;

    let {current_command, command_map} = error_log_analyzer_config;
    let send_analyzer_config =  Object.assign({}, command_map[current_command], {
      command_map: command_map,
      begin_date: moment(command_map[current_command].first_date).format("YYYY-MM-DD"),
      end_date: moment(command_map[current_command].last_date).add(1, "days").format("YYYY-MM-DD")
    });
    console.log(send_analyzer_config);

    const {dispatch} = this.props;
    dispatch(requestErrorLogAnalytics());
    ipcRenderer.send('llsubmit4.error-log.analytics.get', session, data_config, send_analyzer_config);
  }

  testSession(session) {
    const { dispatch } = this.props;
    dispatch(requestTestSession(session));
    ipcRenderer.send('session-system.session.test.get', session);
  }

  saveSession(session) {
    const { dispatch } = this.props;
    dispatch(saveSession(session));
  }

  loadSession(session) {
    const { dispatch } = this.props;
    dispatch(loadSession(session));
  }

  requestErrorLogInfo(){
    const { current_session } = this.props.session_system;
    const { error_log_data_config } = this.props;

    const { dispatch } = this.props;
    ipcRenderer.send('llsubmit4.error-log.info.get',
      current_session, error_log_data_config.error_log_path);
    dispatch(requestErrorLogInfo(current_session));
  }

  handleChangeErrorLogPath(error_log_path){
    // console.log("[SubmitLogAnalyticsApp.handleChangeErrorLogPath]", this);
    const { dispatch } = this.props;
    dispatch(changeErrorLogPath(error_log_path));
  }

  handleLoadErrorLog(error_log){
    const { dispatch } = this.props;
    dispatch(loadErrorLog(error_log));
  }

  handleSaveErrorLog(error_log){
    const { dispatch } = this.props;
    dispatch(saveErrorLog(error_log));
  }

  changeAnalyzerConfig(config){
    const { dispatch } = this.props;
    dispatch(changeAnalyzerConfig(config));
  }

  changeAnalyzerConfigCommand(command){
    const { dispatch } = this.props;
    dispatch(changeAnalyzerConfigCommand(command));
  }

  render() {
    const { error_log_analyzer, session_system, error_log_data_config, error_log_analyzer_config } = this.props;
    const { session_list, current_session, test_session } = session_system;
    const { error_log_path, info, error_log_list } = error_log_data_config;
    return (
      <Layout className="layout" style={{ height: '100vh' }}>
        <NOSTHeader default_selected_keys={['1']} />
        <Content style={{padding: '25px 25px 0px 25px'}}>
          <Row>
            <Col span={24}>
              <HpcAuth
                ref="hpc_auth"
                current_session={current_session}
                handler={{
                  test_click_handler: this.testSession.bind(this),
                  save_click_handler: this.saveSession.bind(this),
                  load_session_handler: this.loadSession.bind(this),
                  bar_editor_change_handler: this.loadSession.bind(this)
                }}
                session_list={session_list}
                test_session={test_session}
              />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <ErrorAnalyzerDataConfig
                ref="data_config"
                error_log_path={error_log_path}
                error_log_info={info}
                error_log_list={error_log_list}
                handler={{
                  request_error_log_info_handler: this.requestErrorLogInfo.bind(this),
                  change_error_log_path_handler: this.handleChangeErrorLogPath.bind(this),
                  load_error_log_handler: this.handleLoadErrorLog.bind(this),
                  save_click_handler: this.handleSaveErrorLog.bind(this)
                }}
              />
            </Col>
          </Row>
          <Row gutter={8}>
            <Col span={6}>
              <ErrorAnalyzerConfig
                ref="analyzer_config"
                analyzer_config={error_log_analyzer_config}
                handler={{
                  run_handler: this.runAnalyzer.bind(this),
                  change_handler: this.changeAnalyzerConfig.bind(this),
                  change_command_handler: this.changeAnalyzerConfigCommand.bind(this)
                }}
              />
            </Col>
            <Col span={18}>
              <AnalyzerResult error_log_analyzer={error_log_analyzer}/>
            </Col>
          </Row>
        </Content>
        <NOSTFooter />
      </Layout>
    );
  }
}

SubmitLogAnalyticsApp.propTypes = {
  error_log_analyzer: PropTypes.shape({
    status: PropTypes.shape({
      is_fetching: PropTypes.bool
    }),
    analytics_result: PropTypes.object
  }),
  session_system: PropTypes.shape({
    session_list: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string
    })),
    current_session: PropTypes.object,
    test_session: PropTypes.object
  }),
  error_log_data_config: PropTypes.shape({
    error_log_path: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string
    ]),
    info: PropTypes.object,
    error_log_list: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      path: PropTypes.string,
    }))
  }),
  error_log_analyzer_config: PropTypes.shape({
    current_command: PropTypes.string,
    command_map: PropTypes.object
  }),
};


function mapStateToProps(state){
  return {
    error_log_analyzer: state.llsubmit4_error_log.error_log_analyzer,
    session_system: state.session_system,
    error_log_data_config: state.llsubmit4_error_log.error_log_data_config,
    error_log_analyzer_config: state.llsubmit4_error_log.error_log_analyzer_config
  }
}

export default connect(
  mapStateToProps
)(SubmitLogAnalyticsApp)
