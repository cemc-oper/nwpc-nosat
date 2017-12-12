import { createAction, createReducer} from 'redux-act';

export const change_repo_list = createAction('change repo list');

export const system_running_time_reducer = createReducer({
  [change_repo_list]: (state, payload) => {
    let setup_env = Object.assign({}, state.setup_env, {
      repo_list: payload
    });
    let new_state = Object.assign({}, state, {
      setup_env: setup_env
    });
    console.log("[system_running_time_reducer] new_state:", new_state);
    return new_state;
  },
},{
  status: {
    is_fetching: false,
    last_updated: null
  },
  setup_env: {
    repo_list: [
      { owner: 'nwp_xp', repo: 'nwpc_op' },
      { owner: 'nwp_xp', repo: 'nwpc_qu' }
    ]
  }
});

