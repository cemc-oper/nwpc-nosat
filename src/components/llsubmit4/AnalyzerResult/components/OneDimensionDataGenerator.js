import * as d3time from 'd3-time'
import * as d3_time_format from 'd3-time-format'
import * as d3_format from 'd3-format'
import * as d3_array from 'd3-array'


export default class OneDimensionDataGenerator{

    static generateData(analytics_result){
        const {data} = analytics_result;
        const {request, response} = data;
        const {count_type} = request;
        const {count_result} = response;
        let chart_data = null;
        let x = OneDimensionDataGenerator.generateXDimension(analytics_result);
        if (x==null) {
            return chart_data;
        }
        let value = OneDimensionDataGenerator.generateValue(x, count_result);
        chart_data = {
            data_type: 'one_dimension',
            analytics_type: {
                command: 'count',
                type: count_type
            },
            x: x,
            value: value
        };
        return chart_data;
    }

    static generateXDimension(analytics_result){
        const {data} = analytics_result;
        const {request, response} = data;
        const { begin_date, end_date, count_type } = request;
        const {count_result} = response;
        let x = null;
        switch (count_type) {
            case "date":
                x = OneDimensionDataGenerator.getDateDimension(begin_date, end_date);
                break;
            case "weekday":
                x = OneDimensionDataGenerator.getWeekDimension();
                break;
            case "system":
                x = OneDimensionDataGenerator.getSystemDimension(count_result);
                break;
            case "date-hour":
                x = OneDimensionDataGenerator.getDateHourDimension(begin_date, end_date);
                break;
            case "hour":
                x = OneDimensionDataGenerator.getHourDimension();
                break;
            default:
                x = null;
        }
        return x;
    }

    /**
     * [begin_date, end_date) 日期序列，格式为 YYYY-MM-DD
     * @param begin_date: YYYY-MM-DD
     * @param end_date: YYYY-MM-DD
     * @returns {{type: string, data}}
     */
    static getDateDimension(begin_date, end_date) {
        let day_formatter = d3_time_format.timeFormat("%Y-%m-%d");
        let day_parser = d3_time_format.timeParse("%Y-%m-%d");
        let x_range = d3time.timeDay.range(day_parser(begin_date), day_parser(end_date));
        let x_data = x_range.map(function (item, index) {
            let value = day_formatter(item);
            return {
                label: value,
                value: value
            };
        });
        return {
            type: 'date',
            data: x_data
        }
    }

    /**
     * 星期列表，从周一到周日
     * @returns {{type: string, data: [*,*,*,*,*,*,*]}}
     */
    static getWeekDimension() {
        return {
            type: 'weekday',
            data: [
                { label: 'Mon.', value: 0 },
                { label: 'Tues.', value: 1 },
                { label: 'Wed.', value: 2 },
                { label: 'Thur.', value: 3 },
                { label: 'Fri.', value: 4 },
                { label: 'Sat.', value: 5 },
                { label: 'Sun.', value: 6 },
            ]
        }
    }

    /**
     * 系统名列表
     * @param result 统计结果
     * @returns {{type: string, data: Array}}
     */
    static getSystemDimension(result){
        let data = Object.keys(result).map(function(item, index){
            return {
                label: item,
                value: item
            }
        });

        return {
            type: 'system',
            data: data
        }
    }

    /**
     * 逐小时列表，[begin_date, end_date), YYYY-MM-DD HH:MM:SS
     * @param begin_date: YYYY-MM-DD
     * @param end_date: YYYY-MM-DD
     * @returns {{type: string, data}}
     */
    static getDateHourDimension(begin_date, end_date) {
        let day_hour_formatter = d3_time_format.timeFormat("%Y-%m-%d %H:%M:%S");
        let day_parser = d3_time_format.timeParse("%Y-%m-%d");

        let x_range = d3time.timeHour.range(day_parser(begin_date), day_parser(end_date));
        let x_data = x_range.map(function (item, index) {
            return {
                label: day_hour_formatter(item),
                value: day_hour_formatter(item)
            };
        });
        return {
            type: 'date-hour',
            data: x_data
        }
    }

    /**
     * [0,24] 小时列表
     * @returns {{type: string, data}}
     */
    static getHourDimension() {
        let padding_zero_formatter = d3_format.format("02");
        let hour_list = d3_array.range(0, 24);
        let x_data = hour_list.map(function(element, index){
            return String(padding_zero_formatter(index));
        });
        return {
            type: 'hour',
            data: x_data
        }
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
