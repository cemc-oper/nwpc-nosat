import React, { Component, PropTypes } from 'react'
import { dispatch } from 'redux'
import { connect } from 'react-redux'
import {ipcRenderer} from 'electron'
// const electron = require('electron');

import HpcAuth from '../components/HpcAuth/index'
import ErrorAnalyzerConfig from '../components/ErrorAnalyzerConfig'
import AnalyticsChart from '../components/AnalyticsChart'

import {receiveAnalyticsResult} from '../actions/llsubmit4_error_log_action'

class OperationSystemAnalyticsApp extends Component{
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { dispatch } = this.props;
        ipcRenderer.on('llsubmit4-error-analytics-reply', function (event, result) {
            let analytics_result = JSON.parse(result);
            dispatch(receiveAnalyticsResult(analytics_result));
        })
    }

    handleRunClick() {
        let auth = this.refs.hpc_auth.getAuth();
        let config = this.refs.error_analyzer_config.getConfig();

        ipcRenderer.send('llsubmit4-error-analytics-message', auth, config);
    }

    render() {
        const { analytics_chart } = this.props;
        const { analytics_result } = analytics_chart;
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-sm-12">
                        <HpcAuth ref="hpc_auth"
                                 current_session={{
                                     host: "uranus-bk.hpc.nmic.cn",
                                     port: 22,
                                     user: "nwp",
                                     password: "nwpop"
                                 }}
                        />
                        </div>
                    </div>
                <div className="row">
                    <div className="col-sm-4">
                        <ErrorAnalyzerConfig ref="error_analyzer_config"
                          error_log_path="/cma/g1/nwp/sublog/llsubmit4.error.log"
                          analytics_type="day"
                          begin_date="2016-11-07"
                          end_date="2016-11-14"/>
                        <div className="row">
                            <div className="col-sm-12">
                            <form>
                                <div className="form-group">
                                    <button type="button" className="btn btn-primary"
                                        onClick={this.handleRunClick.bind(this)}>
                                        运行
                                        </button>
                                </div>
                            </form>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-8">
                        <div className="panel panel-success">
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
        }))
    })
};


function mapStateToProps(state){
    return {
        analytics_chart: state.llsubmit4_error_log.analytics_chart,
        session_system: state.session_system
    }
}

export default connect(mapStateToProps)(OperationSystemAnalyticsApp)
