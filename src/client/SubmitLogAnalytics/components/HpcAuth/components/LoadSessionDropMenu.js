import React, { Component } from 'react';
import PropTypes from 'prop-types'

import { Button, Dropdown, Menu } from 'antd';


export default class LoadSessionDropMenu extends Component{

  handleLoadSessionClick(item, key, keyPath){
    console.log("[LoadSessionDropMenu.handleLoadSessionClick] item:", item);
    let session = item.props.session;
    let {load_session_handler} = this.props.handler;
    load_session_handler(session);
  }

  render(){
    const { session_list } = this.props;
    let component = this;
    let session_nodes = session_list.map(function(session, index){
      return (
        <Menu.Item key={index} session={session}>
          {session.name}
        </Menu.Item>
      )
    });

    let menu = (
      <Menu onClick={component.handleLoadSessionClick.bind(component)}>
        { session_nodes }
      </Menu>
    );

    return (
      <Dropdown.Button overlay={menu}>
        打开
      </Dropdown.Button>
    )
  }
}

LoadSessionDropMenu.propTypes = {
  session_list: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string
  })),
  handler: PropTypes.shape({
    load_session_handler: PropTypes.func.isRequired
  }).isRequired
};
