import React, { Component, PropTypes } from 'react'
import { dispatch } from 'redux'
import { connect } from 'react-redux'
import {ipcRenderer} from 'electron'
import moment from 'moment'
import {Link} from 'react-router'

import HpcAuth from './components/HpcAuth/index'
import ErrorAnalyzerConfig from './components/llsubmit4/ErrorAnalyzerConfig/ErrorAnalyzerConfig'
import ErrorAnalyzerDataConfig from './components/llsubmit4/ErrorAnalyzerDataConfig'
import AnalyzerResult from './components/llsubmit4/AnalyzerResult/index'

import {
    requestErrorLogAnalytics,
    receiveErrorLogAnalytics,
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
            let analytics_result = JSON.parse(result);
            dispatch(receiveErrorLogAnalytics(analytics_result));
        });

        ipcRenderer.on('session-system.session.test.get.reply', function (event, result) {
            dispatch(receiveTestSessionResponse(result));
        });

        ipcRenderer.on('llsubmit4.error-log.info.get.reply', function (event, result) {
            let log_info_response = JSON.parse(result);
            dispatch(receiveErrorLogInfo(log_info_response));
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
            begin_date: command_map[current_command].first_date.format("YYYY-MM-DD"),
            end_date: moment(command_map[current_command].last_date).add(1, "days").format("YYYY-MM-DD")
        });

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

    changeErrorLogPath(error_log_path){
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
            <div>
                <nav className="navbar navbar-default" role="navigation">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <Link className="navbar-brand" to="/">Main</Link>
                        </div>
                    </div>
                </nav>
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
                        <ErrorAnalyzerDataConfig
                            ref="data_config"
                            error_log_path={error_log_path}
                            error_log_info={info}
                            error_log_list={error_log_list}
                            handler={{
                                request_error_log_info_handler: this.requestErrorLogInfo.bind(this),
                                change_error_log_path_handler: this.changeErrorLogPath.bind(this),
                                load_error_log_handler: this.handleLoadErrorLog.bind(this),
                                save_click_handler: this.handleSaveErrorLog.bind(this)
                            }}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-3">
                        <ErrorAnalyzerConfig ref="analyzer_config"
                          analyzer_config={error_log_analyzer_config}
                          handler={{
                              run_handler: this.runAnalyzer.bind(this),
                              change_handler: this.changeAnalyzerConfig.bind(this),
                              change_command_handler: this.changeAnalyzerConfigCommand.bind(this)
                          }}
                        />
                    </div>
                    <div className="col-sm-9">
                        <AnalyzerResult error_log_analyzer={error_log_analyzer}/>
                    </div>
                </div>
            </div>
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

export default connect(mapStateToProps)(SubmitLogAnalyticsApp)
