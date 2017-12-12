import {
  REQUEST_ERROR_LOG_ANALYTICS,
  RESPONSE_ERROR_LOG_ANALYTICS,
  RESPONSE_ERROR_LOG_ANALYTICS_FAILURE,
  RECEIVE_ERROR_LOG_ANALYTICS_MESSAGE,
  CHANGE_ERROR_LOG_PATH,
  LOAD_ERROR_LOG,
  SAVE_ERROR_LOG,
  REQUEST_ERROR_LOG_INFO,
  RECEIVE_ERROR_LOG_INFO,
  CHANGE_ANALYZER_CONFIG,
  CHANGE_ANALYZER_CONFIG_COMMAND,
  CHANGE_WAITING_ANALYZER_DIALOG_VISIBLE,
} from '../actions/llsubmit4_error_log_action'

import moment from 'moment'


function error_log_analyzer_config_reducer(state, action){
  switch(action.type) {
    case CHANGE_ANALYZER_CONFIG:
      let t = Object();
      t[action.config.analytics_command] = action.config;
      let command_map = Object.assign({}, state.command_map, t);

      return Object.assign({}, state, {
        command_map: command_map
      });
    case CHANGE_ANALYZER_CONFIG_COMMAND:
      return Object.assign({}, state, {
        current_command: action.command
      });
    default:
      return state;
  }
}

function error_log_analyzer_reducer(state, action){
  switch(action.type) {
    case REQUEST_ERROR_LOG_ANALYTICS:
      return Object.assign({}, state, {
        status: {
          is_fetching: true,
        },
        dialog_content: {
          title: "日志分析",
          message: "分析程序正在运行...",
          message_type: "info",
          value: 45,
          visible: true
        },
      });
    case RESPONSE_ERROR_LOG_ANALYTICS:
      let dialog_content = Object.assign({}, state.dialog_content, {
        message: "分析程序运行成功",
        message_type: "success",
        value: 100,
        visible: false
      });
      return Object.assign({}, state, {
        status: {
          is_fetching: false
        },
        dialog_content: dialog_content,
        analytics_result: action.analytics_result,
      });
    case RESPONSE_ERROR_LOG_ANALYTICS_FAILURE:
      dialog_content = Object.assign({}, state.dialog_content, {
        message: "发生错误，请检查参数",
        message_type: "error",
        value: 100,
        visible: true
      });
      return Object.assign({}, state, {
        status: {
          is_fetching: true
        },
        dialog_content: dialog_content,
        analytics_result:null
      });
    case RECEIVE_ERROR_LOG_ANALYTICS_MESSAGE:
      // console.log("[error_log_analyzer_reducer] action message:", action.message);
      dialog_content = Object.assign({}, state.dialog_content, {
        message: action.message,
        message_type: "info"
      });
      return Object.assign({}, state, {
        dialog_content: dialog_content
      });
    case CHANGE_WAITING_ANALYZER_DIALOG_VISIBLE:
      dialog_content = Object.assign({}, state.dialog_content, {
        visible: action.visible
      });
      return Object.assign({}, state, {
        dialog_content: dialog_content
      });
    default:
      return state;
  }
}


