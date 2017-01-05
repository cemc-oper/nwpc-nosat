import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'

import llsubmit4_error_log_reducer from './llsubmit4_error_log'
import session_reducer from './session_system'

const operationSystemAnalyticsAppReducer = combineReducers({
    llsubmit4_error_log: llsubmit4_error_log_reducer,
    session_system: session_reducer,
    routing
});

export default operationSystemAnalyticsAppReducer;