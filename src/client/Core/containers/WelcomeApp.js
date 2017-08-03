import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { dispatch } from 'redux'
import { connect } from 'react-redux'
import {Link} from 'react-router'

import {
  Layout, Row, Col,
  Form, Input, Button, Menu, Alert, Icon
} from 'antd';

const { Header, Footer, Content } = Layout;


class WelcomeApp extends Component{
  constructor(props) {
    super(props);
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
              <p className="logo">业务系统分析工具 NOSAT</p>
            </Col>
          </Row>
        </Header>
        <Content style={{ padding: '25px 25px 0px 25px' }}>
          <Row>
            <Col span={12}>
              <div>
                <h3>作业提交日志分析</h3>
                <p>...</p>
                <p>
                  <Button type="primary"><Link to="/submit-log-analytics">前往</Link></Button>
                </p>
              </div>
            </Col>
            <Col span={12}>
              <div>
                <h3>系统运行时间分析</h3>
                <p>...</p>
                <p>
                  <Button type="primary"><Link to="/system-running-time-analytics">前往</Link></Button>
                </p>
              </div>
            </Col>
          </Row>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          NOST &copy; 2017 NWPC
        </Footer>
      </Layout>
    )
  }
}

function mapStateToProps(state){
  return {

  }
}

export default connect(mapStateToProps)(WelcomeApp)
