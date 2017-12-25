import React from 'react';
import PropTypes from 'prop-types'
import { dispatch } from 'redux'

import { Row, Col, Menu, Button, Form, Input, Icon } from 'antd';
import {connect} from "react-redux";


const electron = require('electron');
const ipc_render = electron.ipcRenderer;
const remote = electron.remote;


import {
  set_generate_data_config,
  clear_generate_data_command_output
} from '../reducers/index';
import CommandOutputPanel from '../components/command_output_panel';


class GenerateResultForm extends React.Component {
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

  handleSaveClick(e){
    const {form, handler} = this.props;
    const {getFieldValue} = form;
    const generate_result_config = {
      config_file_path: getFieldValue('config_file_path'),
      begin_date:  getFieldValue('begin_date'),
      end_date:  getFieldValue('end_date'),
      output_dir:  getFieldValue('output_dir'),
      command_output: ''
    };
    handler.save_config_handler(generate_result_config);
  }

  handleClearCommandOutput(e){
    const {handler} = this.props;
    handler.clear_command_output_handler();
  }

  handleSubmit(e){
    e.preventDefault();
    const {form} = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        this.generateResult(values);
      }
    });
  }

  generateResult(form_values){
    const {handler} = this.props;
    const {config_file_path, begin_date, end_date, output_dir} = form_values;
    handler.generate_result_handler({
      config_file_path: config_file_path,
      begin_date: begin_date,
      end_date: end_date,
      output_dir: output_dir
    })
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
            label='输出目录'
          >
            <Row gutter={8}>
              <Col span={18}>{
                getFieldDecorator(`output_dir`, {
                  rules:[{
                    required: true, message: '请选择一个输出目录'
                  }],
                })(<Input/>)
              }
              </Col>
              <Col span={6}>
                <Button size='large' onClick={this.handleSelectOutputDir.bind(this)}>选择目录</Button>
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

const GenerateResultFormNode = Form.create({
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
      output_dir: Form.createFormField({
        value: props.output_dir
      })
    }
  }
})(GenerateResultForm);


class GenerateResultPage extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount(){
  }

  generateResult(params){
    const {handler} = this.props;
    handler.generate_result_handler(params)
  }

  saveGenerateResultConfig(generate_result_config){
    const {dispatch} = this.props;
    dispatch(set_generate_data_config(generate_result_config));
  }

  clearCommandOutput(key){
    const {dispatch} = this.props;
    console.log("[GenerateResultPage.clearRepoCommandOutput] key:", key);
    dispatch(clear_generate_data_command_output({key: key}));
  }

  render(){
    const {environment, generate_result} = this.props;
    const {config_file_path} = environment;
    const {current_config_file_path=config_file_path} = generate_result;
    const {begin_date='', end_date='', output_dir='', command_output=''} = generate_result;

    return (
      <Row>
        <Col span={18}>
          <GenerateResultFormNode
            config_file_path={current_config_file_path}
            begin_date={begin_date}
            end_date={end_date}
            output_dir={output_dir}
            command_output={command_output}
            handler={{
              clear_command_output_handler: this.clearCommandOutput.bind(this),
              generate_result_handler: this.generateResult.bind(this),
              save_config_handler: this.saveGenerateResultConfig.bind(this)
            }}
          />
        </Col>
        <Col span={6}>
        </Col>
      </Row>
    )
  }
}

GenerateResultPage.propTypes = {
  environment: PropTypes.object,
  generate_result: PropTypes.object
};


function mapStateToProps(state){
  return {
    environment:state.system_running_time.environment,
    generate_result: state.system_running_time.generate_result,
  }
}

export default connect(mapStateToProps)(GenerateResultPage);