export default function llsubmit4_error_log_reducer(state={
  status: {
    is_fetching: false,
    last_updated: null
  },
  auth:{},
  error_log_analyzer_config:{
    current_command: 'count',
    command_map: {
      'count': {
        analytics_command: 'count',
        analytics_type: 'date',
        first_date: moment().subtract(1, 'weeks').toDate(),
        last_date: moment().subtract(1, 'days').toDate()
      },
      'grid': {
        analytics_command: 'grid',
        x_type: 'hour',
        y_type: 'weekday',
        first_date: moment().subtract(1, 'weeks').toDate(),
        last_date: moment().subtract(1, 'days').toDate()
      }
    }
  },
  error_log_analyzer:{
    status: {
      is_fetching: false,
    },
    dialog_content: {
      title: "日志分析",
      message: "分析程序正在运行...",
      message_info: "info",
      value: 45,
      visible: false
    },
    analytics_result:null
  },
  error_log_data_config:{
    error_log_path: '/cma/g1/nwp/sublog/llsubmit4.error.log',
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
        path: '/cma/g3/nwp_pd/sublog/llsubmit4.error.log'
      },
      {
        name: 'nwp_sp',
        path: '/cma/g1/nwp_sp/sublog/llsubmit4.error.log'
      }
    ],
    info: null,
  }
}, action) {
  switch(action.type){
    case REQUEST_ERROR_LOG_ANALYTICS:
    case RESPONSE_ERROR_LOG_ANALYTICS:
    case RESPONSE_ERROR_LOG_ANALYTICS_FAILURE:
    case RECEIVE_ERROR_LOG_ANALYTICS_MESSAGE:
    case CHANGE_WAITING_ANALYZER_DIALOG_VISIBLE:
      // console.log("[llsubmit4_error_log_reducer] action for error_log_analyzer_reducer:", action.type);
      return Object.assign({}, state, {
        error_log_analyzer: error_log_analyzer_reducer(state.error_log_analyzer, action)
      });
    case CHANGE_ERROR_LOG_PATH:
      // console.log("[llsubmit4_error_log_reducer] CHANGE_ERROR_LOG_PATH action:", action);
      return Object.assign({}, state, {
        error_log_data_config: {
          error_log_path: action.error_log_path,
          info: null,
          error_log_list: state.error_log_data_config.error_log_list
        }
      });
    case LOAD_ERROR_LOG:
      return Object.assign({}, state, {
        error_log_data_config: {
          error_log_path: action.error_log.path,
          info: null,
          error_log_list: state.error_log_data_config.error_log_list
        }
      });
    case SAVE_ERROR_LOG:
      return Object.assign({}, state, {
        error_log_data_config: {
          error_log_path: state.error_log_data_config.error_log_path,
          info: state.error_log_data_config.info,
          error_log_list: state.error_log_data_config.error_log_list.concat([action.error_log])
        }
      });
    case REQUEST_ERROR_LOG_INFO:
      return Object.assign({}, state, {
        error_log_data_config: {
          error_log_path: state.error_log_data_config.error_log_path,
          info: null,
          error_log_list: state.error_log_data_config.error_log_list
        }
      });
    case RECEIVE_ERROR_LOG_INFO:
      let response_status = action.error_log_info_response.status;
      if(response_status === "success"){
        let response_data = JSON.parse(action.error_log_info_response.std_out);
        let info = {
          status: response_status,
          data: response_data.data
        };
        let data = info.data;
        let data_range = data.range;
        data_range.start_date_time = moment(info_range.start_date_time+" +0000", "YYYY-MM-DDTHH:mm:ss Z");
        data_range.end_date_time = moment(info_range.end_date_time+" +0000", "YYYY-MM-DDTHH:mm:ss Z");

        return Object.assign({}, state, {
          error_log_data_config: {
            error_log_path: state.error_log_data_config.error_log_path,
            info: info,
            error_log_list: state.error_log_data_config.error_log_list
          }
        });
      } else if(response_status === "error") {
        let info = action.error_log_info_response;
        return Object.assign({}, state, {
          error_log_data_config: {
            error_log_path: state.error_log_data_config.error_log_path,
            info: info,
            error_log_list: state.error_log_data_config.error_log_list
          }
        });
      } else {
        let info = action.error_log_info_response;
        return Object.assign({}, state, {
          error_log_data_config: {
            error_log_path: state.error_log_data_config.error_log_path,
            info: info,
            error_log_list: state.error_log_data_config.error_log_list
          }
        });
      }
    case CHANGE_ANALYZER_CONFIG:
    case CHANGE_ANALYZER_CONFIG_COMMAND:
      return Object.assign({}, state, {
        error_log_analyzer_config: error_log_analyzer_config_reducer(state.error_log_analyzer_config, action)
      });
    default:
      // console.log("[llsubmit4_error_log_reducer] default action:", action.type);
      return state;
  }
}