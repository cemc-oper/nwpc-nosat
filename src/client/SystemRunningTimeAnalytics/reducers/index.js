import { createAction, createReducer} from 'redux-act';

import Immutable from 'immutable';

export const change_environment = createAction('change environment');
export const set_load_env_repo = createAction('set load env repo');
export const append_load_log_repo_command_output = createAction('append load log repo command stdout');
export const clear_load_log_repo_command_output = createAction('clear load log repo command output');

export const set_process_data_repo = createAction('set process data repo');
export const append_process_data_repo_command_output = createAction('append process data repo command output');
export const clear_process_data_repo_command_output = createAction('clear process data repo command output');

export const set_generate_data_config = createAction('set generate data config');
export const append_generate_data_command_output = createAction('append generate data command output');
export const clear_generate_data_command_output = createAction('clear generate data command output');

export const set_plot_chart_config = createAction('set plot chart config');
export const append_plot_chart_command_output = createAction('append plot chart command output');
export const clear_plot_chart_command_output = createAction('clear plot chart command output');


const initial_state = {
  status: {
    is_fetching: false,
    last_updated: null
  },
  environment: {
    repo_list: [
      { owner: 'nwp_xp', repo: 'nwpc_op' },
      { owner: 'nwp_xp', repo: 'nwpc_qu' }
    ],
    config_file_path: ''

  },
  setup_env: {
    status: 'unknown'
  },
  load_log: {
    repos: {}
  },
  process_data: {
    repos: {}
  },
  generate_result: {
    command_output: ''
  },
  plot_chart: {
    command_output: ''
  }
};


export const system_running_time_reducer = createReducer({
  [change_environment]: (state, payload) => {
    state = Immutable.fromJS(state);
    const new_state = state.update('environment', env => env.merge(payload)).toJS();
    // console.log("[system_running_time_reducer] change_environment.payload:", payload);
    // console.log("[system_running_time_reducer] change_environment.new_state:", new_state);
    return new_state;
  },
  [set_load_env_repo]: (state, payload) => {
    state = Immutable.fromJS(state);
    let repo_object = Immutable.Map();
    repo_object = repo_object.set(payload.key, payload.value);
    const new_state = state.updateIn(['load_log', 'repos'], repo_map => repo_map.mergeDeep(repo_object)).toJS();
    //console.log("[system_running_time_reducer.set_load_env_repo] new_state:", new_state);
    return new_state;
  },
  [append_load_log_repo_command_output]: (state, payload) => {
    state = Immutable.fromJS(state);
    let repo = state.getIn(['load_log', 'repos', payload.key], {});
    repo = repo.update('command_output', '', value=>value+payload.data);
    let repo_object = Immutable.Map();
    repo_object = repo_object.set(payload.key, repo);
    const new_state = state.updateIn(['load_log', 'repos'], repo_map => repo_map.mergeDeep(repo_object)).toJS();
    // console.log("[system_running_time_reducer.set_load_env_repo] new_state:", new_state);
    return new_state;
  },
  [clear_load_log_repo_command_output]: (state, payload) => {
    state = Immutable.fromJS(state);
    let repo = state.getIn(['load_log', 'repos', payload.key], {});
    repo = repo.set('command_output', '');
    let repo_object = Immutable.Map();
    repo_object = repo_object.set(payload.key, repo);
    const new_state = state.updateIn(['load_log', 'repos'], repo_map => repo_map.mergeDeep(repo_object)).toJS();
    // console.log("[system_running_time_reducer.set_load_env_repo] new_state:", new_state);
    return new_state;
  },

  [set_process_data_repo]: (state, payload) => {
    state = Immutable.fromJS(state);
    let repo_object = Immutable.Map();
    repo_object = repo_object.set(payload.key, payload.value);
    const new_state = state.updateIn(['process_data', 'repos'], repo_map => repo_map.mergeDeep(repo_object)).toJS();
    //console.log("[system_running_time_reducer.set_load_env_repo] new_state:", new_state);
    return new_state;
  },
  [append_process_data_repo_command_output]: (state, payload) => {
    state = Immutable.fromJS(state);
    let repo = state.getIn(['process_data', 'repos', payload.key], {});
    repo = repo.update('command_output', '', value=>value+payload.data);
    let repo_object = Immutable.Map();
    repo_object = repo_object.set(payload.key, repo);
    const new_state = state.updateIn(['process_data', 'repos'], repo_map => repo_map.mergeDeep(repo_object)).toJS();
    // console.log("[system_running_time_reducer.set_load_env_repo] new_state:", new_state);
    return new_state;
  },
  [clear_process_data_repo_command_output]: (state, payload) => {
    state = Immutable.fromJS(state);
    let repo = state.getIn(['process_data', 'repos', payload.key], {});
    repo = repo.set('command_output', '');
    let repo_object = Immutable.Map();
    repo_object = repo_object.set(payload.key, repo);
    const new_state = state.updateIn(['process_data', 'repos'], repo_map => repo_map.mergeDeep(repo_object)).toJS();
    // console.log("[system_running_time_reducer.set_load_env_repo] new_state:", new_state);
    return new_state;
  },


  [set_generate_data_config]: (state, payload) => {
    state = Immutable.fromJS(state);
    let g = state.get('generate_result');
    g = g.mergeDeep(payload);
    const new_state = state.set('generate_result', g).toJS();
    // console.log("[system_running_time_reducer.set_generate_data_config] new_state:", new_state);
    return new_state;
  },
  [append_generate_data_command_output]: (state, payload) => {
    state = Immutable.fromJS(state);
    let generate_result = state.get('generate_result', {});
    generate_result = generate_result.update('command_output', '', value=>value+payload.data);
    const new_state = state.set('generate_result', generate_result).toJS();
    // console.log("[system_running_time_reducer.append_generate_data_command_output] new_state:", new_state);
    return new_state;
  },
  [clear_process_data_repo_command_output]: (state, payload) => {
    state = Immutable.fromJS(state);
    let generate_result = state.get('generate_result', {});
    generate_result = generate_result.set('command_output', '');
    const new_state = state.set('generate_result', generate_result).toJS();
    // console.log("[system_running_time_reducer.clear_process_data_repo_command_output] new_state:", new_state);
    return new_state;
  },

  [set_plot_chart_config]: (state, payload) => {
    state = Immutable.fromJS(state);
    let g = state.get('plot_chart');
    g = g.mergeDeep(payload);
    const new_state = state.set('plot_chart', g).toJS();
    // console.log("[system_running_time_reducer.set_plot_chart_config] new_state:", new_state);
    return new_state;
  },
  [append_plot_chart_command_output]: (state, payload) => {
    state = Immutable.fromJS(state);
    let generate_result = state.get('plot_chart', {});
    generate_result = generate_result.update('command_output', '', value=>value+payload.data);
    const new_state = state.set('plot_chart', generate_result).toJS();
    // console.log("[system_running_time_reducer.append_plot_chart_command_output] new_state:", new_state);
    return new_state;
  },
  [clear_plot_chart_command_output]: (state, payload) => {
    state = Immutable.fromJS(state);
    let generate_result = state.get('plot_chart', {});
    generate_result = generate_result.set('command_output', '');
    const new_state = state.set('plot_chart', generate_result).toJS();
    // console.log("[system_running_time_reducer.clear_plot_chart_command_output] new_state:", new_state);
    return new_state;
  }

}, initial_state);
