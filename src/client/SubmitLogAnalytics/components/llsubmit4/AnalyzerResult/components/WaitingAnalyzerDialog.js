import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Modal from 'react-modal'

export default class WaitingAnalyzerDialog extends Component{
  constructor(props){
    super(props);
  }

  handleCloseClick(){
    const { close_handler } = this.props.handler;
    close_handler();
  }

  render(){
    const { is_open, content } = this.props;
    console.log("[WaitingAnalyzerDialog.render] content:", content);
    const { title, message, value } = content;
    return (
      <Modal
        isOpen={is_open}
        className="Modal__Bootstrap modal-dialog"
        contentLabel="Waiting Analyzer Dialog"
      >
        <div className="modal-content">
          <div className="modal-header">
            {/*<button type="button" className="close" onClick={this.handleCloseClick.bind(this)}>*/}
              {/*<span aria-hidden="true">&times;</span>*/}
            {/*</button>*/}
            <h4 className="modal-title">{title}</h4>
          </div>
          <div className="modal-body">
            <div>
              <p className="text-info">{message}</p>
              <div className="progress">
                <div className="progress-bar progress-bar-info progress-bar-striped active" role="progressbar" aria-valuenow="45"
                     aria-valuemin="0" aria-valuemax="100" style={{width: '45%'}}>
                </div>
              </div>
            </div>
          </div>
          {/*<div className="modal-footer">*/}
            {/*<button type="button" className="btn btn-default" onClick={this.handleCloseClick.bind(this)}>关闭</button>*/}
          {/*</div>*/}
        </div>
      </Modal>
    )
  }
}

WaitingAnalyzerDialog.propTypes = {
  is_open: PropTypes.bool,
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
  is_open: false,
  content: {
    title: "日志分析",
    message: "分析程序正在运行...",
    value: 45
  }
};