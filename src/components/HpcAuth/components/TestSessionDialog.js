import React, {Component, PropTypes} from 'react'
import Modal from 'react-modal'

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
        const { is_open, session, status } = this.props;
        const {session_name_group_class } = this.state;

        let status_bar;
        switch(status) {
            case 'active':
                status_bar = (
                    <div>
                        <p className="text-info">测试中..</p>
                        <div className="progress">
                            <div className="progress-bar progress-bar-info progress-bar-striped active" role="progressbar" aria-valuenow="45"
                                 aria-valuemin="0" aria-valuemax="100" style={{width: '45%'}}>
                            </div>
                        </div>
                    </div>
                );
                break;
            case 'success':
                status_bar = (
                    <div>
                        <p className="text-success">测试成功</p>
                        <div className="progress">
                            <div className="progress-bar progress-bar-success" role="progressbar" aria-valuenow="100"
                                 aria-valuemin="0" aria-valuemax="100" style={{width: '100%'}}>
                            </div>
                        </div>
                    </div>
                );
                break;
            case 'fail':
                status_bar = (
                    <div>
                        <p className="text-danger">测试失败</p>
                        <div className="progress">
                            <div className="progress-bar progress-bar-danger" role="progressbar" aria-valuenow="100"
                                 aria-valuemin="0" aria-valuemax="100" style={{width: '100%'}}>
                            </div>
                        </div>
                    </div>
                );
                break;
            case 'unknown':
            default:
                status_bar = (
                    <div className="progress">
                        <div className="progress-bar progress-bar-info" role="progressbar" aria-valuenow="0"
                             aria-valuemin="0" aria-valuemax="100" style={{width: '0%'}}>
                        </div>
                    </div>
                );
                break;
        }
        return (
            <Modal
                isOpen={is_open}
                className="Modal__Bootstrap modal-dialog"
            >
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" onClick={this.handleCloseClick.bind(this)}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <h4 className="modal-title">测试会话</h4>
                    </div>
                    <div className="modal-body">
                        {status_bar}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-default" onClick={this.handleCloseClick.bind(this)}>关闭</button>
                    </div>
                </div>
            </Modal>
        )
    }
}

TestSessionDialog.propTypes = {
    is_open: PropTypes.bool,
    session: PropTypes.shape({
        host: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
        port: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
        user: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
        password: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
    }),
    handler: PropTypes.shape({
        close_handler: PropTypes.func
    }),
    status: PropTypes.oneOf([
        'unknown', 'active', 'success', 'fail'
    ])
};

TestSessionDialog.defaultProps = {
    is_open: false,
    session: {
        host: null,
        port: null,
        user: null,
        password: null
    },
    status: 'unknown'
};