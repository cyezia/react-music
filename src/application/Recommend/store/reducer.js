// 用于存放 initialState 和reducer函数

import * as actionTypes from './constants';
// fromJS 用于把JS数据转换成immutable数据
import { fromJS } from "immutable";

const defaultState = fromJS({
  bannerList: [],
  recommendList: []
});

const recommendReducer = (state = defaultState, action) => {
  switch(action.type) {
    case actionTypes.CHANGE_BANNER:
      // 由于存放的是immutable数据，所以必须用set方法来设置新状态
      return state.set('bannerList', action.data);
    case actionTypes.CHANGE_RECOMMEND_LIST:
      return state.set('recommendList', action.data);
    default:
      return state;
  }
}

export default recommendReducer;
