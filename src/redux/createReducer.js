import { combineReducers } from 'redux';
import {reducer as formReducer} from 'redux-form';
import practiceReducer from './reducers/practice';
import goalsReducer from './reducers/goals';
import assignmentsReducer from './reducers/assignments';
import userReducer from './reducers/user';
import progressChartReducer from './reducers/progressChart';
import classesReducer from './reducers/classes';
import piecesReducer from './reducers/pieces';
import usersListReducer from './reducers/usersList';
import searchResultReducer from './reducers/searchResult';
import answersReducer from './reducers/answers';


export default combineReducers({
	goals: goalsReducer,
  form: formReducer,
  practice: practiceReducer,
  assignments: assignmentsReducer,
  user: userReducer,
  progressChart: progressChartReducer,
  classes: classesReducer,
  usersList: usersListReducer,
  pieces: piecesReducer,
  searchResult: searchResultReducer,
  answers: answersReducer,
});
