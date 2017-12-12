import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { dispatch } from 'redux'

import { Row, Col, Button, Form } from 'antd';

require("./style.scss");

import LoadSessionDropMenu from "./components/LoadSessionDropMenu"
import SessionBarEditor from "./components/SessionBarEditor"
import SaveSessionDialog from "./components/SaveSessionDialog"
import TestSessionDialog from "./components/TestSessionDialog"

import { ipcRenderer } from 'electron'

export default class HpcAuth extends Component{
  constructor(props) {
    super(props);
    this.state = {
      is_save_dialog_open: false,
      working_session: {
        host: null,
        port: null,
        user: null,
        password: null,
        name: null
      },
      is_test_dialog_open: false
    }
  }

  componentDidMount(){
  }

  getSession() {
    return this.refs.session_bar_editor.getSession();
  }

  handleTestClick() {
    this.setState({is_test_dialog_open: true});

    let session = this.getSession();
    const { test_click_handler } = this.props.handler;
    test_click_handler(session);
  }

  closeTestSessionDialog() {
    this.setState({is_test_dialog_open: false});
  }

  handleSaveClick() {
    let session = this.getSession();
    session.name = null;
    this.setState({
      is_save_dialog_open: true,
      working_session: session
    });
  }

  closeSaveSessionDialog() {
    this.setState({is_save_dialog_open: false});
  }

  acceptSaveSessionDialog(session) {
    const {save_click_handler} = this.props.handler;
    save_click_handler(session);
    this.setState({is_save_dialog_open: false});
  }

  render() {
    const { session_list, test_session, current_session } = this.props;
    let { is_save_dialog_open, working_session, is_test_dialog_open } = this.state;
    const { host, port, user, password} = current_session;

    return (
      <div className="hpc-auth-box">
        <Row>
          <Col span={18}>
            <SessionBarEditor
              ref="session_bar_editor"
              host={host}
              port={port}
              user={user}
              password={password}
              handler={{
                change_handler: this.props.handler.bar_editor_change_handler.bind(this)
              }}
            />
          </Col>
          <Col span={6} style={{ textAlign: 'right' }}>
              <Button onClick={this.handleTestClick.bind(this)}>测试</Button>
              <Button onClick={this.handleSaveClick.bind(this)}>保存</Button>
              <LoadSessionDropMenu
                rel="load_session_drop_menu"
                session_list={session_list}
                handler={{
                  load_session_handler: this.props.handler.load_session_handler.bind(this)
                }}
              />
          </Col>
        </Row>
        <SaveSessionDialog
          is_open={is_save_dialog_open}
          session={working_session}
          handler={{
            close_handler: this.closeSaveSessionDialog.bind(this),
            save_handler: this.acceptSaveSessionDialog.bind(this)
          }}
        />
        <TestSessionDialog
          is_open={is_test_dialog_open}
          session={working_session}
          handler={{
            close_handler: this.closeTestSessionDialog.bind(this)
          }}
          status={test_session.status}
          message={test_session.message}
        />
      </div>
    );
  }
}

HpcAuth.propTypes = {
  current_session: PropTypes.shape({
    host: PropTypes.string,
    port: PropTypes.number,
    user: PropTypes.string,
    password: PropTypes.string,
  }),
  session_list: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string
  })),
  handler: PropTypes.shape({
    test_click_handler: PropTypes.func,
    save_click_handler: PropTypes.func,
    load_session_handler: PropTypes.func,
    bar_editor_change_handler: PropTypes.func
  }),
  test_session: PropTypes.object
};
