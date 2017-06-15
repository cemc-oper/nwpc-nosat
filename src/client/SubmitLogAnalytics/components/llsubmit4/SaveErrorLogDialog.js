import React, {Component, PropTypes} from 'react'
import Modal from 'react-modal'

export default class SaveErrorLogDialog extends Component{
    constructor(props){
        super(props);
        this.state = {
            name_group_class: "form-group"
        }
    }

    getErrorLog() {
        let error_log = Object();
        let name_node = this.refs.name;
        error_log.name = name_node.value;
        let path_node = this.refs.path;
        error_log.path = path_node.value;
        return error_log;
    }

    handleCloseClick(){
        let { close_handler } = this.props.handler;
        this.setState({
            name_group_class: "form-group"
        });
        close_handler();
    }

    handleSaveClick(){
        let { save_handler } = this.props.handler;

        let name_node = this.refs.name;
        let name = name_node.value;
        if(name.length == 0){
            this.setState({
                name_group_class: "form-group has-error"
            });
            return;
        }

        let error_log = this.getErrorLog();
        this.setState({
            name_group_class: "form-group"
        });
        save_handler(error_log);
    }

    render(){
        const { is_open, error_log } = this.props;
        const {session_name_group_class } = this.state;
        return (
            <Modal
                isOpen={is_open}
                className="Modal__Bootstrap modal-dialog"
                contentLabel="Save Error Log Dialog"
            >
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" onClick={this.handleCloseClick.bind(this)}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <h4 className="modal-title">保存错误日志信息</h4>
                    </div>
                    <div className="modal-body">
                        <div className="alert alert-danger" role="adangerlert">正在开发中，仅在本次运行中有效！</div>
                        <form>
                            <div className={session_name_group_class}>
                                <label className="control-label">日志名称</label>
                                <input type="text" className="form-control" placeholder="日志名称"
                                       ref="name" defaultValue={error_log.name} />
                            </div>
                            <div className="form-group">
                                <label>日志路径</label>
                                <input type="text" className="form-control" placeholder="日志路径"
                                       ref="path" defaultValue={error_log.path} />
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