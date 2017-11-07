import React from 'react';
import PropTypes from 'prop-types'
import { dispatch } from 'redux'

import { Row, Col, Button, Form, Input, Icon } from 'antd';

class SetupEnvForm extends React.Component{
  constructor(props){
    super(props);
  }

  addRepoItem(){

  }

  removeRepoItem(repo_item){

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
    const repo_list_nodes = repo_list.map((repo_object, index)=>{
      const repo_name = repo_object.repo;
      const owner_name = repo_object.owner;
      return (
        <Form.Item
          {...(index===0?formItemLayout:formItemLayoutWithOutLabel)}
          label={index===0?'项目列表':''}
          key={repo_object}
        >
          <Col span={6}>{
            getFieldDecorator(`repo_${index}_owner`, {
              initialValue: owner_name,
              rules:[{
                required: true, message: '请输入用户名'
              }],
            })(<Input/>)
          }</Col>
          <Col span={2}>
            <span style={{ display: 'inline-block', width: '100%', textAlign: 'center' }}>
            /
            </span>
          </Col>
          <Col span={6}>{
            getFieldDecorator(`repo_${index}_repo`, {
              initialValue: repo_name,
              rules:[{
                required: true, message: '请输入项目名'
              }],
            })(<Input/>)
          }</Col>
          <Col span={2} style={{textAlign:'center'}}>
            {repo_list.length > 1 ? (
              <Icon
                className="dynamic-delete-button"
                type="minus-circle-o"
                disabled={repo_list.length === 1}
                onClick={this.removeRepoItem(repo_object)}
              />
            ) : null}
          </Col>
        </Form.Item>
      )
    });

    return (
      <Form ref="setup_env_form">
        <Form.Item
          {...formItemLayout}
          label="配置文件路径"
        >{
          getFieldDecorator('config_file_path', {
            rules:[{
              required: true, message: '请选择一个配置文件'
            }],
          })(<Input type='file' />)
        }</Form.Item>
        {repo_list_nodes}
        <Form.Item {...formItemLayoutWithOutLabel}>
          <Button type="dashed" onClick={this.addRepoItem} style={{ width: '60%' }}>
            <Icon type="plus" /> 添加项目
          </Button>
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