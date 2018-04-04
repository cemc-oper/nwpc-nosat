import React  from 'react'
import { Route } from 'react-router-dom';

import SystemRunningTimeAnalyticsApp from './SystemRunningTimeAnalyticsApp';

export const RouteNode = (
  <Route
    key="/system-running-time-analytics"
    path="/system-running-time-analytics"
    component={SystemRunningTimeAnalyticsApp} />
);
