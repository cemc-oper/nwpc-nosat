import React, { Component, PropTypes } from 'react'
import { dispatch } from 'redux'
import { connect } from 'react-redux'
import {Link} from 'react-router'

import {ipcRenderer} from 'electron'


class WelcomeApp extends Component{
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <h1>业务系统分析工具 NOSAT</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <div className="jumbotron">
                            <h3>作业提交日志分析</h3>
                            <p>...</p>
                            <p>
                                <Link to="/submit-log-analytics" className="btn btn-primary btn-lg" role="button">前往</Link>
                            </p>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="jumbotron">
                            <h3>系统运行时间分析</h3>
                            <p>...</p>
                            <p>
                                <Link to="/system-running-time-analytics" className="btn btn-primary btn-lg" role="button">前往</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state){
    return {

    }
}

export default connect(mapStateToProps)(WelcomeApp)
