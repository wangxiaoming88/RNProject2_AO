let initialState = {
  list: [],
  status: 'fresh',
  awake: false,
  isEmpty: undefined,
  practiceAchievementsStatus: 'fresh',
  pieceAchievementsStatus: 'fresh',
  practiceAchievements: undefined,
  pieceAchievements: undefined,
  practiceTimeStatus: 'fresh',
  practiceTime: null,
};

export default function practiceReducer(state = initialState, action) {
  switch (action.type) {
    case 'FETCH_MY_PRACTICES_REQUEST':
      return Object.assign({}, state, {status: 'fetching'});

    case 'FETCH_MY_PRACTICES_SUCCESS':
      return Object.assign({}, state, {list: action.data, status: 'fetched', isEmpty: (action.data.length === 0) ? true : false });

    case 'FETCH_MY_PRACTICES_FAILURE':
      return Object.assign({}, state, {status: 'failed'});

    case 'FETCH_MY_PRACTICES_ACHIEVEMENTS_REQUEST':
      return Object.assign({}, state, {practiceAchievementsStatus: 'fetching'});

    case 'FETCH_MY_PRACTICES_ACHIEVEMENTS_SUCCESS':
      return Object.assign({}, state, { practiceAchievements: action.data, practiceAchievementsStatus: 'fetched' });

    case 'FETCH_MY_PRACTICES_ACHIEVEMENTS_FAILURE':
      return Object.assign({}, state, {practiceAchievementsStatus: 'failed'});

    case 'FETCH_MY_PIECES_ACHIEVEMENTS_REQUEST':
      return Object.assign({}, state, {pieceAchievementsStatus: 'fetching'});

    case 'FETCH_MY_PIECES_ACHIEVEMENTS_SUCCESS':
      return Object.assign({}, state, {pieceAchievements: action.data, pieceAchievementsStatus: 'fetched' });

    case 'FETCH_MY_PIECES_ACHIEVEMENTS_FAILURE':
      return Object.assign({}, state, {pieceAchievementsStatus: 'failed'});

    case 'FETCH_MY_PRACTICES_TIME_REQUEST':
      return Object.assign({}, state, {practiceTimeStatus: 'fetching'});

    case 'FETCH_MY_PRACTICES_TIME_SUCCESS':
      console.log('SUCCESS__FEEEEETCH', action);
      return Object.assign({}, state, {practiceTime: action.data, practiceTimeStatus: 'fetched' });

    case 'FETCH_MY_PRACTICES_TIME_FAILURE':
      return Object.assign({}, state, {practiceTimeStatus: 'failed'});

    case 'FETCH_MY_LEVEL_SUCCESS':
      return Object.assign({}, state, ...action.data);
    case 'SET_IS_EMPTY':
      return Object.assign({}, state, { isEmpty: action.data });

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
