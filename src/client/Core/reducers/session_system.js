import {
  SAVE_SESSION,
  LOAD_SESSION,
  REQUEST_TEST_SESSION,
  RECEIVE_TEST_SESSION_RESPONSE
} from '../../SubmitLogAnalytics/actions/session_action'

export default function session_reducer(state={
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
    status: 'unknown'
  }
}, action) {
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
      break;

    case RECEIVE_TEST_SESSION_RESPONSE:
      let status = action.test_result.data.response.status;
      return Object.assign({}, state, {
        test_session: {
          is_open: true,
          session: action.session,
          status: status
        }
      });
      break;
    default:
      return state;
  }
}