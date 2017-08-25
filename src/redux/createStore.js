import { createStore, applyMiddleware } from 'redux';
import reducer from './createReducer';
import thunk from 'redux-thunk';
import apiMiddleware from './middlewares/api';

let store = createStore(
  reducer,
  applyMiddleware(apiMiddleware, thunk)
);

export default store;
