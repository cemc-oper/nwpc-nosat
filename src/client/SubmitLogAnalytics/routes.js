import React from 'react'
import { Route } from 'react-router-dom'

import SubmitLogAnalyticsApp from './SubmitLogAnalyticsApp'
import {addRoute} from '../Core/routes'

const RouteNode = (
  <Route
    key="/submit-log-analytics"
    path="/submit-log-analytics"
    component={SubmitLogAnalyticsApp}
  />
);

export function prepareRoute(){
  addRoute(RouteNode)
}