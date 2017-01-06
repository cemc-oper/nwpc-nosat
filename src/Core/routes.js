import React from 'react'
import { Route, IndexRedirect, IndexRoute } from 'react-router'

import SubmitLogAnalyticsApp from '../SubmitLogAnalytics/SubmitLogAnalyticsApp'

export default (
    <Route path="/" >
        <IndexRoute component={SubmitLogAnalyticsApp} />
    </Route>
)