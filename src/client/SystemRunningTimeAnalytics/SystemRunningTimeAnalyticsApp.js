import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {Link} from 'react-router';


import {
  Layout, Row, Col, Steps,
  Button, message
} from 'antd';


import {NOSTFooter} from '../Core/components/NOSTFooter';
import {NOSTHeader} from '../Core/components/NOSTHeader';

import SetupEnvPage from './containers/SetupEnvPage';
import LoadLogPage from './containers/LoadLogPage';

import './index.css'


const { Content } = Layout;
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
    const { system_running_time } = this.props;
    const { environment } = system_running_time;
    const steps = [{
      title: '创建环境',
      content: (
        <SetupEnvPage />
      ),
    }, {
      title: '载入日志',
      content: (
        <LoadLogPage />
      ),
    }, {
      title: '处理数据',
      content: 'Process Data',
    }, {
      title: '生成结果',
      content: 'Generate Results',
    }, {
      title: '绘制图形',
      content: 'Plot Draws',
    }, {
      title: '清理环境',
      content: 'Cleanup Environment',
    }];

    return (
      <Layout className="layout" style={{
        minHeight: '100vh'
      }}>
        <NOSTHeader default_selected_keys={['2']} />
        <Content style={{ padding: '25px 25px 0px 25px', background: '#fff' }}>
          <div>
            <Steps current={current_index}>
              {steps.map(item => <Step key={item.title} title={item.title} />)}
            </Steps>
            <div className="steps-content" style={{ padding: '25px'}}>{steps[this.state.current_index].content}</div>
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
        <NOSTFooter/>
      </Layout>
    );
  }
}

function mapStateToProps(state){
  return {
    system_running_time:state.system_running_time
  }
}

export default connect(mapStateToProps)(SystemRunningTimeAnalyticsApp)
