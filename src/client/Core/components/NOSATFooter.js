import React, { Component } from 'react'
import { Layout } from 'antd';

const {Footer} = Layout;

export class NOSATFooter extends Component{
  constructor(props) {
    super(props);
  }

  render(){
    return (
      <Footer style={{ textAlign: 'center' }}>
        NOSAT &copy; 2017 NWPC
      </Footer>
    )
  }
}