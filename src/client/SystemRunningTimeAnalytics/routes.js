import React from 'react'
import { Route } from 'react-router-dom'

import SystemRunningTimeAnalyticsApp from './SystemRunningTimeAnalyticsApp'
import {addRoute} from "../Core/routes";

const RouteNode = (
  <Route
    key="/system-running-time-analytics"
    path="/system-running-time-analytics"
    component={SystemRunningTimeAnalyticsApp} />
);

export function prepareRoute(){
  addRoute(RouteNode)
}