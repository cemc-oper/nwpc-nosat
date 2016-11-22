export const RESPONSE_ANALYTICS_RESULT = "RESPONSE_ANALYTICS_RESULT";

export function receiveAnalyticsResult(analytics_result) {
    return {
        type: RESPONSE_ANALYTICS_RESULT,
        analytics_result
    }
}

export const CHANGE_ERROR_LOG_PATH = "CHANGE_ERROR_LOG_PATH";
export function changeErrorLogPath(error_log_path){
    return {
        type: CHANGE_ERROR_LOG_PATH,
        error_log_path
    }
}

export const REQUEST_ERROR_LOG_INFO = "REQUEST_ERROR_LOG_INFO";
export function requestErrorLogInfo(session, error_log_data_config){
    return {
        type: REQUEST_ERROR_LOG_INFO,
        error_log_data_config
    }
}

export const RECEIVE_ERROR_LOG_INFO = "RECEIVE_ERROR_LOG_INFO";
export function receiveErrorLogInfo(error_log_info_response){
    return {
        type:RECEIVE_ERROR_LOG_INFO,
        error_log_info_response
    };
}