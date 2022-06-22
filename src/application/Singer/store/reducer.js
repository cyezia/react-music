// 用于存放 initialState 和reducer函数

import * as actionTypes from './constants';
// fromJS 用于把JS数据转换成immutable数据结构
import { fromJS } from 'immutable';

const defaultState = fromJS({
  artist: {},
  songsOfArtist: [],
  loading: true
});


const singerInfoReducer = (state = defaultState, action) => {
  // console.log('artist: ', state.set('artist', action.data));
  switch(action.type) {
    case actionTypes.CHANGE_ARTIST:
      // 由于存放的是immutable数据，所以必须用set方法来设置新状态
      return state.set('artist', action.data);
    case actionTypes.CHANGE_SONGS_OF_ARTIST:
      return state.set('songsOfArtist', action.data);
    case actionTypes.CHANGE_ENTER_LOADING:
      return state.set('loading', action.data);
    default:
      return state;
  }
}

export default singerInfoReducer;