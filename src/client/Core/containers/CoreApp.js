import React, { Component } from 'react';
import PropTypes from 'prop-types';


export default class CoreApp extends Component{
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
