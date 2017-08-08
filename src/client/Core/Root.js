import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import { Router } from 'react-router'

import {ipcRenderer} from 'electron'

import routes from './routes'

export default class Root extends Component {
  componentDidMount() {
    ipcRenderer.send('analytics-tool.server.start');
  }

  componentWillUnmount() {
    ipcRenderer.send('analytics-tool.server.stop');
  }

  render () {
    const { store, history } = this.props;
    return (
      <Provider store={store}>
        <div>
          <Router history={history} routes={routes}/>
        </div>
      </Provider>
    )
  }
}

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};