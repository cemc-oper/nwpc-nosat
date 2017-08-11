import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Input, Alert } from 'antd'


export default class SaveErrorLogDialog extends Component{
  constructor(props){
    super(props);
    this.state = {
      name_group_class: "form-group"
    }
  }

  getErrorLog() {
    let error_log = Object();
    const form = this.form.props.form;
    error_log.name = form.getFieldValue('name');
    error_log.path = form.getFieldValue('path');
    return error_log;
  }

  handleCloseClick(){
    let { close_handler } = this.props.handler;
    close_handler();
  }

  handleSaveClick(){
    let { save_handler } = this.props.handler;
    const form = this.form.props.form;
    form.validateFields((err, values)=>{
      if(err)
        return;

      let error_log = this.getErrorLog();
      save_handler(error_log);
    });

  }

  render(){
    const { is_open, error_log } = this.props;

    let SaveErrorLogForm = Form.create()((props)=>{
      const { is_open, error_log, handler, form } = props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={is_open}
          title="保存错误日志信息"
          onOk={handler.save_handler}
          onCancel={handler.close_handler}
        >
          <Alert message="正在开发中，仅在本次运行中有效！" type="warning" closable/>
          <Form>
            <Form.Item label="日志名称">
              {getFieldDecorator('name', {
                rules: [{required: true, message: "请输入日志名称"}],
                initialValue: error_log.name
              })(
                <Input type="text"  placeholder="日志名称"/>
              )}
            </Form.Item>
            <Form.Item label="日志路径">
              {getFieldDecorator('path', {
                rules: [{required: true, message: "请输入日志路径"}],
                initialValue: error_log.path
              })(
                <Input type="text"  placeholder="日志路径"/>
              )}
            </Form.Item>
          </Form>
        </Modal>
      )
    });

    return (
      <SaveErrorLogForm
        is_open={is_open}
        error_log={error_log}
        wrappedComponentRef={(form)=>{this.form = form}}
        handler={{
          save_handler: this.handleSaveClick.bind(this),
          close_handler: this.handleSaveClick.bind(this)
        }}
      />
    )
  }
}

SaveErrorLogDialog.propTypes = {
  is_open: PropTypes.bool,
  error_log: PropTypes.shape({
    path: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    name: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
  }),
  handler: PropTypes.shape({
    close_handler: PropTypes.func,
    save_handler: PropTypes.func
  })
};

SaveErrorLogDialog.defaultProps = {
  is_open: false,
  error_log: {
    path: null,
    name: null
  }
};