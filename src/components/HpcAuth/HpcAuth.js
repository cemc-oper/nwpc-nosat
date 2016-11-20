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
        const { current_session, session_list } = this.props;
        const { host, port, user, password} = current_session;
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
                        <div className="btn-group pull-right">
                            <button className="btn btn-default">测试</button>
                            <button className="btn btn-default">保存</button>
                            <div className="btn-group">
                                <LoadSessionDropMenu
                                    rel="load_session_drop_menu"
                                    session_list={session_list}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

HpcAuth.propTypes = {
    current_session: PropTypes.shape({
        host: PropTypes.string,
        port: PropTypes.number,
        user: PropTypes.string,
        password: PropTypes.string,
    }),
    session_list: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string
    }))
};

HpcAuth.defaultProps={
    session_list: [
        { name: 'nwp' },
        { name: 'nwp_qu' },
        { name: 'nwp_pd' },
        { name: 'nwp_sp' },
    ]
};