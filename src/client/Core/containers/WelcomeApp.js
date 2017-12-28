import React, { Component } from 'react'
import {Link} from 'react-router'

import {
  Layout, Row, Col, Button
} from 'antd';

import {NOSATFooter} from '../components/NOSATFooter';
import "./nosat_box.scss"

const { Header, Content } = Layout;


export default class WelcomeApp extends Component{
  constructor(props) {
    super(props);
  }

  render() {
    return (

      <Layout className="layout" style={{ height: '100vh' }}>
        <Header>
          <Row className="nosat-navi-bar">
            <Col span={4}>
              <Link className="logo" to="/">NOSAT</Link>
            </Col>
            <Col span={20}>
              <p className="logo">业务系统分析工具 NOSAT</p>
            </Col>
          </Row>
        </Header>
        <Content style={{padding: '25px 25px 0px 25px'}}>
          <Row gutter={16}>
            <Col span={12}>
              <div className="nosat-box">
                <h3>作业提交日志分析</h3>
                <p>...</p>
                <p>
                  <Button type="primary"><Link to="/submit-log-analytics">前往</Link></Button>
                </p>
              </div>
            </Col>
            <Col span={12}>
              <div className="nosat-box">
                <h3>系统运行时间分析</h3>
                <p>...</p>
                <p>
                  <Button type="primary"><Link to="/system-running-time-analytics">前往</Link></Button>
                </p>
              </div>
            </Col>
          </Row>
        </Content>
        <NOSATFooter />
      </Layout>
    )
  }
}
