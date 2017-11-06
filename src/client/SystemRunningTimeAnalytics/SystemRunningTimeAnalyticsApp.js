import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { dispatch } from 'redux'
import { connect } from 'react-redux'
import {Link} from 'react-router'

import {
  Layout, Row, Col, Steps,
  Form, Input, Button, Menu, Alert, Icon, message
} from 'antd';

import {ipcRenderer} from 'electron'

import './index.css'


const { Header, Footer, Content } = Layout;
const { Step } = Steps;

class SystemRunningTimeAnalyticsApp extends Component{
  constructor(props) {
    super(props);
    this.state = {
      current_index: 0
    };
  }

  next() {
    const current_index = this.state.current_index + 1;
    this.setState({ current_index });
  }
  prev() {
    const current_index = this.state.current_index - 1;
    this.setState({ current_index });
  }

  render() {
    const { current_index } = this.state;
    const steps = [{
      title: '创建环境',
      content: 'First-content',
    }, {
      title: '载入日志',
      content: 'Second-content',
    }, {
      title: '处理数据',
      content: 'Last-content',
    }, {
      title: '生成结果',
      content: 'Last-content',
    }, {
      title: '绘制图形',
      content: 'Last-content',
    }, {
      title: '清理环境',
      content: 'Last-content',
    }];

    return (
      <Layout className="layout" style={{
        minHeight: '100vh'
      }}>
        <Header>
          <Row className="nost-navi-bar">
            <Col span={4}>
              <Link className="logo" to="/">NOST</Link>
            </Col>
            <Col span={20}>
              <Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={['2']}
                style={{ lineHeight: '64px' }}
              >
                <Menu.Item key="1"><Link to="/submit-log-analytics">提交分析</Link></Menu.Item>
                <Menu.Item key="2"><Link to="/system-running-time-analytics">运行时间</Link></Menu.Item>
              </Menu>
            </Col>
          </Row>
        </Header>
        <Content style={{ padding: '25px 25px 0px 25px', background: '#fff' }}>
          <div>
            <Steps current={current_index}>
              {steps.map(item => <Step key={item.title} title={item.title} />)}
            </Steps>
            <div className="steps-content">{steps[this.state.current_index].content}</div>
            <div className="steps-action">
              {
                current_index < steps.length - 1
                &&
                <Button type="primary" onClick={() => this.next()}>前进</Button>
              }
              {
                current_index === steps.length - 1
                &&
                <Button type="primary" onClick={() => message.success('成功!')}>完成</Button>
              }
              {
                current_index > 0
                &&
                <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                  后退
                </Button>
              }
            </div>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          NOST &copy; 2017 NWPC
        </Footer>
      </Layout>
    );
  }
}

function mapStateToProps(state){
  return {

  }
}

export default connect(mapStateToProps)(SystemRunningTimeAnalyticsApp)
