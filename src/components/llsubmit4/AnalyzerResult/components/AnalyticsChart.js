import React, { Component, PropTypes } from 'react';
import * as d3time from 'd3-time'
import * as d3_time_format from 'd3-time-format'
import * as d3_format from 'd3-format'
import * as d3_array from 'd3-array'

import LineChart from './LineChart'

let chart_placeholder_url = require('../assert/chart_placeholder.png');

export default  class AnalyticsChart extends Component{
    constructor(props) {
        super(props);
    }

    render() {
        const {chart_data, analytics_result} = this.props;
        let empty_chart = (
            <div className="row">
                <div className="col-xs-4 col-xs-offset-4 text-center">
                    <img src={chart_placeholder_url} />
                </div>
                <div className="col-xs-4 col-xs-offset-4 text-center">
                    <p>欢迎您的使用</p>
                </div>
            </div>
        );
        if(chart_data === null){
            return empty_chart
        }
        const {data_type} = chart_data;
        if(data_type == "one-dimension"){
            const {response, request} = analytics_result.data;
            const {grid_result} = response;
            const {begin_date, end_date} = request;
            return (
                <div>
                    <div className="row">
                        <div className="col-xs-12">
                            <LineChart data={chart_data} chart_engine="echarts" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-10 col-xs-offset-1">
                            <p>日志路径：{request.log_file_path}</p>
                            <p>起始日期：{begin_date} 结束日期：{end_date}</p>
                            <p>统计类型：{chart_data.analytics_type.command} - {chart_data.analytics_type.type}</p>
                        </div>
                    </div>
                </div>
            )
        } else if (data_type == "two-dimension" ){
            const {response, request} = analytics_result.data;
            const {grid_result} = response;
            const {log_file_path, x_type, y_type, begin_date, end_date} = request;
            return (
                <div>
                    <div className="row">
                        <div className="col-xs-10 col-xs-offset-1">
                            <p>日志路径：{log_file_path}</p>
                            <p>起始日期：{begin_date} 结束日期：{end_date}</p>
                            <p>统计类型：{analytics_result.type} / x: {x_type}, y: {y_type}</p>
                        </div>
                    </div>
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
