// fromJS 用于把JS数据转换成immutable数据结构
import { fromJS } from 'immutable';
import { getRankListRequest  } from '../../../api/request';

// 创建常量
export const CHANGE_RANK_LIST = 'home/rank/CHANGE_RANK_LIST';
export const CHANGE_LOADING = 'home/rank/CHANGE_LOADING';

// 创建action
const changeRankList = (data) => ({
  type: CHANGE_RANK_LIST,
  data: fromJS(data)
})

const changeLoading = (data) => ({
  type: CHANGE_LOADING,
  data
}) 

export const getRankList = () => {
  return dispatch => {
    getRankListRequest().then(data => {
      let list = data && data.list;
      dispatch(changeRankList(list));
      dispatch(changeLoading(false));
    })
  }
}

// reducer
const defaultState = fromJS({
  rankList: [],
  loading: true
})

const reducer = (state = defaultState, action) => {
  switch(action.type) {
    case CHANGE_RANK_LIST:
      // 由于存放的是immutable数据，所以必须用set方法来设置新状态
      return state.set('rankList', action.data);
    case CHANGE_LOADING:
      return state.set('loading', action.data);
    default:
      return state;
  }
}

export { reducer };