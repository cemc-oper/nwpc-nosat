import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { Row, Col } from 'antd'


import LineChart from './LineChart'
import HeatMapChart from './HeatMapChart'

let chart_placeholder_url = require('./assert/chart_placeholder.png');

export default  class AnalyticsChart extends Component{
  constructor(props) {
    super(props);
  }

  render() {
    const {chart_data, analytics_result} = this.props;
    let empty_chart = (
      <div style={{ textAlign: 'center' }}>
        <Row type="flex" justify="center">
          <Col span={8}>
            <img src={chart_placeholder_url} />
          </Col>
        </Row>
        <Row type="flex" justify="center">
          <Col span={8}>
            <p >欢迎您的使用</p>
          </Col>
        </Row>
      </div>
    );
    if(chart_data === null){
      return empty_chart
    }
    const {data_type} = chart_data;
    if(data_type === "one-dimension"){
      const {response, request} = analytics_result.data;
      const {grid_result} = response;
      const {begin_date, end_date} = request;
      return (
        <div>
          <Row>
            <Col span={24}>
              <LineChart data={chart_data} chart_engine="echarts" />
            </Col>
          </Row>
          <Row>
            <Col span={20} offset={2}>
              <p>日志路径：{request.log_file_path}</p>
              <p>起始日期：{begin_date} 结束日期：{end_date}</p>
              <p>统计类型：{chart_data.analytics_type.command} - {chart_data.analytics_type.type}</p>
            </Col>
          </Row>
        </div>
      )
    } else if (data_type === "two-dimension" ){
      const {response, request} = analytics_result.data;
      const {grid_result} = response;
      const {log_file_path, x_type, y_type, begin_date, end_date} = request;
      return (
        <div>
          <Row>
            <Col span={24}>
              <HeatMapChart data={chart_data} chart_engine="echarts" />
            </Col>
          </Row>
          <Row>
            <Col span={20} offset={2}>
              <p>日志路径：{log_file_path}</p>
              <p>起始日期：{begin_date} 结束日期：{end_date}</p>
              <p>统计类型：{analytics_result.type} / x: {x_type}, y: {y_type}</p>
            </Col>
          </Row>
        </div>
      )
    } else {
      return empty_chart;
    }

  }
}

AnalyticsChart.propTypes = {
  chart_data: PropTypes.object,
  analytics_result: PropTypes.object
};
