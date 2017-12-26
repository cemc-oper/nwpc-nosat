import React from 'react';
import PropTypes from 'prop-types'
import { dispatch } from 'redux'

import { Row, Col, Menu, Button, Form, Input, Icon } from 'antd';
import {connect} from "react-redux";


const electron = require('electron');
const ipc_render = electron.ipcRenderer;
const remote = electron.remote;


import {
  set_plot_chart_config,
  clear_plot_chart_command_output
} from '../reducers/index';
import CommandOutputPanel from '../components/command_output_panel';


class PlotChartForm extends React.Component {
  constructor(props) {
    super(props);
  }

  handleSelectConfigFile(e){
    e.preventDefault();
    const {form} = this.props;
    const dialog = remote.dialog;
    dialog.showOpenDialog({
      properties: ['openFile']
    }, function(file_paths){
      if(file_paths === undefined)
        return;
      form.setFieldsValue({
        config_file_path: file_paths[0]
      })
    });
  }

  handleSelectDataDir(e){
    e.preventDefault();
    const {form} = this.props;
    const dialog = remote.dialog;
    dialog.showOpenDialog({
      properties: ['openDirectory']
    }, function(dir_paths){
      if(dir_paths === undefined)
        return;
      form.setFieldsValue({
        data_dir: dir_paths[0]
      })
    });
  }

  handleSelectOutputDir(e){
    e.preventDefault();
    const {form} = this.props;
    const dialog = remote.dialog;
    dialog.showOpenDialog({
      properties: ['openDirectory']
    }, function(dir_paths){
      if(dir_paths === undefined)
        return;
      form.setFieldsValue({
        output_dir: dir_paths[0]
      })
    });
  }

  handleOpenOutputDir(e){
    e.preventDefault();
    const {form} = this.props;
    const output_dir = form.getFieldValue('output_dir');
    if(output_dir){
      shell.openItem(output_dir);
    }
  }

  handleSaveClick(e){
    const {form, handler} = this.props;
    const {getFieldValue} = form;
    const plot_chart_config = {
      config_file_path: getFieldValue('config_file_path'),
      begin_date:  getFieldValue('begin_date'),
      end_date:  getFieldValue('end_date'),
      data_dir: getFieldValue('data_dir'),
      output_dir:  getFieldValue('output_dir'),
      command_output: ''
    };
    handler.save_config_handler(plot_chart_config);
  }

  handleClearCommandOutput(e){
    const {handler} = this.props;
    handler.clear_command_output_handler();
  }

  handleSubmit(e){
    e.preventDefault();
    const {form} = this.props;
    form.validateFields((err, values) => {
      console.log(err);
      if (!err) {
        this.plotChart(values);
      }
    });
  }

  plotChart(form_values){
    const {handler} = this.props;
    const {config_file_path, begin_date, end_date, data_dir, output_dir} = form_values;
    handler.plot_chart_handler({
      config_file_path: config_file_path,
      begin_date: begin_date,
      end_date: end_date,
      data_dir: data_dir,
      output_dir: output_dir
    });
  }

