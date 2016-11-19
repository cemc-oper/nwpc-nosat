import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'

import { RESPONSE_ANALYTICS_RESULT } from '../actions/index'

function error_reducer(state={
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


const operationSystemAnalyticsAppReducer = combineReducers({
    error_log: error_reducer,
    routing
});

export default operationSystemAnalyticsAppReducer;