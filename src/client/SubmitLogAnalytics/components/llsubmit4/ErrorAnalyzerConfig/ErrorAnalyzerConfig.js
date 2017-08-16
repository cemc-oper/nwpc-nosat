import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { Row, Col, Card, Button, Tabs } from 'antd';

import ErrorAnalyzerCountConfig from './ErrorAnalyzerCountConfig'
import ErrorAnalyzerGridConfig from './ErrorAnalyzerGridConfig'

export default  class ErrorAnalyzerConfig extends Component{
  constructor(props) {
    super(props);
  }

  getCurrentTabRef() {
    let config_tab = this.refs.config_tab;
    let current_tab = null;
    switch(config_tab.props.activeKey){
      case '1':
        current_tab = this.refs.count_node;
        break;
      case '2':
        current_tab = this.refs.grid_node;
        break;
      default:
        break;
    }
    return current_tab;
  }

  getConfig() {
    return this.getCurrentTabRef().getConfig();
  }

  checkDate(){
    return this.getCurrentTabRef().checkDate();
  }

  // handleChange() {
  //   let config = this.getCurrentTabRef().getConfig();
  //   const {change_handler} = this.props.handler;
  //   change_handler(config);
  // }

  handleRunClick(event) {
    if(!this.checkDate()){
      alert("请选择有效的日期范围，结束日期无法早于起始日期。");
      return;
    }
    let {run_handler } = this.props.handler;
    run_handler();
  }

  handleChangeCommand(key){
    const {change_command_handler} = this.props.handler;
    let command = '';
    switch(key){
      case '1':
        command = "count";
        break;
      case '2':
        command = "grid";
        break;
      default:
        command = "unknown";
        break;
    }
    change_command_handler(command);
  }

  render() {
    const {analyzer_config} = this.props;
    const {current_command} = analyzer_config;

    let default_key = "1";
    switch(current_command){
      case 'count':
        default_key = "1";
        break;
      case 'grid':
        default_key = "2";
        break;
      default:
        default_key = "3";
        break;
    }
    let config_box = (
      <Tabs activeKey={default_key} ref="config_tab" onChange={this.handleChangeCommand.bind(this)}>
        <Tabs.TabPane tab="一维" key="1">
          <ErrorAnalyzerCountConfig
            ref="count_node"
            analyzer_config={analyzer_config.command_map.count}
            handler={{
              change_handler: this.props.handler.change_handler.bind(this)
            }}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="二维" key="2">
          <ErrorAnalyzerGridConfig
            ref="grid_node"
            analyzer_config={analyzer_config.command_map.grid}
            handler={{
              change_handler: this.props.handler.change_handler.bind(this)
            }}
          />
        </Tabs.TabPane>
      </Tabs>
    );

    return (
      <Row>
        <Col span={24}>
          <Card title="统计设置">
            <div className="panel-body">
              {config_box}
              <Button onClick={this.handleRunClick.bind(this)}>运行</Button>
            </div>
          </Card>
        </Col>
      </Row>
    );
  }
}

ErrorAnalyzerConfig.propTypes = {
  analyzer_config: PropTypes.shape({
    current_command: PropTypes.string,
    command_map: PropTypes.object
  }),
  handler: PropTypes.shape({
    run_handler: PropTypes.func,
    change_handler: PropTypes.func,
    change_command_handler: PropTypes.func
  })
};

