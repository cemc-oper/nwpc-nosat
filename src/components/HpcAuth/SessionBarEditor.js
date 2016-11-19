import React, { Component, PropTypes } from 'react';

export default class SessionBarEditor extends Component{

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

    render(){
        const {host, port, user, password} = this.props;
        return (
            <div className="row">
                <div className="col-xs-4">
                    <input type="text" className="form-control" placeholder="主机"
                           ref="host" defaultValue={host} />
                </div>
                <div className="col-xs-2">
                    <input type="text" className="form-control" placeholder="端口"
                           ref="port" defaultValue={port} />
                </div>
                <div className="col-xs-3">
                    <input type="text" className="form-control" placeholder="用户名"
                           ref="user" defaultValue={user}/>
                </div>
                <div className="col-xs-3">
                    <input type="password" className="form-control" placeholder="密码"
                           ref="password" defaultValue={password} />
                </div>
            </div>
        )
    }
}

SessionBarEditor.propTypes = {
    host: PropTypes.string,
    port: PropTypes.number,
    user: PropTypes.string,
    password: PropTypes.string
};