import React, { Component, PropTypes } from 'react';
import moment from 'moment'

export default  class ErrorAnalyzerConfig extends Component{
    constructor(props) {
        super(props);
    }

    getConfig() {
        let config = Object();
        config.analytics_type = this.refs.analytics_type_node.value;
        console.log(this.refs.analytics_type_node.analytics_type);
        config.first_date = moment(this.refs.first_date_node.value);
        config.last_date = moment(this.refs.last_date_node.value);
        return config;
    }

    checkDate(){
        let first_date = moment(this.refs.first_date_node.value);
        let last_date = moment(this.refs.last_date_node.value);
        return first_date<=last_date;
    }

    handleChange() {
        let config = this.getConfig();
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

    render() {
        const { analytics_type, first_date, last_date } = this.props.analyzer_config;
        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <h3 className="panel-title">统计设置</h3>
                            </div>
                            <div className="panel-body">
                                <form>
                                    <div className="form-group">
                                        <label>统计类型</label>
                                        <select className="form-control" ref="analytics_type_node"
                                                value={analytics_type} onChange={this.handleChange.bind(this)}>
                                            <option value="date">Date</option>
                                            <option value="weekday">Weekday</option>
                                            <option value="system">System</option>
                                            <option value="date-hour">Hour by day</option>
                                            <option value="hour">Hour</option>
                                            <option value="grid">Grid</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>起始日期</label>
                                        <input type="date" className="form-control" ref="first_date_node"
                                               value={first_date.format("YYYY-MM-DD")} onChange={this.handleChange.bind(this)} />
                                    </div>
                                    <div className="form-group">
                                        <label>结束日期</label>
                                        <input type="date" className="form-control" ref="last_date_node"
                                               value={last_date.format("YYYY-MM-DD")} onChange={this.handleChange.bind(this)} />
                                    </div>
                                    <button type="button" className="btn btn-primary pull-right"
                                            onClick={this.handleRunClick.bind(this)}>
                                        运行
                                    </button>
                                </form>
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
        analytics_type: PropTypes.string,
        first_date: PropTypes.object,
        last_date: PropTypes.object,
    }),
    handler: PropTypes.shape({
        run_handler: PropTypes.func,
        change_handler: PropTypes.func
    })
};

