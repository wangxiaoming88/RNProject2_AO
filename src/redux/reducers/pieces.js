let initialState = {
  list: [],
  status: 'fresh'
};

export default function piecesReducer(state = initialState, action) {
  switch (action.type) {
    case 'FETCH_PIECES_REQUEST':
      return Object.assign({}, {...initialState, status: 'fetching'});
    case 'FETCH_PIECES_SUCCESS':
      return Object.assign({}, state, {list: action.data, status: 'fetched'});
    case 'FETCH_PIECES_FAILURE':
      return Object.assign({}, state, {status: 'failed'});
    default:
      return state;
  }
}



