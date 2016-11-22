import React, { Component, PropTypes } from 'react';
require("./style.css");

export default  class ErrorAnalyticsDataConfig extends Component{
    constructor(props) {
        super(props);
    }

    getErrorLogPath(){
        let error_log_path_node = this.refs.error_log_path_node;
        return error_log_path_node.value;
    }

    handleErrorLogPathChange(event){
        // let error_log_path = event.target.value;
        const { change_error_log_path_handler } = this.props.handler;
        change_error_log_path_handler(this.getErrorLogPath())
    }

    handleRequestErrorLogInfoClick(event) {

    }

    render(){
        const { error_log_path, error_log_info } = this.props;
        let log_info_node = null;
        if(error_log_info) {
            const { range } = error_log_info;
            const { start_date_time, end_date_time } = range;
            log_info_node = (
                <div className="row config-row">
                    <div className="col-xs-12">
                        <p type="text-info"> 日志记录时间：{start_date_time} - {end_date_time} </p>
                    </div>
                </div>
            )
        }
        return (
            <div>
                <h4>错误日志路径</h4>
                <div className="row config-row">
                    <div className="col-xs-9">
                        <input
                            type="text" className="form-control"
                            ref="error_log_path_node"
                            value={error_log_path}
                            onChange={this.handleErrorLogPathChange.bind(this)}
                        />
                    </div>
                    <div className="col-xs-3">
                        <button className="btn btn-default"
                                onChange={this.handleRequestErrorLogInfoClick.bind(this)}>
                            获取信息
                        </button>
                        <button className="btn btn-default">
                            保存
                        </button>
                        <button className="btn btn-default">
                            载入
                        </button>
                    </div>
                </div>
                { log_info_node }
            </div>
        )
    }
}

ErrorAnalyticsDataConfig.propTypes = {
    error_log_path: PropTypes.string,
    error_log_info: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.shape({
                range: PropTypes.shape({
                    start_date_time: PropTypes.object,
                    end_date_time: PropTypes.object
                })
            })
        ]
    ),
    handler: PropTypes.shape({
        change_error_log_path_handler: PropTypes.func,
        request_error_log_info_handler: PropTypes.func
    })
};