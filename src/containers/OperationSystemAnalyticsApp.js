import React, { Component, PropTypes } from 'react'
import { dispatch } from 'redux'
import { connect } from 'react-redux'
import {ipcRenderer} from 'electron'
// const electron = require('electron');

import HpcAuth from '../components/HpcAuth/index'
import ErrorAnalyzerConfig from '../components/ErrorAnalyzerConfig'
import AnalyticsChart from '../components/AnalyticsChart'
import ErrorAnalyticsDataConfig from '../components/llsubmit4/ErrorAnalyticsDataConfig'

import {
    receiveAnalyticsResult,
    changeErrorLogPath,
    requestErrorLogInfo,
    receiveErrorLogInfo
} from '../actions/llsubmit4_error_log_action'

import { saveSession, loadSession, requestTestSession, receiveTestSessionResponse} from '../actions/session_action'

class OperationSystemAnalyticsApp extends Component{
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { dispatch } = this.props;
        ipcRenderer.on('llsubmit4.error-log.analytics.get.reply', function (event, result) {
            let analytics_result = JSON.parse(result);
            dispatch(receiveAnalyticsResult(analytics_result));
        });

        ipcRenderer.on('session-system.session.test.get.reply', function (event, result) {
            dispatch(receiveTestSessionResponse(result));
        });

        ipcRenderer.on('llsubmit4.error-log.info.get.reply', function (event, result) {
            let log_info_response = JSON.parse(result);
            dispatch(receiveErrorLogInfo(log_info_response));
        })
    }

    runAnalyzer() {
        let session = this.refs.hpc_auth.getSession();
        let data_config = this.refs.data_config.getConfig();
        let analyzer_config = this.refs.analyzer_config.getConfig();

        ipcRenderer.send('llsubmit4.error-log.analytics.get', session, data_config, analyzer_config);
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

    changeErrorLogPath(error_log_path){
        const { dispatch } = this.props;
        dispatch(changeErrorLogPath(error_log_path));
    }

    render() {
        const { analytics_chart, session_system, error_log_data_config } = this.props;
        const { analytics_result } = analytics_chart;
        const { session_list, current_session, test_session } = session_system;
        const { error_log_path, info } = error_log_data_config;
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-sm-12">
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
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12">
                        <ErrorAnalyticsDataConfig
                            ref="data_config"
                            error_log_path={error_log_path}
                            error_log_info={info}
                            handler={{
                                request_error_log_info_handler: this.requestErrorLogInfo.bind(this),
                                change_error_log_path_handler: this.changeErrorLogPath.bind(this),
                            }}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-3">
                        <ErrorAnalyzerConfig ref="analyzer_config"
                          analytics_type="day"
                          begin_date="2016-11-07"
                          end_date="2016-11-14"
                          handler={{
                              run_handler: this.runAnalyzer.bind(this)
                          }}
                        />
                    </div>
                    <div className="col-sm-9">
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <h3 className="panel-title">统计结果</h3>
                            </div>
                            <div className="panel-body">
                                <AnalyticsChart
                                    analytics_result={analytics_result}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

OperationSystemAnalyticsApp.propTypes = {
    analytics_chart: PropTypes.shape({
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
        info: PropTypes.object
    })
};


function mapStateToProps(state){
    return {
        analytics_chart: state.llsubmit4_error_log.analytics_chart,
        session_system: state.session_system,
        error_log_data_config: state.llsubmit4_error_log.error_log_data_config
    }
}

export default connect(mapStateToProps)(OperationSystemAnalyticsApp)
