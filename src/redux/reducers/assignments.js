let initialState = {
  list: [],
  completed: [],
  status: 'fresh',
};

export default function assignmentsReducer(state = initialState, action) {
  switch (action.type) {
    case 'ASSIGNMENTS_FETCH_REQUEST':
      return Object.assign({}, state, {status: 'fetching'});
    case 'ASSIGNMENTS_FETCH_SUCCESS':
      return Object.assign({}, state, {list: action.data, status: 'fetched'});
    case 'ASSIGNMENTS_FETCH_FAILURE':
      return Object.assign({}, state, {status: 'failed'});
    case 'ASSIGNMENTS_COMPLETED_FETCH_REQUEST':
      return Object.assign({}, state, {status: 'fetching'});
    case 'ASSIGNMENTS_COMPLETED_FETCH_SUCCESS':
      return Object.assign({}, state, {completed: action.data, status: 'fetched'});
    case 'ASSIGNMENTS_COMPLETED_FETCH_FAILURE':
      return Object.assign({}, state, {status: 'failed'});

    default:
      return state;
  }
}
