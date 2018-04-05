import React from 'react'
import ReactDOM from 'react-dom'

import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'

import createHistory from 'history/createHashHistory'
import { routerMiddleware } from 'react-router-redux';

import {createReducer} from './Core/reducers/index'

import Root from './Core/Root'

// plugin
let plugin_list = [
  {
    name: 'SubmitLogAnalytics',
    // path: './scripts/submit_log_analytics.entry.js'
    plugin: require('./SubmitLogAnalytics')
  },
  {
    name: 'SystemRunningTimeAnalytics',
    // path: './scripts/system_running_time_analytics.entry.js'
    plugin: require('./SystemRunningTimeAnalytics')
  }
];

// load plugin
function loadPlugin(plugin){
  if(plugin.prepareRoute) {
    plugin.prepareRoute();
  }
  if(plugin.prepareReducer){
    plugin.prepareReducer();
  }
}

plugin_list.forEach(item => {
  // let plugin = require([item.path]);
  loadPlugin(item.plugin);
});


// history
function createClientHistory(){
  return createHistory({
    hashType: "slash"
  })
}
const history = createClientHistory();


// reducer
const app_reducer = createReducer();

// store
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
  app_reducer,
  middle_wares
);

const element = (
  <Root store={store} history={history} />
);

ReactDOM.render(
  element,
  document.getElementById('app')
);
