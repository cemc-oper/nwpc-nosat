import React, { Component, PropTypes } from 'react'
import { dispatch } from 'redux'
import { connect } from 'react-redux'

class SystemRunningTimeAnalyticsApp extends Component{
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <div className="row">
                    System Running Time Analytics
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
