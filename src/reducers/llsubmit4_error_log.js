import { RESPONSE_ANALYTICS_RESULT } from '../actions/llsubmit4_error_log_action'

export default function llsubmit4_error_log_reducer(state={
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