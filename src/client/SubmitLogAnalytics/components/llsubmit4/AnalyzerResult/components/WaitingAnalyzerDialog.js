import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Modal, Progress, Alert} from 'antd'

export default class WaitingAnalyzerDialog extends Component{
  constructor(props){
    super(props);
  }

  handleCloseClick(){
    const { close_handler } = this.props.handler;
    close_handler();
  }

  render(){
    const { visible, content } = this.props;
    // console.log("[WaitingAnalyzerDialog.render] content:", content);
    const { title, message, value } = content;
    return (
      <Modal
        visible={visible}
        title={title}
      >
        <div>
          <Alert message={message} type="info"/>
          <Progress percent={value} status="active" showInfo={false}/>
        </div>
      </Modal>
    )
  }
}

WaitingAnalyzerDialog.propTypes = {
  visible: PropTypes.bool,
  handler: PropTypes.shape({
    close_handler: PropTypes.func
  }),
  content: PropTypes.shape({
    title: PropTypes.string,
    message: PropTypes.string,
    value: PropTypes.number
  })
};

WaitingAnalyzerDialog.defaultProps = {
  visible: false,
  content: {
    title: "日志分析",
    message: "分析程序正在运行...",
    value: 45
  }
};