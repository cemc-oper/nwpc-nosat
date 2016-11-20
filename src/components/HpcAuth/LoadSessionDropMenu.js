import React, { Component, PropTypes } from 'react';

export default class LoadSessionDropMenu extends Component{
    render(){
        const { session_list } = this.props;
        let session_nodes = session_list.map(function(session, index){
            return (
                <li role="presentation" key={index}>
                    <a role="menuitem" tabIndex="-1" href="#">{session.name}</a>
                </li>
            )
        });
        return (
            <div className="dropdown">
                <button className="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown">
                    载入
                    <span className="caret"/>
                </button>
                <ul className="dropdown-menu dropdown-menu-right" role="menu" aria-labelledby="dropdownMenu1">
                    { session_nodes }
                </ul>
            </div>
        )
    }
}

LoadSessionDropMenu.propTypes = {
    session_list: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string
    }))
};
