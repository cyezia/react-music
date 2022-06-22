// 用于存放 initialState 和reducer函数

import * as actionTypes from './constants';
// fromJS 用于把JS数据转换成immutable数据结构
import { fromJS } from 'immutable';

const defaultState = fromJS({
  hotList: [],
  suggestList: [],
  songsList: [],
  enterLoading: false
})

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = defaultState, action) => {
  switch(action.type) {
    case actionTypes.SET_HOT_KEYWRODS:
      // 由于存放的是immutable数据，所以必须用set方法来设置新状态
      return state.set('hotList', action.data);
    case actionTypes.SET_SUGGEST_LIST:
      return state.set('suggestList', action.data);
    case actionTypes.SET_RESULT_SONGS_LIST:
      return state.set('songsList', action.data);
    case actionTypes.SET_ENTER_LOADING:
      return state.set('enterLoading', action.data);
    default:
      return state;
  }
}