  render() {
    const {form, command_output} = this.props;
    const {getFieldDecorator} = form;
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 4},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 20},
      },
    };

    let command_output_node = (
      <CommandOutputPanel
        command_output={command_output}
        handler={{
          clear_command_output_handler: this.handleClearCommandOutput.bind(this)
        }}
      />
    );

    return (
      <div>
        <Form onSubmit={this.handleSubmit.bind(this)}>
          <Form.Item
            {...formItemLayout}
            label="配置文件路径"
          >
            <Row gutter={8}>
              <Col span={18}>{
                getFieldDecorator('config_file_path', {
                  rules:[{
                    required: true, message: '请选择一个配置文件'
                  }]
                })(<Input/>)
              }</Col>
              <Col span={6}>
                <Button size='large' onClick={this.handleSelectConfigFile.bind(this)}>选择文件</Button>
              </Col>
            </Row>
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label='起始日期'
          >
            <Row gutter={8}>
              <Col span={6}>{
                getFieldDecorator(`begin_date`, {
                  rules:[{
                    required: true, message: '请输入起始日期'
                  }],
                })(<Input type='date'/>)
              }
              </Col>
            </Row>
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label='截止日期'
          ><Row gutter={8}>
            <Col span={6}>{
              getFieldDecorator(`end_date`, {
                rules:[{
                  required: true, message: '请输入截止日期'
                }],
              })(<Input type='date'/>)
            }
            </Col>
          </Row>
          </Form.Item>

          <Form.Item
            {...formItemLayout}
            label='数据目录'
          >
            <Row gutter={8}>
              <Col span={18}>{
                getFieldDecorator(`data_dir`, {
                  rules:[{
                    required: true, message: '请选择一个数据目录'
                  }],
                })(<Input/>)
              }
              </Col>
              <Col span={6}>
                <Button size='large' onClick={this.handleSelectDataDir.bind(this)}>选择目录</Button>
              </Col>
            </Row>
          </Form.Item>

          <Form.Item
            {...formItemLayout}
            label='输出目录'
          >
            <Row gutter={8}>
              <Col span={12}>{
                getFieldDecorator(`output_dir`, {
                  rules:[{
                    required: true, message: '请选择一个输出目录'
                  }],
                })(<Input/>)
              }
              </Col>
              <Col span={12}>
                <Button size='large' onClick={this.handleSelectOutputDir.bind(this)}>选择目录</Button>
                <Button size='large' onClick={this.handleOpenOutputDir.bind(this)}>打开目录</Button>
              </Col>
            </Row>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">生成结果</Button>
            <Button type="default" onClick={this.handleSaveClick.bind(this)}>保存设置</Button>
          </Form.Item>
        </Form>
        {command_output_node}
      </div>
    )
  }
}

const PlotChartFormNode = Form.create({
  mapPropsToFields(props){
    return {
      config_file_path: Form.createFormField({
        value: props.config_file_path
      }),
      begin_date: Form.createFormField({
        value: props.begin_date
      }),
      end_date: Form.createFormField({
        value: props.end_date
      }),
      data_dir: Form.createFormField({
        value: props.data_dir
      }),
      output_dir: Form.createFormField({
        value: props.output_dir
      })
    }
  }
})(PlotChartForm);


class PlotChartPage extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount(){
  }

  plotChart(params){
    const {handler} = this.props;
    handler.plot_chart_handler(params)
  }

  savePlotChartConfig(plot_chart_config){
    const {dispatch} = this.props;
    dispatch(set_plot_chart_config(plot_chart_config));
  }

  clearCommandOutput(key){
    const {dispatch} = this.props;
    console.log("[PlotChartPage.clearRepoCommandOutput] key:", key);
    dispatch(clear_plot_chart_command_output({key: key}));
  }

  render(){
    const {environment, plot_chart} = this.props;
    const {config_file_path} = environment;
    const {current_config_file_path=config_file_path} = plot_chart;
    const {begin_date='', end_date='', data_dir='', output_dir=''} = plot_chart;

    return (
      <Row>
        <Col span={18}>
          <PlotChartFormNode
            config_file_path={current_config_file_path}
            begin_date={begin_date}
            end_date={end_date}
            data_dir={data_dir}
            output_dir={output_dir}
            handler={{
              clear_command_output_handler: this.clearCommandOutput.bind(this),
              plot_chart_handler: this.plotChart.bind(this),
              save_config_handler: this.savePlotChartConfig.bind(this)
            }}
          />
        </Col>
        <Col span={6}>
        </Col>
      </Row>
    )
  }
}

PlotChartPage.propTypes = {
  environment: PropTypes.object,
  plot_chart: PropTypes.object,
  handler: PropTypes.object
};


function mapStateToProps(state){
  return {
    environment:state.system_running_time.environment,
    plot_chart: state.system_running_time.plot_chart,
  }
}

export default connect(mapStateToProps)(PlotChartPage);
