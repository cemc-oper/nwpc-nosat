import { createAction, createReducer} from 'redux-act';

export const change_environment = createAction('change environment');
export const set_load_env_repo = createAction('set load env repo');

export const system_running_time_reducer = createReducer({
  [change_environment]: (state, payload) => {
    // console.log("[system_running_time_reducer] change_environment.payload:", payload);
    let environment = Object.assign({}, state.environment, payload);
    return Object.assign({}, state, {
      environment: environment
    });
  },
  [set_load_env_repo]: (state, payload) => {
    let load_log = state.load_log;
    let repos = load_log.repos;
    let key = payload.key;
    let new_repo = {};
    if(key in repos){
      new_repo = Object.assign({}, repos[key], payload.value);
    } else {
      new_repo = Object.assign({}, payload.value);
    }
    let new_repos = Object.assign({}, repos);
    new_repos[key] = new_repo;
    let new_load_log = Object.assign({}, load_log, {
      repos: new_repos
    });
    let new_state = Object.assign({}, state, {
      load_log: new_load_log
    });
    console.log("[system_running_time_reducer.set_load_env_repo] new_state:", new_state);
    return new_state;
  }
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
    repos: {}
  }
});
