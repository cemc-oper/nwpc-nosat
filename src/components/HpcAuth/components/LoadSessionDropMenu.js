import React, { Component, PropTypes } from 'react';

export default class LoadSessionDropMenu extends Component{

    handleLoadSessionClick(session){
        let {load_session_handler} = this.props.handler;
        load_session_handler(session);
    }

    render(){
        const { session_list } = this.props;
        var component = this;
        let session_nodes = session_list.map(function(session, index){
            return (
                <li key={index}>
                    <a href="#" onClick={component.handleLoadSessionClick.bind(component, session)}>{session.name}</a>
                </li>
            )
        });
        return (
            <div className="btn-group">
                <button className="btn btn-default" type="button">
                    载入
                </button>
                <button className="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown">
                    <span className="caret"/>
                </button>
                <ul className="dropdown-menu dropdown-menu-right" role="menu">
                    <li><a href="#">会话窗口</a></li>
                    <li className="divider" />
                    { session_nodes }
                </ul>
            </div>
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
