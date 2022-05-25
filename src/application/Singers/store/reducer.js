/* eslint-disable import/no-anonymous-default-export */
// 用于存放 initialState 和reducer函数

import * as actionTypes from './constants';
// fromJS 用于把JS数据转化成immutable数据
import { fromJS } from "immutable";

const defaultState = fromJS[{
  singerList: [],
  enterLoading: true, // 控制进场Loading
  // pullUpLoading, // 控制上拉加载动画
  // pullDownLoading, // 控制下拉加载动画
  pageCount: 0 // 当前页数
}]

export default (state = defaultState, action) => {
  switch(action.type) {
    case actionTypes.CHANGE_SINGER_LIST:
      return state.set('singerList', action.data);
    case actionTypes.CHANGE_PAGE_COUNT:
      return state.set('pageCount', action.data);
    case actionTypes.CHANGE_ENTER_LOADING:
      return state.set('enterLoading', action.data);
    // case actionTypes.CHANGE_PULLUP_LOADING:
    //   return state.set('pullUpLoading', action.data);
    // case actionTypes.CHANGE_PULLDOWN_LOADING:
    //   return state.set('pullDownLoading', action.data)
    default:
      return state;
  }
}

