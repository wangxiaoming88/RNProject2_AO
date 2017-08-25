let initialState = {
  username: '',
  email: '',
  name: '',
  location: '',
  role: '',
  avatar: null,
  status: 'fresh'
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case 'USER_FETCH_DATA_REQUEST':
      return Object.assign({}, initialState, {
        status: 'fetching'
      });
    case 'USER_FETCH_DATA_SUCCESS':
      return Object.assign({}, state, {
        ...action.data,
        status: 'fetched'
      });
    case 'USER_FETCH_DATA_FAILURE':
      return Object.assign({}, state, {status: 'failed'});

    case 'FETCH_MY_LEVEL_REQUEST':
      return Object.assign({}, state, { status: 'fetching'});

    case 'FETCH_MY_LEVEL_SUCCESS':
      return Object.assign({}, state, {...action.data, status: 'fetched'});
      
    case 'FETCH_MY_LEVEL_FAILURE':
      return Object.assign({}, state, { status: 'failed' });

    case 'USER_UPDATE_DATA_REQUEST':
      return Object.assign({}, state, {status: 'fetching'});
    case 'USER_UPDATE_DATA_SUCCESS':
      return Object.assign({}, state, action.data);
    case 'USER_UPDATE_DATA_FAILURE':
      return Object.assign({}, state, {status: 'failed'});

    case 'USER_UPDATE_API_PHOTO_URL_SUCCESS':
      return Object.assign({}, state, {avatar: action.data.avatar});

    default:
      return state;
  }
}
