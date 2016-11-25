import React, { Component, PropTypes } from 'react';
import mement from 'moment'

import SaveErrorLogDialog from './SaveErrorLogDialog'

require("./style.css");

export default  class ErrorAnalyzerDataConfig extends Component{
    constructor(props) {
        super(props);
        this.state = {
            is_save_dialog_open: false,
            working_error_log: {
                path: null,
                name: null
            }
        }
    }

    getConfig(){
        let error_log_data_config = Object();
        error_log_data_config.error_log_path = this.getErrorLogPath();
        return error_log_data_config;
    }

    getErrorLogPath(){
        let error_log_path_node = this.refs.error_log_path_node;
        return error_log_path_node.value;
    }
    getErrorLog(){
        let error_log_path_node = this.refs.error_log_path_node;
        return {
            name: null,
            path: error_log_path_node.value
        };
    }

    handleErrorLogPathChange(event){
        // let error_log_path = event.target.value;
        const { change_error_log_path_handler } = this.props.handler;
        change_error_log_path_handler(this.getErrorLogPath())
    }

    handleRequestErrorLogInfoClick(event) {
        const { request_error_log_info_handler } = this.props.handler;
        request_error_log_info_handler();
    }

    handleLoadErrorLogClick(error_log){
        const {load_error_log_handler } = this.props.handler;
        load_error_log_handler(error_log);
    }

    handleSaveClick() {
        let error_log = this.getErrorLog();
        error_log.name = null;
        this.setState({
            is_save_dialog_open: true,
            working_error_log: error_log
        });
    }

    closeSaveSessionDialog() {
        this.setState({is_save_dialog_open: false});
    }

    acceptSaveSessionDialog(error_log) {
        const {save_click_handler} = this.props.handler;
        save_click_handler(error_log);
        this.setState({is_save_dialog_open: false});
    }

    render(){
        let component = this;
        const { error_log_path, error_log_info, error_log_list } = this.props;

        let { is_save_dialog_open, working_error_log } = this.state;


        let log_info_node = null;
        if(error_log_info) {
            const { range } = error_log_info;
            const { start_date_time, end_date_time } = range;
            log_info_node = (
                <div className="row">
                    <div className="col-xs-12">
                        <div className="alert alert-info" role="alert">
                            <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <strong>日志记录时间</strong>：{start_date_time.format()} 至 {end_date_time.format()}
                        </div>
                    </div>
                </div>
            )
        }

        let log_path_nodes = error_log_list.map(function(an_error_log, index){
            return (
                <li key={index}>
                    <a href="#" onClick={component.handleLoadErrorLogClick.bind(component, an_error_log)}>
                        {an_error_log.name}
                        </a>
                </li>
            )
        });

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
                        <div className="btn-group pull-right">
                            <button className="btn btn-default"
                                    onClick={this.handleRequestErrorLogInfoClick.bind(this)}>
                                测试
                            </button>
                            <button className="btn btn-default"
                                    onClick={this.handleSaveClick.bind(this)}>
                                保存
                            </button>
                            <div className="btn-group">
                                <button className="btn btn-default" type="button">
                                    打开
                                </button>
                                <button className="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown">
                                    <span className="caret"/>
                                </button>
                                <ul className="dropdown-menu dropdown-menu-right" role="menu">
                                    <li><a href="#">日志路径窗口</a></li>
                                    <li className="divider" />
                                    { log_path_nodes }
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                { log_info_node }
                <SaveErrorLogDialog
                    is_open={is_save_dialog_open}
                    error_log={working_error_log}
                    handler={{
                        close_handler: this.closeSaveSessionDialog.bind(this),
                        save_handler: this.acceptSaveSessionDialog.bind(this)
                    }}
                />
            </div>
        )
    }
}

ErrorAnalyzerDataConfig.propTypes = {
    error_log_path: PropTypes.string,
    error_log_info: PropTypes.oneOfType(
        [
            PropTypes.object,
            PropTypes.shape({
                range: PropTypes.shape({
                    start_date_time: PropTypes.object,
                    end_date_time: PropTypes.object
                })
            })
        ]
    ),
    error_log_list: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        path: PropTypes.string,
    })),
    handler: PropTypes.shape({
        change_error_log_path_handler: PropTypes.func,
        request_error_log_info_handler: PropTypes.func,
        load_error_log_handler: PropTypes.func,
        save_click_handler: PropTypes.func
    })
};