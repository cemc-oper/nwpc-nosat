import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router';
import { Layout, Menu, Row, Col } from 'antd';

const { Header } = Layout;

export class NOSATHeader extends Component{
  constructor(props) {
    super(props);
  }

  render(){
    const {default_selected_keys} = this.props;
    return (
      <Header>
        <Row className="nosat-navi-bar">
          <Col span={4}>
            <Link className="logo" to="/">NOSAT</Link>
          </Col>
          <Col span={20}>
            <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={default_selected_keys}
              style={{ lineHeight: '64px' }}
            >
              <Menu.Item key="1"><Link to="/submit-log-analytics">提交分析</Link></Menu.Item>
              <Menu.Item key="2"><Link to="/system-running-time-analytics">运行时间</Link></Menu.Item>
            </Menu>
          </Col>
        </Row>
      </Header>
    )
  }
}

NOSATHeader.propTypes = {
  default_selected_keys: PropTypes.array
};