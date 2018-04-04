import React  from 'react'
import { Route } from 'react-router-dom'

import SubmitLogAnalyticsApp from './SubmitLogAnalyticsApp'

export const RouteNode = (
  <Route
    key="/submit-log-analytics"
    path="/submit-log-analytics"
    component={SubmitLogAnalyticsApp}
  />
);

