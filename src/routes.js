import React from 'react'
import { Route, IndexRedirect, IndexRoute } from 'react-router'

import SubmitAnalyticsApp from './containers/SubmitAnalyticsApp'

export default (
    <Route path="/" >
        <IndexRoute component={SubmitAnalyticsApp} />
    </Route>
)