import React from 'react'
import ReactDOM from 'react-dom'

import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'

import createHistory from 'history/createHashHistory'
import { routerMiddleware } from 'react-router-redux';

import operationSystemAnalyticsAppReducer from './Core/reducers/index'

import Root from './Core/Root'

// plugin
// load plugin
function loadSubmitAnalytics(){
  const plugin = require('./SubmitLogAnalytics');
  plugin.prepareRoute();
}
loadSubmitAnalytics();

function loadSystemRunningTimeAnalytics(){
  const plugin = require('./SystemRunningTimeAnalytics');
  plugin.prepareRoute();
}
loadSystemRunningTimeAnalytics();


function createClientHistory(){
  return createHistory({
    hashType: "slash"
  })
}

const history = createClientHistory();

const router_middleware = routerMiddleware(history);
const middle_wares = [
  thunkMiddleware,
  router_middleware,
];

function createClientStore(app_reducer, middle_wares){
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  return createStore(
    app_reducer,
    composeEnhancers(
      applyMiddleware(
        ...middle_wares
      )
    ),
  );
}

const store = createClientStore(
  operationSystemAnalyticsAppReducer,
  middle_wares
);

const element = (
  <Root store={store} history={history} />
);

ReactDOM.render(
  element,
  document.getElementById('app')
);
