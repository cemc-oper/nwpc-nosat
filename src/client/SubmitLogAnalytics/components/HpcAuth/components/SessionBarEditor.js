import React, { Component } from 'react';
import PropTypes from 'prop-types'

import { Form, Input, Button, Row, Col } from 'antd';
const FormItem = Form.Item;


export default class SessionBarEditor extends Component{

  getSession() {
    let auth = Object();
    let host_node = this.refs.host;
    auth.host = host_node.value;
    let port_node = this.refs.port;
    auth.port = parseInt(port_node.value, 10);
    let user_node = this.refs.user;
    auth.user = user_node.value;
    let password_node = this.refs.password;
    auth.password = password_node.value;
    return auth;
  }

  handleChange() {
    let session = this.getSession();
    let { change_handler } = this.props.handler;
    change_handler(session);
  }

  render(){
    const {host, port, user, password} = this.props;
    return (
      <Row gutter={16}>
        <Col span={8}>
          <Input type="text" placeholder="主机"
                 ref="host" value={host} onChange={this.handleChange.bind(this)} />
        </Col>
        <Col span={4}>
          <Input type="text" placeholder="端口"
                 ref="port" value={port} onChange={this.handleChange.bind(this)} />
        </Col>
        <Col span={6}>
          <Input type="text" placeholder="用户名"
                 ref="user" value={user} onChange={this.handleChange.bind(this)}/>
        </Col>
        <Col span={6}>
          <Input type="password" placeholder="密码"
                 ref="password" value={password} onChange={this.handleChange.bind(this)} />
        </Col>
      </Row>
    )
  }
}

SessionBarEditor.propTypes = {
  host: PropTypes.string,
  port: PropTypes.number,
  user: PropTypes.string,
  password: PropTypes.string,
  handler: PropTypes.shape({
    change_handler: PropTypes.func
  })
};