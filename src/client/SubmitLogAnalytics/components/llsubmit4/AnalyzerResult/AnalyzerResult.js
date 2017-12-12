import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Row, Col, Card} from 'antd'

import AnalyticsChart from './components/chart/AnalyticsChart'

import OneDimensionDataGenerator from './components/OneDimensionDataGenerator'
import TwoDimensionDataGenerator from './components/TwoDimensionDataGenerator'


export default class AnalyzerResult extends Component{
  constructor(props){
    super(props);
  }

  static generateChartData(analytics_result) {
    if(analytics_result===null){
      return null;
    }
    let chart_data = {};
    const {data, type} = analytics_result;
    if(type === 'count') {
      return OneDimensionDataGenerator.generateData(analytics_result);
    } else if (type === 'grid') {
      return TwoDimensionDataGenerator.generateData(analytics_result);
    } else {
      console.error("not supported analytics type:", type);
      return null;
    }
  }

  render(){
    const { error_log_analyzer } = this.props;
    const { analytics_result, status, dialog_content } = error_log_analyzer;
    // console.log("[AnalyzerResult.render] dialog_content:", dialog_content);

    // console.log("[AnalyzerResult]analytics_result", analytics_result);
    let chart_data = AnalyzerResult.generateChartData(analytics_result);
    // console.log("[AnalyzerResult]", chart_data);

    return (
      <Card title="统计结果">
        <Row>
          <Col span={24}>
            <AnalyticsChart chart_data={chart_data} analytics_result={analytics_result}/>
          </Col>
        </Row>
      </Card>
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
