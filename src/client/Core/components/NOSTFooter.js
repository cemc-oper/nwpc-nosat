import React, { Component } from 'react'
import { Layout } from 'antd';

const {Footer} = Layout;

export class NOSTFooter extends Component{
  constructor(props) {
    super(props);
  }

  render(){
    return (
      <Footer style={{ textAlign: 'center' }}>
        NOST &copy; 2017 NWPC
      </Footer>
    )
  }
}