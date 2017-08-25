let initialState = {
  list: [],
  page: 0,
  status: 'fresh'
};

export default function usersListReducer(state = initialState, action) {
  switch (action.type) {
    case 'FETCH_TEACHERS_LIST_REQUEST':
      return Object.assign({}, state, {status: 'fetching'});
    case 'FETCH_TEACHERS_LIST_SUCCESS':
      return Object.assign({}, state, {list: action.data, status: 'fetched'});
    case 'FETCH_TEACHERS_LIST_FAILURE':
      return Object.assign({}, state, {status: 'failed'});
    case 'FETCH_TEACHERS_LIST_PAGINATED_REQUEST':
      return Object.assign({}, state, {status: 'fetching_new_page'});
    case 'FETCH_TEACHERS_LIST_PAGINATED_SUCCESS':
      return Object.assign({}, state, {list: [...state.list, ...action.data.results], status: 'fetched'});
    case 'FETCH_TEACHERS_LIST_PAGINATED_FAILURE':
      return Object.assign({}, state, {status: 'failed'});

    default:
      return state;
  }
}
