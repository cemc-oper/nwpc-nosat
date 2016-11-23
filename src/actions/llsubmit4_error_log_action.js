export const REQUEST_ERROR_LOG_ANALYTICS = "REQUEST_ERROR_LOG_ANALYTICS";

export function requestErrorLogAnalytics() {
    return {
        type: REQUEST_ERROR_LOG_ANALYTICS
    }
}


export const RESPONSE_ERROR_LOG_ANALYTICS = "RESPONSE_ERROR_LOG_ANALYTICS";

export function receiveErrorLogAnalytics(analytics_result) {
    return {
        type: RESPONSE_ERROR_LOG_ANALYTICS,
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

export const CHANGE_ANALYZER_CONFIG="CHANGE_ANALYZER_CONFIG";
export function changeAnalyzerConfig(config){
    return {
        type: CHANGE_ANALYZER_CONFIG,
        config
    }
}