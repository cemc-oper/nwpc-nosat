import {
    REQUEST_ERROR_LOG_ANALYTICS,
    RESPONSE_ERROR_LOG_ANALYTICS,
    CHANGE_ERROR_LOG_PATH,
    LOAD_ERROR_LOG,
    SAVE_ERROR_LOG,
    REQUEST_ERROR_LOG_INFO,
    RECEIVE_ERROR_LOG_INFO,
    CHANGE_ANALYZER_CONFIG
} from '../actions/llsubmit4_error_log_action'
import moment from 'moment'

export default function llsubmit4_error_log_reducer(state={
    status: {
        is_fetching: false,
        last_updated: null
    },
    auth:{},
    error_log_analyzer_config:{
        analytics_type: 'date',
        first_date: moment().subtract(1, 'weeks'),
        last_date: moment().subtract(1, 'days')
    },
    error_log_analyzer:{
        status: {
            is_fetching: false
        },
        analytics_result:null
    },
    error_log_data_config:{
        error_log_path: '/cma/g1/nwp/sublog/llsubmit4.error.log',
        info: null,
        error_log_list: [
            {
                name: 'nwp',
                path: '/cma/g1/nwp/sublog/llsubmit4.error.log'
            },
            {
                name: 'nwp_qu',
                path: '/cma/g1/nwp_qu/sublog/llsubmit4.error.log'
            },
            {
                name: 'nwp_pd',
                path: '/cma/g3/nwp_qu/sublog/llsubmit4.error.log'
            },
            {
                name: 'nwp_sp',
                path: '/cma/g1/nwp_sp/sublog/llsubmit4.error.log'
            }
        ]
    }
}, action) {
    switch(action.type){
        case REQUEST_ERROR_LOG_ANALYTICS:
            return Object.assign({}, state, {
                error_log_analyzer: {
                    status: {
                        is_fetching: true
                    },
                    analytics_result: state.error_log_analyzer.analytics_result
                }
            });
            break;
        case RESPONSE_ERROR_LOG_ANALYTICS:
            return Object.assign({}, state, {
                error_log_analyzer: {
                    status: {
                        is_fetching: false
                    },
                    analytics_result: action.analytics_result,
                }
            });
            break;
        case CHANGE_ERROR_LOG_PATH:
            return Object.assign({}, state, {
                error_log_data_config: {
                    error_log_path: action.error_log_path,
                    info: null,
                    error_log_list: state.error_log_data_config.error_log_list
                }
            });
            break;
        case LOAD_ERROR_LOG:
            return Object.assign({}, state, {
                error_log_data_config: {
                    error_log_path: action.error_log.path,
                    info: null,
                    error_log_list: state.error_log_data_config.error_log_list
                }
            });
            break;
        case SAVE_ERROR_LOG:
            return Object.assign({}, state, {
                error_log_data_config: {
                    error_log_path: state.error_log_data_config.error_log_path,
                    info: state.error_log_data_config.info,
                    error_log_list: state.error_log_data_config.error_log_list.concat([action.error_log])
                }
            });
            break;
            break;
        case REQUEST_ERROR_LOG_INFO:
            return Object.assign({}, state, {
                error_log_data_config: {
                    error_log_path: state.error_log_data_config.error_log_path,
                    info: null,
                    error_log_list: state.error_log_data_config.error_log_list
                }
            });
            break;
        case RECEIVE_ERROR_LOG_INFO:
            let info = action.error_log_info_response.data;
            let info_range = info.range;
            info_range.start_date_time = moment(info_range.start_date_time+" +0000", "YYYY-MM-DDTHH:mm:ss Z");
            info_range.end_date_time = moment(info_range.end_date_time+" +0000", "YYYY-MM-DDTHH:mm:ss Z");

            return Object.assign({}, state, {
                error_log_data_config: {
                    error_log_path: state.error_log_data_config.error_log_path,
                    info: info,
                    error_log_list: state.error_log_data_config.error_log_list
                }
            });
            break;
        case CHANGE_ANALYZER_CONFIG:
            return Object.assign({}, state, {
                error_log_analyzer_config: action.config
            });
            break;
        default:
            return state;
    }
}