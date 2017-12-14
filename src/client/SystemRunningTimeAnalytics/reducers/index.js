import { createAction, createReducer} from 'redux-act';

export const change_environment = createAction('change environment');

export const system_running_time_reducer = createReducer({
  [change_environment]: (state, payload) => {
    console.log("[system_running_time_reducer] change_environment.payload:", payload);
    let environment = Object.assign({}, state.environment, payload);
    return Object.assign({}, state, {
      environment: environment
    });
  },
},{
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

  }
});
