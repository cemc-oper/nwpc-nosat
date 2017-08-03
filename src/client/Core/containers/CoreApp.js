import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { dispatch } from 'redux'
import { connect } from 'react-redux'

global.jQuery = require('jquery');
require('bootstrap-loader');


class CoreApp extends Component{
  constructor(props) {
    super(props);
  }

  render() {
    const {children} = this.props;
    return (
      <div>
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
