import React from 'react';
import PropTypes from 'prop-types'
import { dispatch } from 'redux'

import { Row, Col, Menu, Button, Form, Input, Icon } from 'antd';
import {connect} from "react-redux";


const electron = require('electron');
const ipc_render = electron.ipcRenderer;
const remote = electron.remote;


class RepoLoadLogForm extends React.Component {
  constructor(props) {
    super(props);
  }

  handleSelectFile(e){
    e.preventDefault();
    const {form} = this.props;
    const dialog = remote.dialog;
    dialog.showOpenDialog({
      properties: ['openFile']
    }, function(file_paths){
      if(file_paths === undefined)
        return;
      form.setFieldsValue({
        log_file_path: file_paths[0]
      })
    });
  }

  render() {
    const {form} = this.props;
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
    return (
      <Form>
        <Form.Item
          {...formItemLayout}
          label='日志文件路径'
        >
          <Row gutter={8}>
            <Col span={18}>{
              getFieldDecorator(`log_file_path`, {
                rules:[{
                  required: true, message: '请输入日志文件路径'
                }],
              })(<Input/>)
            }
            </Col>
            <Col span={6}>
              <Button size='large' onClick={this.handleSelectFile.bind(this)}>选择文件</Button>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label='起始日期'
        >
          <Row gutter={8}>
            <Col span={10}>{
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
          <Col span={10}>{
          getFieldDecorator(`end_date`, {
            rules:[{
              required: true, message: '请输入截止日期'
            }],
          })(<Input type='date'/>)
        }
          </Col>
        </Row>
        </Form.Item>
      </Form>
    )
  }
}

const RepoLoadLogFormNode = Form.create({
  mapPropsToFields(props){
    return {
      owner: Form.createFormField({
        value: props.owner
      }),
      repo: Form.createFormField({
        value: props.repo
      }),
      begin_date: Form.createFormField({
        value: props.begin_date
      }),
      end_date: Form.createFormField({
        value: props.end_date
      }),
      log_file_path: Form.createFormField({
        value: props.log_file_path
      })
    }
  }
})(RepoLoadLogForm);


class LoadLogPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current_key: null
    }
  }

  componentWillMount(){
    const {environment} = this.props;
    const {repo_list} = environment;
    if(repo_list.length>0) {
      const repo = repo_list[0];
      this.setState({
        current_key: `${repo.owner}/${repo.repo}`
      });
    }
  }

  handleMenuClick(e){
    const {key} = e;
    this.setState({
      current_key: key
    })
  }

  render(){
    const {environment} = this.props;
    const {repo_list, config_file_path} = environment;
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

      repo_contents_map[repo_full_name] = (
        <div>
          <h2>{repo_full_name}</h2>
          <RepoLoadLogFormNode
            key={repo_full_name}
            owner={owner_name}
            repo={repo_name}
            log_file_path={''}
            begin_date={''}
            end_date={''}
          />
        </div>
      )
    });

    if(repo_list.length>0){
      return (
        <div>
          <Row>
            <Col span={18} offset={4}>
              <Form layout='horizontal'>
                <Form.Item
                  label='配置文件路径'
                  {...formItemLayout}
                >
                  <Input value={config_file_path} readOnly />
                </Form.Item>
              </Form>
            </Col>
          </Row>
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
            <Col span={18} offset={4}>
              <Form layout='horizontal'>
                <Form.Item
                  label='配置文件路径'
                  {...formItemLayout}
                >
                  <Input value={config_file_path} readOnly />
                </Form.Item>
              </Form>
            </Col>
          </Row>
          <Row>
            请创建环境
          </Row>
        </div>
      )
    }

  }
}


function mapStateToProps(state){
  return {
    environment:state.system_running_time.environment,
    load_log: state.system_running_time.load_log,
  }
}

export default connect(mapStateToProps)(LoadLogPage);
