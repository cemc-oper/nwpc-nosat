import React, { Component } from 'react';
import PropTypes from 'prop-types'
import moment from 'moment';
import { Form, Select, Input } from 'antd';


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
      <Form>
        <Form.Item label="统计类型">
          <Select ref="analytics_type_node"
                  value={analytics_type} onChange={this.handleChange.bind(this)}>
            <Select.Option value="date">Date</Select.Option>
            <Select.Option value="weekday">Weekday</Select.Option>
            <Select.Option value="system">System</Select.Option>
            <Select.Option value="date-hour">Hour by day</Select.Option>
            <Select.Option value="hour">Hour</Select.Option>
            <Select.Option value="grid">Grid</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="起始日期">
          <Input type="date" ref="first_date_node"
                 value={moment(first_date).format("YYYY-MM-DD")} onChange={this.handleChange.bind(this)} />
        </Form.Item>
        <Form.Item label="结束日期">
          <Input type="date" ref="last_date_node"
                 value={moment(last_date).format("YYYY-MM-DD")} onChange={this.handleChange.bind(this)} />
        </Form.Item>
      </Form>
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