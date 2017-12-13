import { createAction, createReducer} from 'redux-act';

export const change_repo_list = createAction('change repo list');
export const change_environment = createAction('change environment');

export const system_running_time_reducer = createReducer({
  [change_repo_list]: (state, payload) => {
    let environment = Object.assign({}, state.environment, {
      repo_list: payload
    });
    let new_state = Object.assign({}, state, {
      environment: environment
    });
    // console.log("[system_running_time_reducer] new_state:", new_state);
    return new_state;
  },
  [change_environment]: (state, payload) => {
    let environment = Object.assign({}, state.environment, payload);
    let new_state = Object.assign({}, state, {
      environment: environment
    });
    // console.log("[system_running_time_reducer.change_environment] new_state:", new_state);
    return new_state;
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
  }
});

