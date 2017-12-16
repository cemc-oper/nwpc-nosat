import React from 'react';
import PropTypes from 'prop-types'
import { dispatch } from 'redux'

import { Row, Col, Menu, Button, Form, Input, Icon } from 'antd';
import {connect} from "react-redux";


const electron = require('electron');
const ipc_render = electron.ipcRenderer;
const remote = electron.remote;


import {
  set_process_data_repo,
  append_process_data_repo_command_output,
  clear_process_data_repo_command_output
} from '../reducers/index';
import CommandOutputPanel from '../components/command_output_panel';


class ProcessDataForm extends React.Component {
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

  handleSubmit(e){
    e.preventDefault();
    const {form} = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        this.loadLog(values);
      }
    });
  }
  
  handleSaveClick(e){
    const {form, handler} = this.props;
    const {getFieldValue} = form;
    const repo = {
      config_file_path: getFieldValue('config_file_path'),
      owner:  getFieldValue('owner'),
      repo:  getFieldValue('repo'),
      begin_date:  getFieldValue('begin_date'),
      end_date:  getFieldValue('end_date'),
      command_output: ''
    };
    const key = `${repo.owner}/${repo.repo}`;
    handler.save_repo_handler(key, repo);
  }

  handleClearCommandOutput(e){
    const {form, handler} = this.props;
    const {getFieldValue} = form;
    const owner = getFieldValue('owner');
    const repo = getFieldValue('repo');
    handler.clear_command_output_handler(`${owner}/${repo}`);
  }

  loadLog(form_values){
    const {handler} = this.props;
    const {owner, repo, log_file_path, begin_date, end_date, config_file_path} = form_values;
    handler.process_data_handler({
      config_file_path: config_file_path,
      owner: owner,
      repo: repo,
      log_file_path: log_file_path,
      begin_date: begin_date,
      end_date: end_date
    })
  }

  render() {
    const {form, process_data_repo} = this.props;
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
    getFieldDecorator('config_file_path');
    getFieldDecorator('owner');
    getFieldDecorator('repo');

    let command_output_node = null;
    if(process_data_repo){
      const {command_output} = process_data_repo;
      command_output_node = (
        <CommandOutputPanel
          command_output={command_output}
          handler={{
            clear_command_output_handler: this.handleClearCommandOutput.bind(this)
          }}
        />
      )
    }

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
          <Form.Item>
            <Button type="primary" htmlType="submit">处理数据</Button>
            <Button type="default" onClick={this.handleSaveClick.bind(this)}>保存设置</Button>
          </Form.Item>
        </Form>
        {command_output_node}
      </div>
    )
  }
}

const ProcessDataFormNode = Form.create({
  mapPropsToFields(props){
    return {
      owner: Form.createFormField({
        value: props.process_data_repo.owner
      }),
      repo: Form.createFormField({
        value: props.process_data_repo.repo
      }),
      begin_date: Form.createFormField({
        value: props.process_data_repo.begin_date
      }),
      end_date: Form.createFormField({
        value: props.process_data_repo.end_date
      }),
      config_file_path: Form.createFormField({
        value: props.process_data_repo.config_file_path
      })
    }
  }
})(ProcessDataForm);


class ProcessDataPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current_key: null
    }
  }

  componentWillMount(){
    const {environment, dispatch} = this.props;
    const {repo_list} = environment;
    if(repo_list.length>0) {
      const repo = repo_list[0];
      this.setState({
        current_key: `${repo.owner}/${repo.repo}`
      });
    }
  }

  processData(params){
    const { handler } = this.props;
    handler.process_data_handler(params);
  }

  saveProcessDataRepo(key, value){
    const {dispatch} = this.props;
    dispatch(set_process_data_repo({
      key: key,
      value: value
    }))
  }

  clearRepoCommandOutput(key){
    const {dispatch} = this.props;
    console.log("[ProcessDataPage.clearRepoCommandOutput] key:", key);
    dispatch(clear_process_data_repo_command_output({key: key}));
  }

  handleMenuClick(e){
    const {key} = e;
    this.setState({
      current_key: key
    })
  }

  render(){
    const {environment, process_data} = this.props;
    const {repo_list, config_file_path} = environment;
    const {repos} = process_data;
    const { current_key } = this.state;

    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20},
    };

    const repo_menus = repo_list.map(repo => {
      const {repo: repo_name, owner: owner_name} = repo;
      return (
        <Menu.Item key={`${owner_name}/${repo_name}`}>{`${owner_name}/${repo_name}`}</Menu.Item>
      )
    });

    const repo_contents_map= {};
    repo_list.forEach(repo => {
      const {repo: repo_name, owner: owner_name} = repo;
      const repo_full_name = `${owner_name}/${repo_name}`;
      let process_data_repo = {
        config_file_path: config_file_path,
        owner: owner_name,
        repo: repo_name,
        begin_date: '',
        end_date:''
      };
      if(repo_full_name in repos){
        console.log("[ProcessDataPage.render] use repo in process_data.");
        process_data_repo = repos[repo_full_name];
      } else {

      }

      repo_contents_map[repo_full_name] = (
        <div>
          <h2>{repo_full_name}</h2>
          <Row>
            <ProcessDataFormNode
              key={repo_full_name}
              process_data_repo={process_data_repo}
              handler={{
                process_data_handler: this.processData.bind(this),
                save_repo_handler: this.saveProcessDataRepo.bind(this),
                clear_command_output_handler: this.clearRepoCommandOutput.bind(this)
              }}
            />
          </Row>
        </div>
      )
    });

    if(repo_list.length>0){
      return (
        <div>
          <Row>
            <Col span={4}>
              <Menu
                onClick={this.handleMenuClick.bind(this)}
                mode="inline"
                defaultSelectedKeys={[current_key]}
              >
                {repo_menus}
              </Menu>
            </Col>
            <Col span={20}>
              {repo_contents_map[current_key]}
            </Col>
          </Row>
        </div>
      )
    } else {
      return (
        <div>
          <Row>
            请创建环境
          </Row>
        </div>
      )
    }

  }
}

ProcessDataPage.propTypes = {
  environment: PropTypes.object,
  process_data: PropTypes.shape({
    repos: PropTypes.object
  }),
  handler: PropTypes.shape({
    process_data_handler: PropTypes.func
  })
};


function mapStateToProps(state){
  return {
    environment:state.system_running_time.environment,
    process_data: state.system_running_time.process_data,
  }
}

export default connect(mapStateToProps)(ProcessDataPage);
