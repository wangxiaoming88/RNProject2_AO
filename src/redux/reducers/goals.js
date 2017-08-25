let initialState = {
  list: [],
  status: 'fresh',
  awake: false,
  interimDataGoal: {}
};

export default function goalsReducer(state = initialState, action) {
  switch (action.type) {
    case 'FETCH_MY_GOALS_REQUEST':
      return Object.assign({}, initialState, {status: 'fetching'});

    case 'FETCH_MY_GOALS_SUCCESS':
      // console.log('fetch complete', action.data);
      return Object.assign({}, state, {list: action.data, status: 'fetched'});

    case 'FETCH_MY_GOALS_FAILURE':
      return Object.assign({}, state, {status: 'failed'});

    case 'SAVE_INTERIM_DATA_GOAL':
      return Object.assign({}, state, {
        interimDataGoal: {
          ...state.interimDataGoal,
          ...action.data
        }
      });

    case 'CLEAN_INTERIM_DATA_GOAL':
      return Object.assign({}, state, { interimDataGoal: {} });

    // Different object is comming so can't make quick add yet
    // case 'SUBSCRIBE_PRACTICE_PIECE_SUCCESS':
    //   return Object.assign({}, state, {list: [...state.list, action.data]});
    case 'KEEP_AWAKE': {
      return Object.assign({}, state, {awake: !state.awake});
    }

    default:
      return state;
  }
}
