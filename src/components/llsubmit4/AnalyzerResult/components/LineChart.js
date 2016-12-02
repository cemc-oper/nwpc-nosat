import React, { Component, PropTypes } from 'react'

import ErrorAnalyzerBarChart from "./echarts/ErrorAnalyzerBarChart"


export default class LineChart extends Component {

    generateChartData(data){
        const {chart_engine} = this.props;
        let x_axis = [{
            type: 'category',
            data: data.x.data.map(function(item,index){
                return item.label;
            }),
            axisTick: {
                alignWithLabel: true
            },
            splitArea: {
                interval: 0
            }
        }];

        let y_axis = [{
            type: 'value'
        }];


        let bar_data = {
            name: 'count',
            type: 'bar',
            barWidth: '50%',
            data: data.value.data.map(function(item, index){
                return item.value
            })
        };
        let series = [bar_data];

        return {
            x_axis: x_axis,
            y_axis: y_axis,
            series: series
        };
    }

    render() {
        let {data} = this.props;
        let chart_data = this.generateChartData(data);
        return (
            <div>
                <div className="row">
                    <div className="col-xs-12">
                        <ErrorAnalyzerBarChart data={chart_data}/>
                    </div>
                </div>
            </div>
        )
    }
};

LineChart.propTypes = {
    chart_data: PropTypes.object,
    chart_engine: PropTypes.oneOf([
        'echarts'
    ])
};

LineChart.defaultProps = {
    chart_engine: 'echarts'
};