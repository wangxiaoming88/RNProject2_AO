let initialState = {
  list: {
    results: [],
  },
  status: 'fresh'
};

export default function searchResultReducer(state = initialState, action) {
  switch (action.type) {
    case 'SHEETMUSIC_ALL_FIELDS_REQUEST':
      // console.warn('SHEETMUSIC_ALL_FIELDS_REQUEST');
      return Object.assign({}, {...state, status: 'fetching'});
    case 'SHEETMUSIC_ALL_FIELDS_SUCCESS':
      // console.warn('SHEETMUSIC_ALL_FIELDS_SUCCESS');
      return Object.assign({}, state, {list: action.data, status: 'fetched'});
    case 'SHEETMUSIC_ALL_FIELDS_FAILURE':
      // console.warn('SHEETMUSIC_ALL_FIELDS_FAILURE');
      return Object.assign({}, state, {status: 'failed'});

    case 'SHEETMUSIC_BY_ID_REQUEST':
      // console.warn('SHEETMUSIC_BY_ID_REQUEST');
      return Object.assign({}, {...state, status: 'fetching'});
    case 'SHEETMUSIC_BY_ID_SUCCESS':
      // console.warn('SHEETMUSIC_BY_ID_SUCCESS', action);
      return Object.assign({}, state, {
        list: {
          ...state.list,
          results: state.list.results.map(item => {
            if (item.id === action.other.id) {
              return action.data.results[0];
            } else {
              return item;
            }
          }),
        },
        status: 'fetched',
      });
    case 'SHEETMUSIC_BY_ID_FAILURE':
      // console.warn('SHEETMUSIC_BY_ID_FAILURE');
      return Object.assign({}, state, {status: 'failed'});

    case 'CREATE_QUESTION_REQUEST':
      // console.warn('CREATE_QUESTION_REQUEST');
      return Object.assign({}, {...state, status: 'fetching'});
    case 'CREATE_QUESTION_SUCCESS':
      // console.warn('CREATE_QUESTION_SUCCESS');
      return Object.assign({}, state, {
        list: {
          ...state.list,
          results: state.list.results.map(item => {
            if (item.id === action.other.id) {
              return {
                ...item,
                questions: [ ...item.questions, action.data ],
              };
            } else {
              return item;
            }
          }),
        },
        status: 'fetched',
      });
    case 'CREATE_QUESTION_FAILURE':
      // console.warn('CREATE_QUESTION_FAILURE');
      return Object.assign({}, state, {status: 'failed'});

    case 'UPVOTE_QUESTION_REQUEST':
      // console.warn('UPVOTE_QUESTION_REQUEST');
      return Object.assign({}, {...state, status: 'fetching'});
    case 'UPVOTE_QUESTION_SUCCESS':
      // console.warn('UPVOTE_QUESTION_SUCCESS');
      return Object.assign({}, state, {
        list: {
          ...state.list,
          results: state.list.results.map(item => {
            if (item.id === action.other.id) {
              return {
                ...item,
                questions: item.questions.map(question => {
                  if (question.id === action.other.idQuestion) {
                    return Object.assign({}, question, {rating: action.data.rating});
                  } else {
                    return question;
                  }
                }),
              };
            } else {
              return item;
            }
          }),
        },
        status: 'fetched',
      });
    case 'UPVOTE_QUESTION_FAILURE':
      // console.warn('UPVOTE_QUESTION_FAILURE');
      return Object.assign({}, state, {status: 'failed'});

    case 'CLEAN_SERCH_RESULT':
      return Object.assign({}, state, {
        list: {
          ...state.list,
          results: [],
        },
        status: 'fresh',
      });

    default:
      return state;
  }
}
