import React from 'react';
import PropTypes from 'prop-types'
import { dispatch } from 'redux'

import { Row, Col, Button, Form, Input, Icon } from 'antd';

const remote = require('electron').remote;

let uuid = 0;
class SetupEnvForm extends React.Component{
  constructor(props){
    super(props);
  }

  componentWillMount(){
    const {form} = this.props;
    const {getFieldDecorator} = form;

    getFieldDecorator('repo_list_keys', { initialValue: [] });

    const repo_list = form.getFieldValue('repo_list');
    let repo_list_length = repo_list.length;
    while(form.getFieldValue('repo_list_keys').length < repo_list_length){
      this.addRepoItem();
    }
  }

  addRepoItem(){
    const {form} = this.props;
    const repo_list_keys = form.getFieldValue('repo_list_keys');

    uuid++;
    const new_repo_list_keys = repo_list_keys.concat(uuid);
    form.setFieldsValue({
      repo_list_keys: new_repo_list_keys
    });
  }

  removeRepoItem(k){
    const {form} = this.props;
    const repo_list_keys = form.getFieldValue('repo_list_keys');

    if(repo_list_keys.length === 1){
      return;
    }

    form.setFieldsValue({
      repo_list_keys: repo_list_keys.filter(key => key !== k)
    })
  }

  handleSubmit(e){
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.doSetupEnv(values);
      }
    });
  }

  handleSelectFile(e){
    e.preventDefault();
    const {form} = this.props;
    const dialog = remote.dialog;
    dialog.showOpenDialog({
      properties: ['openFile']
    }, function(file_paths){
      form.setFieldsValue({
        config_file_path: file_paths[0]
      })
    });
  }

  doSetupEnv(form_values){
    const {repo_list_keys, config_file_path} = form_values;
    const repo_list = repo_list_keys.map((key, index)=>{
      const owner_name = form_values[`repo_${key}_owner`];
      const repo_name = form_values[`repo_${key}_repo`];
      return {
        owner: owner_name,
        repo: repo_name
      }
    });
    console.log(config_file_path);
    console.log(repo_list);
  }

  render() {
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 6},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 18},
      },
    };

    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: {span: 24, offset: 0},
        sm: {span: 18, offset: 6},
      },
    };

    const {form} = this.props;
    const {getFieldDecorator} = form;

    const repo_list = form.getFieldValue('repo_list');
    const repo_list_length = repo_list.length;
    const repo_list_keys = form.getFieldValue('repo_list_keys');

    const repo_list_nodes = repo_list_keys.map((key, index)=>{
      let repo_name = '';
      let owner_name = '';
      if(index<repo_list_length) {
        const repo_object = repo_list[index];
        repo_name = repo_object.repo;
        owner_name = repo_object.owner;
      }
      return (
        <Form.Item
          {...(index===0?formItemLayout:formItemLayoutWithOutLabel)}
          label={index===0?'项目列表':''}
          key={key}
        >
          <Col span={6}>
            <Form.Item>{
              getFieldDecorator(`repo_${key}_owner`, {
                initialValue: owner_name,
                rules:[{
                  required: true, message: '请输入用户名'
                }],
              })(<Input/>)
            }</Form.Item>
          </Col>
          <Col span={2}>
            <span style={{ display: 'inline-block', width: '100%', textAlign: 'center' }}>
            /
            </span>
          </Col>
          <Col span={6}>
            <Form.Item>{
              getFieldDecorator(`repo_${key}_repo`, {
                initialValue: repo_name,
                rules:[{
                  required: true, message: '请输入项目名'
                }],
              })(<Input/>)
            }</Form.Item>
          </Col>
          <Col span={2} style={{textAlign:'center'}}>
            {repo_list.length > 1 ? (
              <Icon
                className="dynamic-delete-button"
                type="minus-circle-o"
                disabled={repo_list.length === 1}
                onClick={this.removeRepoItem.bind(this, key)}
              />
            ) : null}
          </Col>
        </Form.Item>
      )
    });

    return (
      <Form ref="setup_env_form" onSubmit={this.handleSubmit.bind(this)}>
        <Form.Item
          {...formItemLayout}
          label="配置文件路径"
        >
          <Row gutter={8}>
            <Col span={12}>{
          getFieldDecorator('config_file_path', {
            rules:[{
              required: true, message: '请选择一个配置文件'
            }],
          })(<Input/>)
            }</Col>
            <Col span={12}>
              <Button size='large' onClick={this.handleSelectFile.bind(this)}>选择文件</Button>
            </Col>
          </Row>
        </Form.Item>
        {repo_list_nodes}
        <Form.Item {...formItemLayoutWithOutLabel}>
          <Button type="dashed" onClick={this.addRepoItem.bind(this)} style={{ width: '60%' }}>
            <Icon type="plus" /> 添加项目
          </Button>
        </Form.Item>
        <Form.Item {...formItemLayoutWithOutLabel}>
          <Button type="primary" htmlType="submit">创建环境</Button>
        </Form.Item>
      </Form>
    )
  }
}


const SetupEnvFormNode = Form.create({
    mapPropsToFields(props){
      return {
        config_file_path: { value: props.config_file_path},
        repo_list: {value: props.repo_list}
      }
    }
  }
)(SetupEnvForm);

export class SetupEnvPage extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    return (
      <Row>
        <Col span={18}>
          <SetupEnvFormNode
            config_file_path={''}
            repo_list={[
              { owner: 'nwp_xp', repo: 'nwpc_op' },
              { owner: 'nwp_xp', repo: 'nwpc_qu' }
            ]}
          />
        </Col>
      </Row>
    )
  }
}