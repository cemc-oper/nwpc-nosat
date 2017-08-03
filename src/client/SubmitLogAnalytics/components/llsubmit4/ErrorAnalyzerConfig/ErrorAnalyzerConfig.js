import React, { Component } from 'react';
import PropTypes from 'prop-types'

import ErrorAnalyzerCountConfig from './ErrorAnalyzerCountConfig'
import ErrorAnalyzerGridConfig from './ErrorAnalyzerGridConfig'

export default  class ErrorAnalyzerConfig extends Component{
    constructor(props) {
        super(props);
    }

    getConfig() {
        return this.refs.config_node.getConfig();
    }

    checkDate(){
        return this.refs.config_node.checkDate();
    }

    handleChange() {
        let config = this.refs.config_node.getConfig();
        const {change_handler} = this.props.handler;
        change_handler(config);
    }

    handleRunClick(event) {
        if(!this.checkDate()){
            alert("请选择有效的日期范围，结束日期无法早于起始日期。");
            return;
        }
        let {run_handler } = this.props.handler;
        run_handler();
    }

    handleChangeCommand(command){
        const {change_command_handler} = this.props.handler;
        change_command_handler(command);
    }

    render() {
        const {analyzer_config} = this.props;
        const {current_command} = analyzer_config;
        let config_box = null;
        switch(current_command){
            case 'count':
                config_box = (
                    <div>
                        <ul className="nav nav-tabs" role="tablist">
                            <li role="presentation" className="active">
                                <a href="#" onClick={this.handleChangeCommand.bind(this, 'count')}>一维</a>
                            </li>
                            <li role="presentation">
                                <a href="#" onClick={this.handleChangeCommand.bind(this, 'grid')}>二维</a>
                            </li>
                        </ul>
                        <ErrorAnalyzerCountConfig
                            ref="config_node"
                            analyzer_config={analyzer_config.command_map.count}
                            handler={{
                                change_handler: this.props.handler.change_handler.bind(this)
                            }}
                        />
                    </div>
                );
                break;
            case 'grid':
                config_box = (
                    <div>
                        <ul className="nav nav-tabs" role="tablist">
                            <li role="presentation" >
                                <a href="#" onClick={this.handleChangeCommand.bind(this, 'count')}>一维</a>
                            </li>
                            <li role="presentation" className="active">
                                <a href="#" onClick={this.handleChangeCommand.bind(this, 'grid')}>二维</a>
                            </li>
                        </ul>
                        <ErrorAnalyzerGridConfig
                            ref="config_node"
                            analyzer_config={analyzer_config.command_map.grid}
                            handler={{
                                change_handler: this.props.handler.change_handler.bind(this)
                            }}
                        />
                    </div>
                );
                break;
            default:
                config_box = ( <div>尚未支持的命令：{current_command}</div> );
                break;
        }
        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <h3 className="panel-title">统计设置</h3>
                            </div>
                            <div className="panel-body">
                                {config_box}
                                <button type="button" className="btn btn-primary pull-right"
                                        onClick={this.handleRunClick.bind(this)}>
                                    运行
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ErrorAnalyzerConfig.propTypes = {
    analyzer_config: PropTypes.shape({
        current_command: PropTypes.string,
        command_map: PropTypes.object
    }),
    handler: PropTypes.shape({
        run_handler: PropTypes.func,
        change_handler: PropTypes.func,
        change_command_handler: PropTypes.func
    })
};

