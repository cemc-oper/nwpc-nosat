import {addRoute} from "../Core/routes";
import {addReducer} from "../Core/reducers"

import {RouteNode} from "./routes";
import {system_running_time_reducer} from './reducers'

export function prepareRoute(){
  addRoute(RouteNode)
}

export function prepareReducer(){
  addReducer('system_running_time', system_running_time_reducer);
}