import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Modal, Progress, Alert, Icon} from 'antd'

export default class TestSessionDialog extends Component{
  constructor(props){
    super(props);
    this.state = {
    }
  }

  handleCloseClick(){
    const { close_handler } = this.props.handler;
    close_handler();
  }

  render(){
    const { is_open, session, status, message } = this.props;

    let status_bar;
    switch(status) {
      case 'active':
        status_bar = (
          <div>
            <p className="text-info"><Icon type="loading" />测试中..</p>
            <Progress percent={45} status="active" showInfo={false} />
          </div>
        );
        break;
      case 'success':
        status_bar = (
          <div>
            <p className="text-success"><Icon type="check-circle" />测试成功</p>
            <Progress percent={100} showInfo={false} />
          </div>
        );
        break;
      case 'error':
        status_bar = (
          <div>
            <p className="text-danger"><Icon type="close-circle" />测试失败</p>
            <Progress percent={100} status="exception" showInfo={false} />
            <Alert type="error" message={message}/>
          </div>
        );
        break;
      case 'unknown':
      default:
        status_bar = (
          <div>
            <Progress percent={0} showInfo={false} />
          </div>
        );
        break;
    }
    return (
      <Modal
        visible={is_open}
        title="测试会话"
        onOk={this.handleCloseClick.bind(this)}
        onCancel={this.handleCloseClick.bind(this)}
      >
        {status_bar}
      </Modal>
    )
  }
}

TestSessionDialog.propTypes = {
  is_open: PropTypes.bool,
  session: PropTypes.shape({
    host: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    port: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
    user: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    password: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
  }),
  handler: PropTypes.shape({
    close_handler: PropTypes.func
  }),
  status: PropTypes.oneOf([
    'unknown', 'active', 'success', 'error'
  ]),
  message: PropTypes.string
};

TestSessionDialog.defaultProps = {
  is_open: false,
  session: {
    host: null,
    port: null,
    user: null,
    password: null
  },
  status: 'unknown',
  message: ''
};