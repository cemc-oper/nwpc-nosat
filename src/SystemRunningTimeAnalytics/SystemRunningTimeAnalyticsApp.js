import React, { Component, PropTypes } from 'react'
import { dispatch } from 'redux'
import { connect } from 'react-redux'
import {Link} from 'react-router'

class SystemRunningTimeAnalyticsApp extends Component{
    constructor(props) {
        super(props);
    }

    handleDrawClick(){

    }

    render() {
        return (
            <div className="container-fluid">
                <nav className="navbar navbar-default" role="navigation">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <Link className="navbar-brand" to="/">NOST</Link>
                        </div>
                        <div className="collapse navbar-collapse">
                            <ul className="nav navbar-nav">
                                <li><Link to="/system-running-time-analytics">运行时间</Link></li>
                            </ul>
                        </div>

                    </div>
                </nav>
                <div className="row">
                    <div className="col-md-6">
                    <form role="form">
                        <div className="form-group">
                            <label htmlFor="exampleInputFile">数据文件</label>
                            <input type="file" id="exampleInputFile" />
                            <p className="help-block">请选择符合 nuwe-timeline 规范的数据文件。</p>
                        </div>
                        <button type="button" className="btn btn-default" onClick={this.handleDrawClick.bind(this)}>绘图</button>
                    </form>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state){
    return {

    }
}

export default connect(mapStateToProps)(SystemRunningTimeAnalyticsApp)
