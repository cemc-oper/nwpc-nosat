import React, { Component, PropTypes } from 'react'
import { dispatch } from 'redux'
import { connect } from 'react-redux'
import {Link} from 'react-router'

import {ipcRenderer} from 'electron'


class CoreApp extends Component{
    constructor(props) {
        super(props);
    }

    render() {
        const {children} = this.props;
        return (
            <div className="container-fluid">
                {children}
            </div>
        )
    }
}

function mapStateToProps(state){
    return {

    }
}

export default connect(mapStateToProps)(CoreApp)
