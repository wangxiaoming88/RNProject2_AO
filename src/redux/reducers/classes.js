let initialState = {
  joinedClasses: [],
  teachersClasses: [],
  status: 'fresh'
};

export default function classesReducer(state = initialState, action) {
  switch (action.type) {
    case 'FETCH_CLASSES_PERSONAL_REQUEST':
      return Object.assign({}, state, {
        joinedClasses: [],
        status: 'fetching'
      });

    case 'FETCH_CLASSES_PERSONAL_SUCCESS':
      return Object.assign({}, state, {
        joinedClasses: [...action.data],
        status: 'fetched'
      });

    case 'FETCH_CLASSES_PERSONAL_FAILURE':
      return Object.assign({}, state, {
        status: 'failed'
      });

    case 'FETCH_TEACHERS_CLASSES_REQUEST':
      return Object.assign({}, state, {
        teachersClasses: [],
        status: 'fetching'
      });

    case 'FETCH_TEACHERS_CLASSES_SUCCESS':
      return Object.assign({}, state, {
        teachersClasses: [...action.data],
        status: 'fetched'
      });

    case 'FETCH_TEACHERS_CLASSES_FAILURE':
      return Object.assign({}, state, {
        status: 'failed'
      });

    case 'TEACHER_CLASS_LEAVE_SUCCESS':
      return Object.assign({}, state, {
        joinedClasses: state.joinedClasses.filter((item) => {
          return item.id !== action.cid;
        })
      });

    default:
      return state;
  }
}
