import React, { Component, PropTypes } from 'react';
require("./style.css");

import LoadSessionDropMenu from "./LoadSessionDropMenu"
import SessionBarEditor from "./SessionBarEditor"

export default class HpcAuth extends Component{
    constructor(props) {
        super(props);
    }

    getAuth() {
        return this.refs.session_bar_editor.getAuth();
    }

    render() {
        const {host, port, user, password} = this.props;
        return (
            <div className="hpc-auth-box">
                <div className="row">
                    <div className="col-xs-9">
                        <SessionBarEditor ref="session_bar_editor"
                            host={host}
                            port={port}
                            user={user}
                            password={password}
                        />
                    </div>
                    <div className="col-xs-3">
                        <div className="row">
                            <div className="btn-group pull-right">
                                <button className="btn btn-default">测试</button>
                                <button className="btn btn-default">保存</button>
                                <div className="btn-group">
                                    <LoadSessionDropMenu />
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
