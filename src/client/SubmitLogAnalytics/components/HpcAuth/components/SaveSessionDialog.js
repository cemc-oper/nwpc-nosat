import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Modal from 'react-modal'

export default class SaveSessionDialog extends Component{
    constructor(props){
        super(props);
        this.state = {
            session_name_group_class: "form-group"
        }
    }

    getSession() {
        let session = Object();
        let name_node = this.refs.name;
        session.name = name_node.value;
        let host_node = this.refs.host;
        session.host = host_node.value;
        let port_node = this.refs.port;
        session.port = parseInt(port_node.value, 10);
        let user_node = this.refs.user;
        session.user = user_node.value;
        let password_node = this.refs.password;
        session.password = password_node.value;
        return session;
    }

    handleCloseClick(){
        let { close_handler } = this.props.handler;
        this.setState({
            session_name_group_class: "form-group"
        });
        close_handler();
    }

    handleSaveClick(){
        let { save_handler } = this.props.handler;

        let session_name_node = this.refs.name;
        let session_name = session_name_node.value;
        if(session_name.length == 0){
            this.setState({
                session_name_group_class: "form-group has-error"
            });
            return;
        }

        let session = this.getSession();
        this.setState({
            session_name_group_class: "form-group"
        });
        save_handler(session);
    }

    render(){
        const { is_open, session } = this.props;
        const {session_name_group_class } = this.state;
        return (
            <Modal
                isOpen={is_open}
                className="Modal__Bootstrap modal-dialog"
                contentLabel="Save Session Label"
            >
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" onClick={this.handleCloseClick.bind(this)}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <h4 className="modal-title">保存会话</h4>
                    </div>
                    <div className="modal-body">
                        <div className="alert alert-danger" role="adangerlert">正在开发中，仅在本次运行中有效！</div>
                        <form>
                            <div className={session_name_group_class}>
                                <label className="control-label">会话名称</label>
                                <input type="text" className="form-control" placeholder="会话名称"
                                       ref="name" defaultValue={session.name} />
                            </div>
                            <div className="form-group">
                                <label>主机</label>
                                <input type="text" className="form-control" placeholder="主机"
                                       ref="host" defaultValue={session.host} />
                            </div>
                            <div className="form-group">
                                <label>端口</label>
                                <input type="text" className="form-control" placeholder="主机"
                                       ref="port" defaultValue={session.port} />
                            </div>
                            <div className="form-group">
                                <label>用户</label>
                                <input type="text" className="form-control" placeholder="主机"
                                       ref="user" defaultValue={session.user} />
                            </div>
                            <div className="form-group">
                                <label>密码</label>
                                <input type="password" className="form-control" placeholder="主机"
                                       ref="password" defaultValue={session.password} />
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-default" onClick={this.handleCloseClick.bind(this)}>关闭</button>
                        <button type="button" className="btn btn-primary" onClick={this.handleSaveClick.bind(this)}>保存</button>
                    </div>
                </div>
            </Modal>
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