import * as d3time from 'd3-time'
import * as d3_time_format from 'd3-time-format'
import * as d3_format from 'd3-format'
import * as d3_array from 'd3-array'

import DimensionGenerator from './DimensionGenerator'


export default class TwoDimensionDataGenerator{

  static generateData(analytics_result){
    const {data, type} = analytics_result;
    const {request, response} = data;
    const {x_type, y_type} = request;
    const {grid_result } = response;
    let chart_data = null;
    let {x,y} = TwoDimensionDataGenerator.generateTwoDimension(analytics_result);
    if (x===null || y===null) {
      return chart_data;
    }
    let value = TwoDimensionDataGenerator.generateValue(x, y, grid_result);
    chart_data = {
      data_type: 'two-dimension',
      analytics_type: {
        command: type,
        x_type: x_type,
        y_type: y_type
      },
      x: x,
      y: y,
      value: value
    };
    return chart_data;
  }

  static generateTwoDimension(analytics_result){
    let x=null, y=null;

    const {data, type} = analytics_result;
    const {request, response} = data;
    const {x_type, y_type, begin_date, end_date} = request;
    const {grid_result} = response;
    switch (x_type) {
      case "hour":
        x = DimensionGenerator.getHourDimension();
        break;
      case "weekday":
        x = DimensionGenerator.getWeekdayDimension();
        break;
      default:
        x = null;
    }
    let y_data = [];
    switch (y_type) {
      case "weekday":
        y = DimensionGenerator.getWeekdayDimension();
        break;
      case "system":
        y_data = [];
        Object.keys(grid_result).forEach(function(key){
          let cur_y = DimensionGenerator.getSystemDimension(grid_result[key]);
          cur_y.data.forEach(function(item){
            let index = y_data.findIndex(function(element){
              return element.label == item.label && element.value == item.value;
            });
            if(index==-1){
              y_data.push(item);
            }
          });
        });
        y = {
          type: 'system',
          data: y_data
        };
        break;
      case "date":
        y = DimensionGenerator.getDateDimension(begin_date, end_date);
        break;
      default:
        y = null;
    }

    return {
      x:x,
      y:y
    }
  }

  static generateValue(x, y, grid_result, default_value=0) {
    let values = [];

    x.data.forEach(function (item, index) {
      let cur_col = [];
      let cur_x = item.value;

      let cur_x_grid = null;
      if(cur_x in grid_result)
        cur_x_grid = grid_result[cur_x];

      y.data.forEach(function(item,index){
        let cur_y = item.value;
        if(cur_x_grid && cur_y in cur_x_grid) {
          values.push({
            x: cur_x,
            y: cur_y,
            value: cur_x_grid[cur_y]
          });
        } else {
          values.push({
            x: cur_x,
            y: cur_y,
            value: default_value
          });
        }
      });
    });
    return {
      data: values
    }
  }

};
