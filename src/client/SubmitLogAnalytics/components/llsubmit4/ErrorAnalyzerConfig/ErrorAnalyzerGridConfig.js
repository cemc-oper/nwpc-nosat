import React, { Component } from 'react';
import PropTypes from 'prop-types'
import moment from 'moment';
import { Form, Select, Input } from 'antd'


export default class ErrorAnalyzerGridConfig extends Component {

  getConfig() {
    let config = Object();
    config.analytics_command = 'grid';
    config.x_type = this.refs.x_type_node.value;
    config.y_type = this.refs.y_type_node.value;
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
    const {first_date, last_date, x_type, y_type} = analyzer_config;
    return (
      <Form>
        <Form.Item label="X轴类型">
          <Select ref="x_type_node" value={x_type} onChange={this.handleChange.bind(this)}>
            <Select.Option value="hour">Hour</Select.Option>
            <Select.Option value="weekday">Weekday</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Y轴类型">
          <Select ref="y_type_node" value={y_type} onChange={this.handleChange.bind(this)}>
            <Select.Option value="date">Date</Select.Option>
            <Select.Option value="weekday">Weekday</Select.Option>
            <Select.Option value="system">System</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="起始日期">
          <input type="date" ref="first_date_node"
                 value={moment(first_date).format("YYYY-MM-DD")} onChange={this.handleChange.bind(this)} />
        </Form.Item>
        <Form.Item label="结束日期">
          <input type="date" ref="last_date_node"
                 value={moment(last_date).format("YYYY-MM-DD")} onChange={this.handleChange.bind(this)} />
        </Form.Item>
      </Form>
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