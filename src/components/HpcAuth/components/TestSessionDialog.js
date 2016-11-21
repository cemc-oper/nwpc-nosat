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
        const { is_open, session } = this.props;
        const {session_name_group_class } = this.state;
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
                        <div className="progress">
                            <div className="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="45"
                                 aria-valuemin="0" aria-valuemax="100" style={{width: '45%'}}>
                            </div>
                        </div>
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
    })
};

TestSessionDialog.defaultProps = {
    is_open: false,
    session: {
        host: null,
        port: null,
        user: null,
        password: null
    }
};