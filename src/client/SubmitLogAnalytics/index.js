import {addRoute} from "../Core/routes";
import {addReducer} from "../Core/reducers"
import {RouteNode} from "./routes";

import session_reducer from './reducers/session_system'
import llsubmit4_error_log_reducer from './reducers/llsubmit4_error_log'

export function prepareRoute(){
  addRoute(RouteNode)
}

export function prepareReducer(){
  addReducer('session_system', session_reducer);
  addReducer('llsubmit4_error_log', llsubmit4_error_log_reducer)
}