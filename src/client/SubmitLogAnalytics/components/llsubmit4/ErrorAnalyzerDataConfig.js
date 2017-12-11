import React, { Component } from 'react';
import ReactDom from 'react-dom';
import PropTypes from 'prop-types'

import { Row, Col, Button, Form, Input, Menu, Dropdown, Alert } from 'antd';


import SaveErrorLogDialog from './SaveErrorLogDialog'

require("./style.css");


class DataConfigFormComponent extends Component{
  render(){
    const { error_log_path, error_log_list, handler } = this.props;

    let log_path_nodes = error_log_list.map(function(an_error_log, index){
      return (
        <Menu.Item key={index}>
          <a onClick={()=>{
            handler.handleLoadErrorLogClick(an_error_log);
          }}>
            {an_error_log.name}
          </a>
        </Menu.Item>
      )
    });

    let menu = (
      <Menu>
        { log_path_nodes }
      </Menu>
    );

    return (
      <Form>
        <Row className="config-row">
          <Col span={18}>
            <Form.Item>
              <Input
                type="text"
                ref="error_log_path_node"
                value={error_log_path}
                onChange={handler.handleErrorLogPathChange}
              />
            </Form.Item>
          </Col>
          <Col span={6} style={{ textAlign: 'right' }}>
            <Button onClick={handler.handleRequestErrorLogInfoClick}>
              测试
            </Button>
            <Button onClick={handler.handleSaveClick}>
              保存
            </Button>
            <Dropdown.Button overlay={menu}>
              打开
            </Dropdown.Button>
          </Col>
        </Row>
      </Form>
    );
  }
}


export default  class ErrorAnalyzerDataConfig extends Component{
  constructor(props) {
    super(props);
    this.state = {
      is_save_dialog_open: false,
      working_error_log: {
        path: null,
        name: null
      }
    }
  }

  getConfig(){
    let error_log_data_config = Object();
    error_log_data_config.error_log_path = this.getErrorLogPath();
    return error_log_data_config;
  }

  getErrorLogPath(){
    return this.props.error_log_path;
  }

  handleErrorLogPathChange(event){
    let error_log_path = event.target.value;
    const { change_error_log_path_handler } = this.props.handler;
    change_error_log_path_handler(error_log_path);
  }

  handleRequestErrorLogInfoClick(event) {
    const { request_error_log_info_handler } = this.props.handler;
    request_error_log_info_handler();
  }

  handleLoadErrorLogClick(error_log){
    const {load_error_log_handler } = this.props.handler;
    load_error_log_handler(error_log);
  }

  handleSaveClick() {
    let error_log = {
      name: null,
      path: this.getErrorLogPath()
    };
    error_log.name = null;
    this.setState({
      is_save_dialog_open: true,
      working_error_log: error_log
    });
  }

  closeSaveSessionDialog() {
    this.setState({is_save_dialog_open: false});
  }

  acceptSaveSessionDialog(error_log) {
    const {save_click_handler} = this.props.handler;
    save_click_handler(error_log);
    this.setState({is_save_dialog_open: false});
  }

  render(){
    let component = this;
    const { error_log_path, error_log_info, error_log_list } = this.props;

    let { is_save_dialog_open, working_error_log } = this.state;

    let log_info_node = null;
    if(error_log_info) {
      const {range} = error_log_info;
      const {start_date_time, end_date_time, count} = range;
      log_info_node = (
        <Row>
          <Col span={24}>
            <Alert
              closable
              type="info"
              message={(<div>
                  <p>
                    <strong>日志记录时间</strong>：{start_date_time.format()} 至 {end_date_time.format()}
                  </p>
                  <p>
                    <strong>记录总数</strong>: {count}
                  </p>
                </div>
              )}
            />
          </Col>
        </Row>
      )
    }

    return (
      <div>
        <h4>错误日志路径</h4>
        <DataConfigFormComponent
          error_log_path={error_log_path}
          error_log_list={error_log_list}
          ref={(form) => {this.form=form;}}
          handler={{
            handleErrorLogPathChange: this.handleErrorLogPathChange.bind(this),
            handleLoadErrorLogClick: this.handleLoadErrorLogClick.bind(this),
            handleRequestErrorLogInfoClick: this.handleRequestErrorLogInfoClick.bind(this),
            handleSaveClick: this.handleSaveClick.bind(this)
          }}
        />
        { log_info_node }
        <SaveErrorLogDialog
          is_open={is_save_dialog_open}
          error_log={working_error_log}
          handler={{
            close_handler: this.closeSaveSessionDialog.bind(this),
            save_handler: this.acceptSaveSessionDialog.bind(this)
          }}
        />
      </div>
    )
  }
}

ErrorAnalyzerDataConfig.propTypes = {
  error_log_path: PropTypes.string,
  error_log_info: PropTypes.oneOfType(
    [
      PropTypes.object,
      PropTypes.shape({
        range: PropTypes.shape({
          start_date_time: PropTypes.object,
          end_date_time: PropTypes.object,
          count: PropTypes.number
        })
      })
    ]
  ),
  error_log_list: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    path: PropTypes.string,
  })),
  handler: PropTypes.shape({
    change_error_log_path_handler: PropTypes.func,
    request_error_log_info_handler: PropTypes.func,
    load_error_log_handler: PropTypes.func,
    save_click_handler: PropTypes.func
  })
};