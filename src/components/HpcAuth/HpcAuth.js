import React, { Component, PropTypes } from 'react';
require("./style.css");

export default class HpcAuth extends Component{
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
            <div className="hpc-auth-box">
                <div className="row">
                    <div className="col-xs-9">
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
                    </div>
                    <div className="col-xs-3">
                        <div className="dropdown pull-right">
                            <button className="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown">
                                载入
                                <span className="caret"/>
                            </button>
                            <ul className="dropdown-menu dropdown-menu-right" role="menu" aria-labelledby="dropdownMenu1">
                                <li role="presentation"><a role="menuitem" tabIndex="-1" href="#">nwp</a></li>
                                <li role="presentation"><a role="menuitem" tabIndex="-1" href="#">nwp_qu</a></li>
                                <li role="presentation"><a role="menuitem" tabIndex="-1" href="#">nwp_pd</a></li>
                                <li role="presentation"><a role="menuitem" tabIndex="-1" href="#">nwp_sp</a></li>
                            </ul>
                        </div>
                        <button className="btn btn-default pull-right">保存</button>
                        <button className="btn btn-default pull-right">测试</button>
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
