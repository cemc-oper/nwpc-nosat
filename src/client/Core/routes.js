import React from 'react'
import { Route, IndexRedirect, IndexRoute } from 'react-router'

import CoreApp from './containers/CoreApp'
import WelcomeApp from './containers/WelcomeApp'
import { RouteNode as SubmitLogAnalyticsRoute } from '../SubmitLogAnalytics/routes'
import { RouteNode as SystemRunningTimeAnalyticsRoute } from '../SystemRunningTimeAnalytics/routes';

export default (
  <Route path="/" component={CoreApp}>
    <IndexRoute component={WelcomeApp} />
    {SubmitLogAnalyticsRoute}
    {SystemRunningTimeAnalyticsRoute}
  </Route>
)