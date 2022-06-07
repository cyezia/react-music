// 用于存放 initialState 和reducer函数
import * as actionTypes from './constants';
// fromJS 用于把JS数据转换成immutable数据
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