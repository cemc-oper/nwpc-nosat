import React, { Component, PropTypes } from 'react';

export default  class HpcAuth extends Component{
    constructor(props) {
        super(props);
    }

    getAuth() {
        let auth = Object();
        let host_node = this.refs.host;
        auth.host = host_node.value;
        let port_node = this.refs.port;
        auth.port = port_node.value;
        let user_node = this.refs.user;
        auth.user = user_node.value;
        let password_node = this.refs.password;
        auth.password = password_node.value;
        return auth;
    }

    render() {
        const {host, port, user, password} = this.props;
        return (
            <div>
                <div className="row">

                    <div className="col-md-12">
                        <div className="panel panel-info">
                            <div className="panel-heading">
                                <h3 className="panel-title">账户</h3>
                            </div>
                            <div className="panel-body">
                                <div className="col-xs-4">
                                    <label>主机</label>
                                    <input type="text" className="form-control" ref="host" defaultValue={host} />
                                </div>
                                <div className="col-xs-2">
                                    <label>端口</label>
                                    <input type="text" className="form-control" ref="port" defaultValue={port} />
                                </div>
                                <div className="col-xs-3">
                                    <label>用户</label>
                                    <input type="text" className="form-control" ref="user" defaultValue={user}/>
                                </div>

                                <div className="col-xs-3">
                                    <label>密码</label>
                                    <input type="password" className="form-control" ref="password" defaultValue={password} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

HpcAuth.propTypes = {
    host: PropTypes.string,
    port: PropTypes.number,
    user: PropTypes.string,
    password: PropTypes.string
};
