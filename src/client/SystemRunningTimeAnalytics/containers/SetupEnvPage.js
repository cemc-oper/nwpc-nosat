import React from 'react';
import PropTypes from 'prop-types'
import { dispatch } from 'redux'
import { connect } from 'react-redux';

import { Row, Col, Button, Form, Input, Icon } from 'antd';

import {change_repo_list, change_environment} from '../reducers/index'

const remote = require('electron').remote;

let uuid = 0;

class SetupEnvForm extends React.Component{
  constructor(props){
    super(props);
  }

  componentWillMount(){
    const {form} = this.props;
    const {getFieldDecorator} = form;

    const repo_list = form.getFieldValue('repo_list');
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

    getFieldDecorator('repo_list_keys', {initialValue: repo_list_keys});
  }

  componentWillUnmount(){
    const {form, handler} = this.props;
    const {getFieldValue} = form;
    const repo_list_keys = getFieldValue('repo_list_keys');

    const repo_list = repo_list_keys.map((key, index)=>{
      const owner_name = form.getFieldValue(`repo_${key}_owner`);
      const repo_name = form.getFieldValue(`repo_${key}_repo`);
      return {
        owner: owner_name,
        repo: repo_name
      }
    });

    // form.setFieldsValue({
    //   repo_list: repo_list
    // });

    handler.change_environment_handler({
      repo_list: repo_list
    });
  }

  addRepoItem(){
    const {form} = this.props;
    const {getFieldDecorator, getFieldValue, setFieldsValue} = form;
    const repo_list_keys = getFieldValue('repo_list_keys');

    uuid++;
    const new_repo_list_keys = repo_list_keys.concat(uuid);
    let fields = {
      repo_list_keys: new_repo_list_keys
    };
    getFieldDecorator(`repo_${uuid}_owner`, {initialValue: ''});
    getFieldDecorator(`repo_${uuid}_repo`, {initialValue: ''});

    setFieldsValue(fields);
  }

  removeRepoItem(k){
    const {form} = this.props;
    const repo_list_keys = form.getFieldValue('repo_list_keys');

    if(repo_list_keys.length === 1) {
      return;
    }

    let new_repo_list_keys = repo_list_keys.filter(key => key !== k);

    form.setFieldsValue({
      repo_list_keys: new_repo_list_keys
    })
  }

  handleSubmit(e){
    e.preventDefault();
    console.log("SetupEnvForm:handleSubmit:", this);
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
    // console.log(config_file_path);
    // console.log(repo_list);

    const {handler} = this.props;
    handler.submit(config_file_path, repo_list);
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
    const repo_list_keys = form.getFieldValue('repo_list_keys');

    const repo_list_nodes = repo_list_keys.map((key, index)=>{
      return (
        <Form.Item
          {...(index===0?formItemLayout:formItemLayoutWithOutLabel)}
          label={index===0?'项目列表':''}
          key={key}
        >
          <Col span={6}>
            <Form.Item>{
              getFieldDecorator(`repo_${key}_owner`, {
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
                rules:[{
                  required: true, message: '请输入项目名'
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
      config_file_path: Form.createFormField({
        value: props.config_file_path
      }),
      repo_list: Form.createFormField({
        value: props.repo_list
      })
    }
  },
  onFieldsChange(props, changed_fields){
    let changed_props = {};
    const environment_keys = props.environment_props;
    environment_keys.forEach((value)=>{
      if(value in changed_fields){
        changed_props[value] = changed_fields[value].key;
      }
    });
    if(changed_fields.length > 0) {
      props.handler.change_environment_handler(changed_props);
    }
  }
})(SetupEnvForm);


class SetupEnvPage extends React.Component{
  constructor(props){
    super(props);
  }

  setupEnv(config_file_path, repo_list){
    console.log('SetupEnvPage:setupEnv', this);
    const {setup_env} = this.props.handler;
    setup_env(config_file_path, repo_list);
  }

  handleEnvironmentChanged(changed_props){
    const {dispatch} = this.props;
    dispatch(change_environment(changed_props));
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
              change_environment_handler: this.handleEnvironmentChanged.bind(this)
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
  handler: PropTypes.shape({
    setup_env: PropTypes.func
  }),
  environment: PropTypes.shape({
    repo_list: PropTypes.arrayOf(PropTypes.shape({
      owner: PropTypes.string,
      repo: PropTypes.string
    })),
    config_file_path: PropTypes.string
  })
};

// SetupEnvPage.defaultProps = {
//   repo_list: [
//     { owner: 'nwp_xp', repo: 'nwpc_op' },
//     { owner: 'nwp_xp', repo: 'nwpc_qu' }
//   ]
// };

function mapStateToProps(state){
  return {
    environment:state.system_running_time.environment
  }
}

export default connect(mapStateToProps)(SetupEnvPage)