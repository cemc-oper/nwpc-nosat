import React from 'react'
import { Route, Switch } from 'react-router-dom'

import WelcomeApp from './containers/WelcomeApp'
// import { RouteNode as SubmitLogAnalyticsRoute } from '../SubmitLogAnalytics/routes'
// import { RouteNode as SystemRunningTimeAnalyticsRoute } from '../SystemRunningTimeAnalytics/routes';

let routes = [
  (<Route exact path="/" component={WelcomeApp} key="/" />)
];

export function addRoute(route){
  routes.push(route);
}

// addRoute(SubmitLogAnalyticsRoute);
// addRoute(SystemRunningTimeAnalyticsRoute);

export function createRoutes(){
  return (
    <div>
      <Switch>
        {routes}
      </Switch>
    </div>
  )
}
