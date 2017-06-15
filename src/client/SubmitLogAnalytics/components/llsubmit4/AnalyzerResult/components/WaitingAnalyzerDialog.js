import React, {Component, PropTypes} from 'react'
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
        const { is_open } = this.props;
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
                        <h4 className="modal-title">日志分析</h4>
                    </div>
                    <div className="modal-body">
                        <div>
                        <p className="text-info">分析程序正在运行..</p>
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
    })
};

WaitingAnalyzerDialog.defaultProps = {
    is_open: false
};