// 用于存放 initialState 和reducer函数

import * as actionTypes from './constants';
// fromJS 用于把JS数据转换成immutable数据结构
import { fromJS } from 'immutable';

const defaultState = fromJS({
  category: "",
  alpha: "",
  singerList: [],
  enterLoading: true,
  pullUpLoading: false,
  pullDownLoading: false,
  listOffset: 0, // 请求列表的偏移不是page，是个数
})

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = defaultState, action) => {
  switch(action.type) {
    case actionTypes.CHANGE_ALPHA:
      return state.merge({
        'alpha': action.data,
        listOffset: 0,
        enterLoading: true
      });
    case actionTypes.CHANGE_CATOGORY:
      return state.merge({
        'category': action.data,
        listOffset: 0,
        enterLoading: true
      });;
    case actionTypes.CHANGE_SINGER_LIST:
      // 由于存放的是immutable数据，所以必须用set方法来设置新状态
      return state.set('singerList', action.data);
    case actionTypes.CHANGE_LIST_OFFSET:
      return state.set('listOffset', action.data);
    case actionTypes.CHANGE_ENTER_LOADING:
      return state.set('enterLoading', action.data);
    case actionTypes.CHANGE_PULLUP_LOADING:
      return state.set('pullUpLoading', action.data);
    case actionTypes.CHANGE_PULLDOWN_LOADING:
      return state.set('pullDownLoading', action.data);
    default:
      return state;
  }
}