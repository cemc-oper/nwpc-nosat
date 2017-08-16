import * as d3time from 'd3-time'
import * as d3_time_format from 'd3-time-format'
import * as d3_format from 'd3-format'
import * as d3_array from 'd3-array'


import DimensionGenerator from './DimensionGenerator'


export default class OneDimensionDataGenerator{

  static generateData(analytics_result){
    const {data, type} = analytics_result;
    const {request, response} = data;
    const {count_type} = request;
    const {count_result} = response;
    let chart_data = null;
    let x = DimensionGenerator.generateOneDimension(analytics_result);
    if (x===null) {
      return chart_data;
    }
    let value = OneDimensionDataGenerator.generateValue(x, count_result);
    chart_data = {
      data_type: 'one-dimension',
      analytics_type: {
        command: type,
        type: count_type
      },
      x: x,
      value: value
    };
    return chart_data;
  }

  static generateValue(x, count_result, default_value=0) {
    let values = x.data.map(function (item, index) {
      if (item.value in count_result) {
        return {
          x: item.value,
          value: count_result[item.value]
        }
      } else {
        return {
          x: item.value,
          value: default_value
        };
      }
    });
    return {
      data: values
    }
  }
};
