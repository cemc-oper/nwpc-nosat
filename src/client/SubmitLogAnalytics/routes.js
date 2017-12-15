import React from 'react'
import { Route, IndexRedirect, IndexRoute } from 'react-router'

import SubmitLogAnalyticsApp from './SubmitLogAnalyticsApp'

export const RouteNode = (
  <Route path="/submit-log-analytics" component={SubmitLogAnalyticsApp}/>
);