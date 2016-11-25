import React, { Component, PropTypes } from 'react'

import AnalyticsChart from './components/AnalyticsChart'
import WaitingAnalyzerDialog from './components/WaitingAnalyzerDialog'

export default class AnalyzerResult extends Component{

    render(){
        const { error_log_analyzer } = this.props;
        const { analytics_result, status } = error_log_analyzer;
        return (
            <div>
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <h3 className="panel-title">统计结果</h3>
                    </div>
                    <div className="panel-body">
                        <div className="row">
                            <div className="col-xs-12">
                                <AnalyticsChart analytics_result={analytics_result} />
                            </div>
                        </div>
                    </div>
                </div>
                <WaitingAnalyzerDialog is_open={status.is_fetching} handler={{
                    close_handler: function(){}
                }}/>
            </div>
        )
    }
}

AnalyzerResult.propTypes = {
    error_log_analyzer: PropTypes.shape({
        status: PropTypes.shape({
            is_fetching: PropTypes.bool
        }),
        analytics_result: PropTypes.object
    })
};
