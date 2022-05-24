// 引入combineReducers汇总多个reducer
import { combineReducers } from 'redux-immutable';
import { reducer as recommendReducer } from '../application/Recommend/store/index';

export default combineReducers ({
  recommend: recommendReducer,
});