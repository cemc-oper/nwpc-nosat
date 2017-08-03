import React, { Component } from 'react';
import PropTypes from 'prop-types'
import echarts from 'echarts'

import elementResizeEvent from 'element-resize-event';

export default class ErrorAnalyzerBarChart extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount(){
        let echarts_instance = echarts.init(this.refs.chart_dom);
        this.renderChartDom();

        elementResizeEvent(this.refs.chart_dom, function() {
            echarts_instance.resize();
        });
    }

    componentDidUpdate(){
        this.renderChartDom();
    };

    componentWillUnmount(){
        echarts.dispose(this.refs.chart_dom);
    }

    getEchartsInstance(){
        return echarts.getInstanceByDom(this.refs.chart_dom);
    }

    renderChartDom(){
        const { data } = this.props;
        let echarts_instance = this.getEchartsInstance();

        echarts_instance.setOption(data);
        return echarts_instance;
    }

    render() {
        const { data } = this.props;
        let chart_style = {
            height: 600
        };

        return (
            <div ref="chart_dom" style={ chart_style }>

            </div>
        )
    }
}

ErrorAnalyzerBarChart.propTypes = {
    data: PropTypes.shape({
        x_axis: PropTypes.array,
        y_axis: PropTypes.array,
        series: PropTypes.array
    })
};

ErrorAnalyzerBarChart.defaultProps = {

};