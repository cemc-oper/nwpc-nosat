import React from 'react'
import { Route, Switch } from 'react-router-dom'

import WelcomeApp from './containers/WelcomeApp'
import { RouteNode as SubmitLogAnalyticsRoute } from '../SubmitLogAnalytics/routes'
import { RouteNode as SystemRunningTimeAnalyticsRoute } from '../SystemRunningTimeAnalytics/routes';

export default (
  <div>
    <Switch>
      <Route exact path="/" component={WelcomeApp} />
      {SubmitLogAnalyticsRoute}
      {SystemRunningTimeAnalyticsRoute}
    </Switch>
  </div>
)


