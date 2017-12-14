import React from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';

import { Row, Col, Button, Form, Input, Icon } from 'antd';

const electron = require('electron');
const ipc_render = electron.ipcRenderer;

import {change_environment} from '../reducers/index'

const remote = require('electron').remote;

let uuid = 0;

class SetupEnvForm extends React.Component{
  constructor(props){
    super(props);
  }

  componentWillMount(){
    const {form, repo_list, config_file_path} = this.props;
    console.log('[SetupEnvForm.componentWillMount] repo_list:', repo_list);
    const {getFieldDecorator} = form;

    let repo_list_length = repo_list.length;
    let repo_list_keys = [];

    while(repo_list_keys.length < repo_list_length){
      uuid++;
      repo_list_keys = repo_list_keys.concat(uuid);
    }

    repo_list_keys.forEach(function(value, index){
      getFieldDecorator(`repo_${value}_owner`, {initialValue:repo_list[index].owner});
      getFieldDecorator(`repo_${value}_repo`, {initialValue: repo_list[index].repo});
    });

    getFieldDecorator('config_file_path', {initialValue: config_file_path});
    getFieldDecorator('repo_list_keys', {initialValue: repo_list_keys});
    // console.log('[SetupEnvForm.componentWillMount] config_file_path:', config_file_path);
    // console.log('[SetupEnvForm.componentWillMount] repo_list_keys:', repo_list_keys);
  }

  addRepoItem(){
    const {form} = this.props;
    const {getFieldDecorator, getFieldValue, setFieldsValue} = form;
    const repo_list_keys = getFieldValue('repo_list_keys');

    uuid++;
    const new_repo_list_keys = repo_list_keys.concat(uuid);
    const fields = {
      repo_list_keys: new_repo_list_keys
    };
    // getFieldDecorator(`repo_${uuid}_owner`, {initialValue: ''});
    // getFieldDecorator(`repo_${uuid}_repo`, {initialValue: ''});

    setFieldsValue(fields);

    console.log('[SetupEnvForm.addRepoItem] old keys:', repo_list_keys);
    console.log('[SetupEnvForm.addRepoItem] new keys:', new_repo_list_keys);
  }

  removeRepoItem(k){
    const {form} = this.props;
    const repo_list_keys = form.getFieldValue('repo_list_keys');

    if(repo_list_keys.length === 1) {
      return;
    }

    const new_repo_list_keys = repo_list_keys.filter(key => key !== k);

    form.setFieldsValue({
      repo_list_keys: new_repo_list_keys
    });

    // console.log('[SetupEnvForm.removeRepoItem] old keys:', repo_list_keys);
    // console.log('[SetupEnvForm.removeRepoItem] new keys:', new_repo_list_keys);
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
        config_file_path: file_paths[0]
      })
    });
  }

  handleSaveFields(d){
    const {form} = this.props;
    form.validateFields((err, values) => {
      // console.log("[SetupEnvForm.handleSaveFields] err:", err);
      if (!err) {
        this.saveFields(values);
      }
    });
  }

  saveFields(form_values) {
    const {handler}  = this.props;
    const {repo_list_keys, config_file_path} = form_values;
    const repo_list = repo_list_keys.map(function(key, index){
      const owner_name = form_values[`repo_${key}_owner`];
      const repo_name = form_values[`repo_${key}_repo`];
      return {
        owner: owner_name,
        repo: repo_name
      }
    });

    handler.change_field_handler({
      repo_list: repo_list,
      config_file_path: config_file_path
    });

    return {
      repo_list: repo_list,
      config_file_path: config_file_path
    }
  }

  handleSubmit(e){
    e.preventDefault();
    const {form, handler}  = this.props;
    const repo_list_keys = form.getFieldValue('repo_list_keys');
    // console.log("[SetupEnvForm.handleSubmit] repo_list_keys:", repo_list_keys);
    form.validateFields((err, values) => {
      // console.log("[SetupEnvForm.handleSubmit] err:", err);
      if (!err) {
        this.doSetupEnv(values);
      }
    });
  }

  doSetupEnv(form_values){
    const {config_file_path, repo_list} = this.saveFields(form_values);

    ipc_render.send('system-time-line.request.setup-env',
      config_file_path, repo_list);
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

    const repo_list_keys = form.getFieldValue('repo_list_keys');
    // console.log("[SetupEnvForm.render] repo_list_keys:", repo_list_keys);

    const repo_list_nodes = repo_list_keys.map((key, index)=>{
      return (
        <Form.Item
          {...(index===0?formItemLayout:formItemLayoutWithOutLabel)}
          label={index===0?'项目列表':''}
          key={key}
          required={false}
        >
          <Col span={6}>
            <Form.Item>{
              getFieldDecorator(`repo_${key}_owner`, {
                validateTrigger: ['onChange', 'onBlur'],
                rules:[{
                  required: true,
                  message: '请输入用户名'
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
                validateTrigger: ['onChange', 'onBlur'],
                rules:[{
                  required: true,
                  message: '请输入项目名'
                }],
              })(<Input/>)
            }</Form.Item>
          </Col>
          <Col span={2} style={{textAlign:'center'}}>
            {repo_list_keys.length > 1 ? (
              <Icon
                className="dynamic-delete-button"
                type="minus-circle-o"
                disabled={repo_list_keys.length === 1}
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
                }]
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
          <Button type="primary" htmlType="submit" >创建环境</Button>
          <Button type="default" onClick={this.handleSaveFields.bind(this)}>保存设置</Button>
        </Form.Item>
      </Form>
    )
  }
}


const SetupEnvFormNode = Form.create({})(SetupEnvForm);


class SetupEnvPage extends React.Component{
  constructor(props){
    super(props);
  }

  setupEnv(config_file_path, repo_list){
    // console.log('SetupEnvPage:setupEnv', this);
    const {setup_env} = this.props.handler;
    setup_env(config_file_path, repo_list);
  }

  handleFieldChanged(changed_fields){
    const {dispatch} = this.props;
    // console.log('[SetupEnvPage.handleFieldChanged] changed_fields:', changed_fields);
    dispatch(change_environment(changed_fields));
  }

  render(){
    const {environment} = this.props;
    const {repo_list, config_file_path} = environment;
    return (
      <Row>
        <Col span={18}>
          <SetupEnvFormNode
            config_file_path={config_file_path}
            repo_list={repo_list}
            environment_props={['config_file_path', 'repo_list']}
            handler={{
              submit: this.setupEnv.bind(this),
              change_field_handler: this.handleFieldChanged.bind(this)
            }}
          />
        </Col>
        <Col span={6}>
        </Col>
      </Row>
    )
  }
}

SetupEnvPage.propTypes = {
  environment: PropTypes.shape({
    repo_list: PropTypes.array,
    config_file_path: PropTypes.string
  })
};

function mapStateToProps(state){
  return {
    environment:state.system_running_time.environment
  }
}

export default connect(mapStateToProps)(SetupEnvPage)