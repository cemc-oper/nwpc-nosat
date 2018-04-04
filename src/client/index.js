import React from 'react'
import ReactDOM from 'react-dom'

import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'

import createHistory from 'history/createHashHistory'
import { routerMiddleware } from 'react-router-redux';

import operationSystemAnalyticsAppReducer from './Core/reducers/index'

import Root from './Core/Root'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const history = createHistory({
  hashType: "slash"
});

const router_middleware = routerMiddleware(history);

const middle_wares = [
  thunkMiddleware,
  router_middleware,
];

let store = createStore(
  operationSystemAnalyticsAppReducer,
  composeEnhancers(
    applyMiddleware(
      ...middle_wares
    )
  ),
);

const element = (<Root store={store} history={history}/>);

ReactDOM.render(
  element,
  document.getElementById('app')
);
