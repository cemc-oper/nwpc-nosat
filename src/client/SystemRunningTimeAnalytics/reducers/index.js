

export default function system_running_time_reducer(state={
  status: {
    is_fetching: false,
    last_updated: null
  },
}, action) {
  switch(action.type){
    default:
      return state;
  }
}