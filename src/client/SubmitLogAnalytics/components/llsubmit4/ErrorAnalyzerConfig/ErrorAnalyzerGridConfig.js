import React, { Component } from 'react';
import PropTypes from 'prop-types'
import moment from 'moment';


export default class ErrorAnalyzerGridConfig extends Component {

    getConfig() {
        let config = Object();
        config.analytics_command = 'grid';
        config.x_type = this.refs.x_type_node.value;
        config.y_type = this.refs.y_type_node.value;
        config.first_date = moment(this.refs.first_date_node.value);
        config.last_date = moment(this.refs.last_date_node.value);
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
        const {first_date, last_date, x_type, y_type} = analyzer_config;
        return (
            <form>
                <div className="form-group">
                    <label>X轴类型</label>
                    <select className="form-control" ref="x_type_node"
                            value={x_type} onChange={this.handleChange.bind(this)}>
                        <option value="hour">Hour</option>
                        <option value="weekday">Weekday</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Y轴类型</label>
                    <select className="form-control" ref="y_type_node"
                            value={y_type} onChange={this.handleChange.bind(this)}>
                        <option value="date">Date</option>
                        <option value="weekday">Weekday</option>
                        <option value="system">System</option>
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
            </form>
        )
    }
}

ErrorAnalyzerGridConfig.propTypes = {
    analyzer_config: PropTypes.shape({
        analyzer_command: PropTypes.string,
        first_date: PropTypes.object,
        last_date: PropTypes.object,
        x_type: PropTypes.string,
        y_type: PropTypes.string
    }),
    handler: PropTypes.shape({
        change_handler: PropTypes.func
    })
};