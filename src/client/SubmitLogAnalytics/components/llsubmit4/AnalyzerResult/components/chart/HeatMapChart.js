import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Col, Row} from 'antd'

import ErrorAnalyzerBarChart from "./echarts/ErrorAnalyzerBarChart"


export default class HeatMapChart extends Component {

  generateChartData(data){
    const {chart_engine} = this.props;
    const {value, x, y} = data;

    let map_data = value.data.map(function(item){
      return [item.x, item.y, item.value || '-'];
    });

    let max_value = Math.max(...value.data.map(function(item){return item.value;}))

    let x_axis = {
      type: 'category',
      data: x.data.map(function(item,index){
        return item.label;
      }),
      splitArea: {
        show: true
      }
    };

    let y_axis = {
      type: 'category',
      data: y.data.map(function(item,index){
        return item.label;
      }),
      splitArea: {
        show: true
      }
    };

    let s_data = {
      name: 'count',
      type: 'heatmap',
      label: {
        normal: {
          show: true
        }
      },
      data: map_data,
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    };
    let series = [s_data];

    return {
      tooltip: {
        position: 'top'
      },
      animation: false,
      grid: {
        height: '50%',
        y: '10%'
      },
      visualMap : {
        min: 0,
        max: max_value,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '15%'
      },
      xAxis: x_axis,
      yAxis: y_axis,
      series: series
    };
  }

  render() {
    let {data} = this.props;
    let chart_data = this.generateChartData(data);
    console.log("[HeatMapChart] chart_data:", chart_data);
    return (
      <div>
        <Row>
          <Col span={24}>
            <ErrorAnalyzerBarChart data={chart_data}/>
          </Col>
        </Row>
      </div>
    )
  }
};

HeatMapChart.propTypes = {
  chart_data: PropTypes.object,
  chart_engine: PropTypes.oneOf([
    'echarts'
  ])
};

HeatMapChart.defaultProps = {
  chart_engine: 'echarts'
};