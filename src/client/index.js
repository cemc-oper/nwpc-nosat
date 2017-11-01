import React from 'react'
import ReactDOM from 'react-dom'

import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'

import { hashHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'


import operationSystemAnalyticsAppReducer from './Core/reducers/index'

import Root from './Core/Root'

let store = createStore(
  operationSystemAnalyticsAppReducer,
  applyMiddleware(
    thunkMiddleware
  )
);

const history = syncHistoryWithStore(hashHistory, store);

const element = (<Root store={store} history={history}/>);

ReactDOM.render(
  element,
  document.getElementById('app')
);
