import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'

import { RESPONSE_ANALYTICS_RESULT } from '../actions/llsubmit4_error_log_action'
import { SAVE_SESSION } from '../actions/session_action'

function llsubmit4_error_log_reducer(state={
    status: {
        is_fetching: false,
        last_updated: null
    },
    auth:{},
    config:{},
    analytics_chart:{
        analytics_result:null
    },
    range:{
        start_date: null,
        end_date: null
    }
}, action) {
    switch(action.type){
        case RESPONSE_ANALYTICS_RESULT:
            return Object.assign({}, state, {
                analytics_chart: {
                    analytics_result: action.analytics_result
                }
            });
        default:
            return state;
    }
}

function session_reducer(state={
    status: {
        is_fetching: false,
        last_updated: null
    },
    session_list: []
}, action) {
    switch(action.type){
        case SAVE_SESSION:
            return Object.assign({}, state, {
                session_list: state.session_list.concat([action.session])
            });
        default:
            return state;
    }
}

const operationSystemAnalyticsAppReducer = combineReducers({
    llsubmit4_error_log: llsubmit4_error_log_reducer,
    session_system: session_reducer,
    routing
});

export default operationSystemAnalyticsAppReducer;