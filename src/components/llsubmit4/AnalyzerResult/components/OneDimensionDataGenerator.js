import * as d3time from 'd3-time'
import * as d3_time_format from 'd3-time-format'
import * as d3_format from 'd3-format'
import * as d3_array from 'd3-array'

export default class OneDimensionDataGenerator{

    static generateData(analytics_result){
        const {data} = analytics_result;
        const {request} = data;
        const {count_type} = request;
        let chart_data = null;
        switch (count_type) {
            case "date":
                chart_data = OneDimensionDataGenerator.generateDate(analytics_result);
                break;
            case "weekday":
                chart_data = OneDimensionDataGenerator.generateWeekday(analytics_result);
                break;
            case "system":
                chart_data = OneDimensionDataGenerator.generateSystem(analytics_result);
                break;
            case "date-hour":
                chart_data = OneDimensionDataGenerator.generateDateHour(analytics_result);
                break;
            case "hour":
                chart_data = OneDimensionDataGenerator.generateHour(analytics_result);
                break;
            default:
                chart_data = null;
        }
        return chart_data;
    }

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

    static generateDate(analytics_result){
        const {data, type} = analytics_result;
        const { response, request } = data;
        const { begin_date, end_date, count_type } = request;
        const {count_result} = response;

        let x = OneDimensionDataGenerator.getDateDimension(begin_date, end_date);

        let value = OneDimensionDataGenerator.generateValue(x, count_result);

        return {
            type: type,
            x: x,
            value: value
        }
    }

    static generateWeekday(analytics_result){
        const {data, type} = analytics_result;
        const { response, request } = data;
        const { begin_date, end_date, count_type } = request;
        const {count_result} = response;

        let x = OneDimensionDataGenerator.getWeekDimension();

        let value = OneDimensionDataGenerator.generateValue(x, count_result);

        return {
            type: type,
            x: x,
            value: value
        }
    }

    static generateSystem(analytics_result){
        const {data, type} = analytics_result;
        const { response, request } = data;
        const { begin_date, end_date, count_type } = request;
        const {count_result} = response;

        let x = OneDimensionDataGenerator.getSystemDimension(count_result);
        let value = OneDimensionDataGenerator.generateValue(x, count_result);

        return {
            type: type,
            x: x,
            value: value
        }
    }

    static generateDateHour(analytics_result){
        const {data, type} = analytics_result;
        const { response, request } = data;
        const { begin_date, end_date, count_type } = request;
        const {count_result} = response;

        let x = OneDimensionDataGenerator.getDateHourDimension(begin_date, end_date);
        let value = OneDimensionDataGenerator.generateValue(x, count_result);

        return {
            type: type,
            x: x,
            value: value
        }
    }

    static generateHour(analytics_result){
        const {data, type} = analytics_result;
        const { response, request } = data;
        const { begin_date, end_date, count_type } = request;
        const {count_result} = response;

        let x = OneDimensionDataGenerator.getHourDimension();
        let value = OneDimensionDataGenerator.generateValue(x, count_result);

        return {
            type: type,
            x: x,
            value: value
        }
    }
};
