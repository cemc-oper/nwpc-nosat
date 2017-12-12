import React, { Component } from 'react';
import PropTypes from 'prop-types'
import moment from 'moment';
import { Form, Select, Input } from 'antd'



class ErrorAnalyzerGridConfigForm extends Component{
  constructor(props){
    super(props);
  }

  checkDate(rule, value, callback){
    const {form} = this.props;
    let first_date = moment(form.getFieldValue('first_date'));
    let last_date = moment(form.getFieldValue('end_date'));
    if(first_date<=last_date){
      callback();
    } else {
      callback('日期范围有误');
    }
  }

  render() {
    const {form} = this.props;
    const {getFieldDecorator} = form;

    return (
      <Form>
        <Form.Item label="X轴类型">
          {getFieldDecorator('x_type', {
            initialValue: form.getFieldValue('x_type'),
            rules: [{ required: true, message: '请选择X轴类型' }],
          })(
            <Select>
              <Select.Option value="hour">Hour</Select.Option>
              <Select.Option value="weekday">Weekday</Select.Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item label="Y轴类型">
          {getFieldDecorator('y_type', {
            initialValue: form.getFieldValue('y_type'),
            rules: [{ required: true, message: '请选择Y轴类型' }],
          })(
            <Select>
              <Select.Option value="date">Date</Select.Option>
              <Select.Option value="weekday">Weekday</Select.Option>
              <Select.Option value="system">System</Select.Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item label="起始日期">{
          getFieldDecorator('first_date', {
            rules:[{
              required: true, message: '请输入起始日期'
            }, {
              validator: this.checkDate.bind(this)
            }],
          })(<Input type='date'/>)
        }</Form.Item>
        <Form.Item label="结束日期">{
          getFieldDecorator('end_date', {
            rules:[{
              required: true, message: '请输入结束日期',
            }, {
              validator: this.checkDate.bind(this)
            }],
          })(<Input type='date'/>)
        }</Form.Item>
      </Form>
    )
  }
}


const ErrorAnalyzerGridConfigFormNode = Form.create({
  mapPropsToFields(props){
    return {
      x_type: Form.createFormField({
        value: props.x_type
      }),
      y_type: Form.createFormField({
        value: props.y_type
      }),
      first_date: Form.createFormField({
        value: moment(props.first_date).format("YYYY-MM-DD")
      }),
      end_date: Form.createFormField({
        value: moment(props.end_date).format("YYYY-MM-DD")
      })
    }
  },
  onFieldsChange(props, changed_fields){
    let config = Object.assign({
      analytics_command: 'grid'
    }, props);

    let changed_props = {};
    Object.keys(changed_fields).map(function(key, index){
      changed_props[key] = changed_fields[key].value;
    });

    if('first_date' in changed_fields){
      changed_props['first_date'] = moment(changed_props['first_date']).toDate();
    }

    if('end_date' in changed_fields){
      changed_props['first_date'] = moment(changed_props['end_date']).toDate();
    }

    let new_config = Object.assign(config, changed_props);

    // console.log("[ErrorAnalyzerCountConfigFormNode:onFieldsChange] config:", config);
    // console.log("[ErrorAnalyzerCountConfigFormNode:onFieldsChange] new config:", new_config);

    props.change_handler(new_config);
  }
})(ErrorAnalyzerGridConfigForm);


export default class ErrorAnalyzerGridConfig extends Component {

  render() {
    const {analyzer_config} = this.props;
    const {first_date, last_date, x_type, y_type} = analyzer_config;
    return (
      <ErrorAnalyzerGridConfigFormNode
        x_type={x_type}
        y_type={y_type}
        first_date={first_date}
        last_date={last_date}
      />
    )
  }
}

ErrorAnalyzerGridConfig.propTypes = {
  analyzer_config: PropTypes.shape({
    analyzer_command: PropTypes.string,
    first_date: PropTypes.object,
    last_date: PropTypes.object,
    x_type: PropTypes.string,
    y_type: PropTypes.string
  }),
  handler: PropTypes.shape({
    change_handler: PropTypes.func
  })
};