import React, { Component, PropTypes } from 'react';
import * as d3time from 'd3-time'
import * as d3_time_format from 'd3-time-format'
import * as d3_format from 'd3-format'
import * as d3_array from 'd3-array'
import ErrorAnalyzerBarChart from "../components/ErrorAnalyzerBarChart"

export default  class AnalyticsChart extends Component{
    constructor(props) {
        super(props);
    }

    countDayChart(analytics_result){
        const {data} = analytics_result;
        const { begin_date, end_date, count_type, count_result } = data;

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

        return (
            <div>
                <ErrorAnalyzerBarChart data={chart_data} />
            </div>
        )
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

        return (
            <div>
                <ErrorAnalyzerBarChart data={chart_data} />
            </div>
        )
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

        return (
            <div>
                <ErrorAnalyzerBarChart data={chart_data} />
            </div>
        )
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

        return (
            <div>
                <ErrorAnalyzerBarChart data={chart_data} />
            </div>
        )
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

        return (
            <div>
                <ErrorAnalyzerBarChart data={chart_data} />
            </div>
        )
    }

    render() {
        const {analytics_result} = this.props;
        // console.log('AnalyticsChart', analytics_result);
        if(analytics_result === null){
            return (
                <div>

                </div>
            )
        }
        if(analytics_result.type == "count"){
            const {data} = analytics_result;
            const { begin_date, end_date, count_type, count_result } = data;

            if(count_type == "day") {
                return this.countDayChart(analytics_result);
            } else if(count_type == "weekday") {
                return this.countWeekdayChart(analytics_result);
            } else if(count_type == "system") {
                return this.countSystemChart(analytics_result);
            } else if(count_type == "date-hour") {
                return this.countDateHourChart(analytics_result);
            } else if(count_type == "hour") {
                return this.countHourChart(analytics_result);
            } else {
                    return (
                        <div>

                        </div>
                    )
            }
        } else {
            return (
                <div>

                </div>
            )
        }

    }
}

AnalyticsChart.propTypes = {
    analytics_result: PropTypes.object
};
