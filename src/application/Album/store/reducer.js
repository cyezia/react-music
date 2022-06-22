// 用于存放 initialState 和reducer函数

import * as actionTypes from './constants';
// fromJS 用于把JS数据转换成immutable数据结构
import { fromJS } from 'immutable';

const defaultState = fromJS({
  currentAlbum: {},
  pullUpLoading: false,
  enterLoading: false,
  startIndex: 0,
  totalCount: 0,
})


const albumReducer = (state = defaultState, action) => {
  // debugger;
  switch(action.type) {
    case actionTypes.CHANGE_CURRENT_ALBUM:
      // 由于存放的是immutable数据，所以必须用set方法来设置新状态
      return state.set('currentAlbum', action.data);
    case actionTypes.CHANGE_PULLUP_LOADING:
      return state.set('pullUpLoading', action.data);
    case actionTypes.CHANGE_ENTER_LOADING:
      return state.set('enterLoading', action.data);
    case actionTypes.CHANGE_START_INDEX:
      return state.set('startIndex', action.data).set('pullUpLoading', false);
    default:
      return state;
  }
}

export default albumReducer;