import React from 'react'
import ReactDOM from 'react-dom'

import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'

import { hashHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'


import operationSystemAnalyticsAppReducer from './Core/reducers/index'

import Root from './Core/Root'



const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

let store = createStore(
  operationSystemAnalyticsAppReducer,composeEnhancers(
  applyMiddleware(
    thunkMiddleware
  )),
);

const history = syncHistoryWithStore(hashHistory, store);

const element = (<Root store={store} history={history}/>);

ReactDOM.render(
  element,
  document.getElementById('app')
);
