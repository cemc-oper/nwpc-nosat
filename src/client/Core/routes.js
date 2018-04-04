import React from 'react'
import { Route, Switch } from 'react-router-dom'

import WelcomeApp from './containers/WelcomeApp'

let routes = [
  (<Route exact path="/" component={WelcomeApp} key="/" />)
];

export function addRoute(route){
  routes.push(route);
}

export function createRoutes(){
  return (
    <div>
      <Switch>
        {routes}
      </Switch>
    </div>
  )
}
