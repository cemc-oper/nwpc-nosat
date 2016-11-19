import React from 'react'
import { Route, IndexRedirect, IndexRoute } from 'react-router'

import OperationSystemAnalyticsApp from './containers/OperationSystemAnalyticsApp'

export default (
    <Route path="/" >
        <IndexRoute component={OperationSystemAnalyticsApp} />
    </Route>
)