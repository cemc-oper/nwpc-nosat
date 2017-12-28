import {
  SAVE_SESSION,
  LOAD_SESSION,
  REQUEST_TEST_SESSION,
  RECEIVE_TEST_SESSION_RESPONSE
} from '../actions/session_action'


// import Immutable  from 'immutable';


const initial_state = {
  status: {
    is_fetching: false,
      last_updated: null
  },
  session_list: [
    {
      name: 'nwp',
      host: 'uranus-bk.hpc.nmic.cn',
      port: 22,
      user: 'nwp',
      password: ''
    },
    {
      name: 'nwp_qu',
      host: 'uranus-bk.hpc.nmic.cn',
      port: 22,
      user: 'nwp_qu',
      password: ''
    },
    {
      name: 'nwp_pd',
      host: 'uranus-bk.hpc.nmic.cn',
      port: 22,
      user: 'nwp_pd',
      password: ''
    },
    {
      name: 'nwp_sp',
      host: 'uranus-bk.hpc.nmic.cn',
      port: 22,
      user: 'nwp_sp',
      password: ''
    }
  ],
    current_session: {
  host: "uranus-bk.hpc.nmic.cn",
    port: 22,
    user: "nwp",
    password: ""
},
  save_session: {

  },
  test_session: {
    is_open: false,
      session: null,
      status: 'unknown',
      message: ''
  }
};


export default function session_reducer(state=initial_state, action) {
  switch(action.type){
    case SAVE_SESSION:
      return Object.assign({}, state, {
        session_list: state.session_list.concat([action.session])
      });

    case LOAD_SESSION:
      return Object.assign({}, state, {
        current_session: action.session
      });

    case REQUEST_TEST_SESSION:
      return Object.assign({}, state, {
        test_session: {
          is_open: true,
          session: action.session,
          status: 'active'
        }
      });

    case RECEIVE_TEST_SESSION_RESPONSE:
      let status = action.test_result.data.response.status;
      let message = action.test_result.data.response.message;
      return Object.assign({}, state, {
        test_session: {
          is_open: true,
          session: action.session,
          status: status,
          message: message
        }
      });
    default:
      return state;
  }
}