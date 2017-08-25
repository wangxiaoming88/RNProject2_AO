let initialState = {
  list: [],
  status: 'fresh'
};

export default function answers(state = initialState, action) {
  switch (action.type) {
    case 'CREATE_ANSWER_REQUEST':
      // console.warn('CREATE_ANSWER_REQUEST');
      return Object.assign({}, {...state, status: 'fetching'});
    case 'CREATE_ANSWER_SUCCESS':
      // console.warn('CREATE_ANSWER_SUCCESS', action);
      return Object.assign({}, state, {
        list: {
          ...state.list,
          results: [...state.list.results, action.data ],
        },
        status: 'fetched',
      });
    case 'CREATE_ANSWER_FAILURE':
      // console.warn('CREATE_ANSWER_FAILURE');
      return Object.assign({}, state, {status: 'failed'});

    case 'FILTER_ANSWER_REQUEST':
      // console.warn('FILTER_ANSWER_REQUEST');
      return Object.assign({}, {...state, status: 'fetching'});
    case 'FILTER_ANSWER_SUCCESS':
      // console.warn('FILTER_ANSWER_SUCCESS', action);
      return Object.assign({}, {list: action.data, status: 'fetched'});
    case 'FILTER_ANSWER_FAILURE':
      // console.warn('FILTER_ANSWER_FAILURE');
      return Object.assign({}, state, {status: 'failed'});

    case 'CLEAR_ANSWER':
      // console.warn('CLEAR_ANSWER');
      return initialState;

    case 'UPVOTE_ANSWER_REQUEST':
      // console.warn('UPVOTE_ANSWER_REQUEST');
      return Object.assign({}, {...state, status: 'fetching'});
    case 'UPVOTE_ANSWER_SUCCESS':
      // console.warn('UPVOTE_ANSWER_SUCCESS', action);
      return Object.assign({}, state, {
        list: {
          ...state.list,
          results: state.list.results.map(item => {
            if (item.id === action.other.idAnswer) {
              return Object.assign({}, item, {rating: action.data.rating});
            } else {
              return item;
            }
          }),
        },
        status: 'fetched',
      });
    case 'UPVOTE_ANSWER_FAILURE':
      // console.warn('UPVOTE_ANSWER_FAILURE');
      return Object.assign({}, state, {status: 'failed'});

    default:
      return state;
  }
}
