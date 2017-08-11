import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Modal, Input, InputNumber, Form, Alert } from 'antd'


class SaveSessionFormComponent extends Component {
  render() {
    const {handler, form, is_open, session} = this.props;
    const {getFieldDecorator} = form;
    return (
      <Modal
        title="保存会话"
        visible={is_open}
        onOk={handler.save_handler}
        onCancel={handler.close_handler}
      >
        <Alert message="正在开发中，仅在本次运行中有效！" type="warning" closable/>
        <Form>
          <Form.Item
            label="会话名称"
          >{
            getFieldDecorator('name', {
              initialValue: session.name,
              rules: [{ required: true, message: "请输入会话名称"}]
            })(
              <Input type="text" placeholder="会话名称"/>
            )}
          </Form.Item>
          <Form.Item
            label="主机"
          >{
            getFieldDecorator('host', {
              initialValue: session.host,
              rules: [{ required: true, message: "请输入主机名"}]
            })(
              <Input type="text" placeholder="主机"/>
            )}
          </Form.Item>
          <Form.Item
            label="端口"
          >{
            getFieldDecorator('port', {
              initialValue: session.port
            })(
              <InputNumber placeholder="端口"/>
            )}
          </Form.Item>
          <Form.Item
            label="用户名"
          >{
            getFieldDecorator('user', {
              initialValue: session.user
            })(
              <Input type="text" placeholder="用户"/>
            )}
          </Form.Item>
          <Form.Item
            label="密码"
          >{
            getFieldDecorator('password', {
              initialValue: session.password
            })(
              <Input type="password" placeholder="密码"/>
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

SaveSessionFormComponent.propTypes = {
  is_open: PropTypes.bool,
  session: PropTypes.shape({
    host: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    port: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
    user: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    password: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    name: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
  }),
  handler: PropTypes.shape({
    close_handler: PropTypes.func,
    save_handler: PropTypes.func
  })
};


export default class SaveSessionDialog extends Component{
  constructor(props){
    super(props);
  }

  getSession() {
    const form = this.save_session_form;
    let session = Object();
    session.name = form.getFieldValue('name');
    session.host = form.getFieldValue('host');
    session.port = parseInt(form.getFieldValue('port'), 10);
    session.user = form.getFieldValue('user');
    session.password = form.getFieldValue('password');

    return session;
  }

  handleSaveClick(e){
    const form = this.save_session_form;
    form.validateFields((err, values)=>{
      if (err) {
        return;
      }
      // console.log("[SaveSessionDialog.handleSaveClick] values:", values);

      let { save_handler } = this.props.handler;
      let session = this.getSession();
      save_handler(session);
    });
  }

  handleCloseClick(){
    let { close_handler } = this.props.handler;
    close_handler();
  }


  render(){
    const { is_open, session } = this.props;
    let handler = {
      save_handler: this.handleSaveClick.bind(this),
      close_handler: this.handleCloseClick.bind(this)
    };
    // console.log("[SaveSessionDialog.render] session:", session);
    let SaveSessionForm = Form.create()(SaveSessionFormComponent);
    return (
      <SaveSessionForm
        ref={(save_session_form)=>{this.save_session_form=save_session_form}}
        is_open={is_open}
        handler={handler}
        session={session}
      />
    )
  }
}

SaveSessionDialog.propTypes = {
  is_open: PropTypes.bool,
  session: PropTypes.shape({
    host: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    port: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
    user: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    password: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    name: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
  }),
  handler: PropTypes.shape({
    close_handler: PropTypes.func,
    save_handler: PropTypes.func
  })
};

SaveSessionDialog.defaultProps = {
  is_open: false,
  session: {
    host: null,
    port: null,
    user: null,
    password: null,
    name: null
  }
};