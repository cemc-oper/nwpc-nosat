import React, { Component } from 'react';
import PropTypes from 'prop-types'
import moment from 'moment';
import { Form, Select, Input } from 'antd';


class ErrorAnalyzerCountConfigForm extends Component{
  constructor(props){
    super(props);
  }

  componentWillMount(){
    const {form} = this.props;
    const {getFieldDecorator} = form;
  }

  handleSubmit(e){
    e.preventDefault();
    console.log("SetupEnvForm:handleSubmit:", this);
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.doSubmit(values);
      }
    });
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
        <Form.Item label="统计类型" onHandle={this.handleSubmit.bind(this)}>
          {getFieldDecorator('analytics_type', {
            initialValue: form.getFieldValue('analytics_type'),
            rules: [{ required: true, message: '请选择统计类型' }],
          })(
            <Select>
              <Select.Option value="date">Date</Select.Option>
              <Select.Option value="weekday">Weekday</Select.Option>
              <Select.Option value="system">System</Select.Option>
              <Select.Option value="date-hour">Hour by day</Select.Option>
              <Select.Option value="hour">Hour</Select.Option>
              <Select.Option value="grid">Grid</Select.Option>
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


const ErrorAnalyzerCountConfigFormNode = Form.create({
  mapPropsToFields(props){
    return {
      analytics_type: Form.createFormField({
        value: props.analytics_type
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
      analytics_command: 'count'
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

    console.log("[ErrorAnalyzerCountConfigFormNode:onFieldsChange] config:", config);
    console.log("[ErrorAnalyzerCountConfigFormNode:onFieldsChange] new config:", new_config);

    props.change_handler(new_config);
  }
})(ErrorAnalyzerCountConfigForm);


export default class ErrorAnalyzerCountConfig extends Component {

  getConfig() {
    // let config = Object();
    // config.analytics_command = 'count';
    // config.analytics_type = this.refs.analytics_type_node.value;
    // config.first_date = moment(this.refs.first_date_node.value).toDate();
    // config.last_date = moment(this.refs.last_date_node.value).toDate();
    // return config;
  }

  handleChange() {
    // let config = this.getConfig();
    // console.log("[ErrorAnalyzerCountConfig.handleChange] config", config);
    // const {change_handler} = this.props.handler;
    // change_handler(config);
  }

  render() {
    const {analyzer_config} = this.props;
    const {analytics_type, first_date, last_date} = analyzer_config;
    console.log(analyzer_config);
    return (
      <ErrorAnalyzerCountConfigFormNode
        analytics_type={analytics_type}
        first_date={first_date}
        end_date={last_date}
      />
    )
  }
}

ErrorAnalyzerCountConfig.propTypes = {
  analyzer_config: PropTypes.shape({
    analyzer_command: PropTypes.string,
    analytics_type: PropTypes.string,
    first_date: PropTypes.object,
    last_date: PropTypes.object,
  }),
  handler: PropTypes.shape({
    change_handler: PropTypes.func
  })
};