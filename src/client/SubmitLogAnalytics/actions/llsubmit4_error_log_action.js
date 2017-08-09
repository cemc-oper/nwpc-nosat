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

export const RESPONSE_ERROR_LOG_ANALYTICS_FAILURE = "RESPONSE_ERROR_LOG_ANALYTICS_FAILURE";
export function receiveErrorLogAnalyticsFailure() {
  return {
    type: RESPONSE_ERROR_LOG_ANALYTICS_FAILURE
  }
}


export const RECEIVE_ERROR_LOG_ANALYTICS_MESSAGE = "RECEIVE_ERROR_LOG_ANALYTICS_MESSAGE";
export function receiveErrorLogAnalyticsMessage(message) {
  return {
    type: RECEIVE_ERROR_LOG_ANALYTICS_MESSAGE,
    message
  }
}

export const CHANGE_ERROR_LOG_PATH = "CHANGE_ERROR_LOG_PATH";
export function changeErrorLogPath(error_log_path){
  return {
    type: CHANGE_ERROR_LOG_PATH,
    error_log_path
  }
}

export const LOAD_ERROR_LOG = "LOAD_ERROR_LOG";
export function loadErrorLog(error_log){
  return {
    type: LOAD_ERROR_LOG,
    error_log
  }
}

export const SAVE_ERROR_LOG = "SAVE_ERROR_LOG";
export function saveErrorLog(error_log){
  return {
    type: SAVE_ERROR_LOG,
    error_log
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

export const CHANGE_ANALYZER_CONFIG_COMMAND="CHANGE_ANALYZER_CONFIG_COMMAND";
export function changeAnalyzerConfigCommand(command){
  return {
    type: CHANGE_ANALYZER_CONFIG_COMMAND,
    command
  }
}