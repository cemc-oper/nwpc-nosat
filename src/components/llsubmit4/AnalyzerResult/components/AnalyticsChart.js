import React, { Component, PropTypes } from 'react';
import * as d3time from 'd3-time'
import * as d3_time_format from 'd3-time-format'
import * as d3_format from 'd3-format'
import * as d3_array from 'd3-array'
import ErrorAnalyzerBarChart from "./ErrorAnalyzerBarChart"
let chart_placeholder_url = require('./chart_placeholder.png');

export default  class AnalyticsChart extends Component{
    constructor(props) {
        super(props);
    }

    countDateChart(analytics_result){
        const {data} = analytics_result;
        const { begin_date, end_date, count_type, count_result, request } = data;

        let day_formatter = d3_time_format.timeFormat("%Y-%m-%d");
        let day_parser = d3_time_format.timeParse("%Y-%m-%d");

        let x_axis;
        let y_axis;
        let series;

        let x_range = d3time.timeDay.range(day_parser(begin_date), day_parser(end_date));
        let x_data = x_range.map(function (item, index) {
            return day_formatter(item);
        });
        x_axis = [{
            type: 'category',
            data: x_data,
            axisTick: {
                alignWithLabel: true,
                interval: 0
            },axisLabel: {
                interval: 0,
                rotate: 45
            },
            splitArea: {
                interval: 0
            },
        }];

        y_axis = [{
            type: 'value'
        }];
        let values = x_data.map(function (item, index) {
            if (item in count_result) {
                return count_result[item]
            }
            else
                return 0;
        });

        let bar_data = {
            name: 'count',
            type: 'bar',
            barWidth: '50%',
            data: values
        };
        series = [bar_data];

        let chart_data = {
            x_axis: x_axis,
            y_axis: y_axis,
            series: series
        };

        return chart_data;
    }

    countWeekdayChart(analytics_result){
        const {data} = analytics_result;
        const { begin_date, end_date, count_type, count_result } = data;

        let x_axis;
        let y_axis;
        let series;

        x_axis = [{
            type: 'category',
            data: ['Mon.', 'Tues.', 'Wed.', 'Thur.', 'Fri.', 'Sat.', 'Sun.'],
            axisTick: {
                alignWithLabel: true
            },
            splitArea: {
                interval: 0
            }
        }];

        y_axis = [{
            type: 'value'
        }];

        let values = [0,1,2,3,4,5,6].map(function (item, index) {
            if (item in count_result)
                return count_result[item];
            else
                return 0;
        });

        let bar_data = {
            name: 'count',
            type: 'bar',
            barWidth: '50%',
            data: values
        };
        series = [bar_data];

        let chart_data = {
            x_axis: x_axis,
            y_axis: y_axis,
            series: series
        };

        return chart_data;
    }

    countSystemChart(analytics_result){
        const {data} = analytics_result;
        const { begin_date, end_date, count_type, count_result } = data;

        let x_axis;
        let y_axis;
        let series;

        x_axis = [{
            type: 'category',
            data: Object.keys(count_result),
            axisTick: {
                alignWithLabel: true
            },
            splitArea: {
                interval: 0
            }
        }];

        y_axis = [{
            type: 'value'
        }];

        let values = x_axis[0].data.map(function (item, index) {
            if (item in count_result)
                return count_result[item];
            else
                return 0;
        });

        let bar_data = {
            name: 'count',
            type: 'bar',
            barWidth: '50%',
            data: values
        };
        series = [bar_data];

        let chart_data = {
            x_axis: x_axis,
            y_axis: y_axis,
            series: series
        };

        return chart_data;
    }

    countDateHourChart(analytics_result){
        const {data} = analytics_result;
        const { begin_date, end_date, count_type, count_result } = data;

        let day_hour_formatter = d3_time_format.timeFormat("%Y-%m-%d %H:%M:%S");
        let day_parser = d3_time_format.timeParse("%Y-%m-%d");

        let x_axis;
        let y_axis;
        let series;

        let x_range = d3time.timeHour.range(day_parser(begin_date), day_parser(end_date));
        let x_data = x_range.map(function (item, index) {
            return day_hour_formatter(item);
        });
        x_axis = [{
            type: 'category',
            data: x_data,
            axisTick: {
                alignWithLabel: true,
                interval: 0
            },
        }];

        y_axis = [{
            type: 'value'
        }];
        let values = x_data.map(function (item, index) {
            if (item in count_result) {
                return count_result[item]
            }
            else
                return 0;
        });

        let bar_data = {
            name: 'count',
            type: 'bar',
            barWidth: '80%',
            data: values
        };
        series = [bar_data];

        let chart_data = {
            x_axis: x_axis,
            y_axis: y_axis,
            series: series
        };

        return chart_data;
    }

    countHourChart(analytics_result){
        let padding_zero_formatter = d3_format.format("02");
        const {data} = analytics_result;
        const { begin_date, end_date, count_type, count_result } = data;

        let hour_list = d3_array.range(0, 24);
        let x_data = hour_list.map(function(element, index){
            return String(padding_zero_formatter(index));
        });

        let x_axis;
        let y_axis;
        let series;

        x_axis = [{
            type: 'category',
            data: x_data,
            axisTick: {
                alignWithLabel: true
            },
            splitArea: {
                interval: 0
            }
        }];

        y_axis = [{
            type: 'value'
        }];

        let values = x_data.map(function (item, index) {
            if (item in count_result)
                return count_result[item];
            else
                return 0;
        });

        let bar_data = {
            name: 'count',
            type: 'bar',
            barWidth: '50%',
            data: values
        };
        series = [bar_data];

        let chart_data = {
            x_axis: x_axis,
            y_axis: y_axis,
            series: series
        };

        return chart_data;
    }

    render() {
        const {analytics_result} = this.props;
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
        if(analytics_result === null){
            return empty_chart
        }
        const {data} = analytics_result;
        if(analytics_result.type == "count"){
            const {begin_date, end_date, count_type, count_result, request} = data;
            let chart_data = null;
            switch (count_type) {
                case "date":
                    chart_data = this.countDateChart(analytics_result);
                    break;
                case "weekday":
                    chart_data = this.countWeekdayChart(analytics_result);
                    break;
                    break;
                case "system":
                    chart_data = this.countSystemChart(analytics_result);
                    break;
                    break;
                case "date-hour":
                    chart_data = this.countDateHourChart(analytics_result);
                    break;
                    break;
                case "hour":
                    chart_data = this.countHourChart(analytics_result);
                    break;
                default:
                    return empty_chart;
            }
            return (
                <div>
                    <div className="row">
                        <div className="col-xs-12">
                            <ErrorAnalyzerBarChart data={chart_data}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-10 col-xs-offset-1">
                            <p>日志路径：{request.log_file_path}</p>
                            <p>起始日期：{begin_date} 结束日期：{end_date}</p>
                            <p>统计类型：count - {count_type}</p>
                        </div>
                    </div>
                </div>
            )
        } else if (analytics_type == "grid" ){
            const {response, request} = data;
            const {grid_result} = response;
            const {log_file_path, x_type, y_type, begin_date, end_date} = request;
            return (
                <div>
                    <div className="row">
                        <div className="col-xs-10 col-xs-offset-1">
                            <p>日志路径：{log_file_path}</p>
                            <p>起始日期：{begin_date} 结束日期：{end_date}</p>
                            <p>统计类型：{analytics_type} / x: {x_type}, y: {y_type}</p>
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
    analytics_result: PropTypes.object
};
