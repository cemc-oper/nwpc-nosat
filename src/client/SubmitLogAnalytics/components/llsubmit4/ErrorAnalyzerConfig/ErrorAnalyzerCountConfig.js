import React, { Component } from 'react';
import PropTypes from 'prop-types'
import moment from 'moment';


export default class ErrorAnalyzerCountConfig extends Component {

    getConfig() {
        let config = Object();
        config.analytics_command = 'count';
        config.analytics_type = this.refs.analytics_type_node.value;
        config.first_date = moment(this.refs.first_date_node.value).toDate();
        config.last_date = moment(this.refs.last_date_node.value).toDate();
        return config;
    }

    handleChange() {
        let config = this.getConfig();
        const {change_handler} = this.props.handler;
        change_handler(config);
    }

    checkDate(){
        let first_date = moment(this.refs.first_date_node.value);
        let last_date = moment(this.refs.last_date_node.value);
        return first_date<=last_date;
    }

    render() {
        const {analyzer_config} = this.props;
        const {analytics_type, first_date, last_date} = analyzer_config;
        return (
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
                           value={moment(first_date).format("YYYY-MM-DD")} onChange={this.handleChange.bind(this)} />
                </div>
                <div className="form-group">
                    <label>结束日期</label>
                    <input type="date" className="form-control" ref="last_date_node"
                           value={moment(last_date).format("YYYY-MM-DD")} onChange={this.handleChange.bind(this)} />
                </div>
            </form>
        )
    }
}

ErrorAnalyzerCountConfig.propTypes = {
    analyzer_config: PropTypes.shape({
        analyzer_command: PropTypes.string,
        analytics_type: PropTypes.string,
        first_date: PropTypes.object,
        last_date: PropTypes.object,
    }),
    handler: PropTypes.shape({
        change_handler: PropTypes.func
    })
};