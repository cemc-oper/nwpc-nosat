import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { dispatch } from 'redux'
import { connect } from 'react-redux'
import {Link} from 'react-router'

import {
  Layout, Row, Col,
  Form, Input, Button, Menu, Alert, Icon
} from 'antd';

import './index.css'


const { Header, Footer, Content } = Layout;

class SystemRunningTimeAnalyticsApp extends Component{
  constructor(props) {
    super(props);
    this.state = {
      data_file_path: ''
    }
  }

  handleDrawClick(){

  }

  handleSelectDataFile(){
    let event = new MouseEvent('click', {
      'view': window,
      'bubbles': true,
      'cancelable': true
    });
    this.refs.input_data_file.refs.input.dispatchEvent(event);
  }

  handleDataFileSelected(e){
    let file_path = e.target.files[0].path;
    this.setState({data_file_path: file_path});
  }

  render() {
    return (
      <Layout className="layout">
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
        <Content style={{ padding: '25px 25px 0px 25px' }}>
          <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
            <Row>
              <Col span={24}>
                <Form>
                  <Form.Item>
                    <Row>
                      <Col span={18}>
                        <Input type="text" ref="input_data_file_path" value={this.state.data_file_path} />
                        <Input type="file" ref="input_data_file"
                               onChange={this.handleDataFileSelected.bind(this)}
                               style={{display: "none"}}
                        />
                      </Col>
                      <Col span={6}>
                        <Button onClick={this.handleSelectDataFile.bind(this)}>
                          <Icon type="upload" /> 选择数据文件
                        </Button>
                      </Col>
                    </Row>
                  </Form.Item>
                  <Form.Item>
                    <Alert message="请选择符合 nuwe-timeline 规范的数据文件。" type="info" />
                  </Form.Item>
                  <Form.Item>
                    <Button onClick={this.handleDrawClick.bind(this)}>绘图</Button>
                  </Form.Item>
                </Form>
              </Col>
            </Row>
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
