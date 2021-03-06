// 用于存放 initialState 和reducer函数

import * as actionTypes from './constants';
// fromJS 用于把JS数据转换成immutable数据结构
import { fromJS} from 'immutable';
import { playMode } from '../../../api/config';
import { findIndex } from '../../../api/utils';

const defaultState = fromJS({
  fullScreen: false, // 播放器是否为全屏模式
  playing: false, // 当前歌曲是否播放
  sequencePlayList: [], // 顺序播放列表
  playList: [], 
  mode: playMode.sequence, // 播放模式
  currentIndex: -1, // 当前歌曲在播放列表的索引位置
  showPlayList: false, // 是否展示播放列表
  currentSong: {},
  speed: 1
})

const handleInsertSong = (state, song) => {
  const playList = JSON.parse(JSON.stringify(state.get('playList').toJS()));
  const sequenceList = JSON.parse(JSON.stringify(state.get('sequencePlayList').toJS()));
  let currentIndex = state.get('currentIndex');
  // 看看有没有同款
  let fpIndex = findIndex(song, playList);
  // 如果是当前歌曲 直接不处理
  if(fpIndex === currentIndex && currentIndex !== -1) return state;
  currentIndex++;
  // 把歌放进去 放到当前播放歌曲额下一个位置
  playList.splice(currentIndex, 0, song);
  // 如果列表中已经存在要添加的歌
  if(fpIndex > -1) {
    if(currentIndex > fpIndex) {
      playList.splice(fpIndex, 1);
      currentIndex--;
    }else {
      playList.splice(fpIndex + 1, 1);
    }
  }
  let sequenceIndex = findIndex(playList[currentIndex], sequenceList) + 1;
  let fsIndex = findIndex(song, sequenceList);
  sequenceList.splice(sequenceIndex, 0, song);
  if(fsIndex > -1) {
    if(sequenceIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1);
      sequenceIndex--;
    }else {
      sequenceList.splice(fsIndex + 1, 1);
    }
  }
  return state.merge({
    'playList': fromJS(playList),
    'sequencePlayList': fromJS(sequenceList),
    'currentIndex': fromJS(currentIndex)
  });
}

const handleDeleteSong = (state, song) => {
  const playList = JSON.parse(JSON.stringify(state.get('playList').toJS()));
  const sequenceList = JSON.parse(JSON.stringify(state.get('sequencePlayList').toJS()));
  let currentIndex = state.get('currentIndex');
  // 找对应歌曲在播放列表中的索引
  const fpIndex = findIndex(song, playList);
  // 在播放列表中将其删除
  playList.splice(fpIndex, 1);
  // 如果删除的歌曲排在当前播放歌曲的前面，那么currentIndex--，让当前的歌正常播放
  if(fpIndex < currentIndex) currentIndex--;

  // 在sequenceList中删除歌曲即可
  const fsIndex = findIndex(song, sequenceList);
  sequenceList.splice(fsIndex, 1);

  return state.merge({
    'playList': fromJS(playList),
    'sequencePlayList': fromJS(sequenceList),
    'currentIndex': fromJS(currentIndex),
  });
}

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = defaultState, action) => {
  switch(action.type) {
    case actionTypes.SET_CURRENT_SONG:
      // 由于存放的是immutable数据，所以必须用set方法来设置新状态
      return state.set('currentSong', action.data);
    case actionTypes.SET_FULL_SCREEN:
      return state.set('fullScreen', action.data);
    case actionTypes.SET_PLAYING_STATE:
      return state.set('playing', action.data);
    case actionTypes.SET_SEQUENCE_PLAYLIST:
      return state.set('sequencePlayList', action.data);
    case actionTypes.SET_PLAYLIST:
      return state.set('playList', action.data);
    case actionTypes.SET_PLAY_MODE:
      return state.set('mode', action.data);
    case actionTypes.SET_CURRENT_INDEX:
      return state.set('currentIndex', action.data);
    case actionTypes.SET_SHOW_PLAYLIST:
      return state.set('showPlayList', action.data);
    case actionTypes.INSERT_SONG:
      return handleInsertSong(state, action.data);
    case actionTypes.DELETE_SONG:
      return handleDeleteSong(state, action.data);
    case actionTypes.CHANGE_SPEED:
      return state.set('speed', action.data);
    default:
      return state;
  }
}