import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

let reducers = {
  router: routerReducer
};

export function addReducer(name, reducer){
  console.log("[addReducer] before:", reducers);
  reducers[name] = reducer;
  console.log("[addReducer] after:", reducers);
}

export function createReducer(){
  console.log(reducers);
  return combineReducers(reducers);
}
