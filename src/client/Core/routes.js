import React from 'react'
import { Route, IndexRedirect, IndexRoute } from 'react-router'

import CoreApp from './containers/CoreApp'
import WelcomeApp from './containers/WelcomeApp'
import SubmitLogAnalyticsApp from '../SubmitLogAnalytics/SubmitLogAnalyticsApp'
import SystemRunningTimeAnalyticsApp from '../SystemRunningTimeAnalytics/SystemRunningTimeAnalyticsApp'

export default (
    <Route path="/" component={CoreApp}>
        <IndexRoute component={WelcomeApp} />
        <Route path="/submit-log-analytics" component={SubmitLogAnalyticsApp}/>
        <Route path="/system-running-time-analytics" component={SystemRunningTimeAnalyticsApp}/>
    </Route>
)