import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import MiniPlayer from './mini-player';
import NormalPlayer from './normal-player/index';
import {
  changePlayingState,
  changeShowPlayList,
  changeCurrentIndex,
  changeCurrentSong,
  changePlayList,
  changePlayMode,
  changeFullScreen,
  changeSpeed
} from "./store/actionCreators";
import { isEmptyObject } from '../../api/utils';

function Player(props) {
  const { fullScreen, playing } = props;
  const { togglePlayingDispatch, togglePlayListDispatch, toggleFullScreenDispatch } = props;

  const currentSong = {
    al: { picUrl: "https://p1.music.126.net/JL_id1CFwNJpzgrXwemh4Q==/109951164172892390.jpg" },
    name: "木偶人",
    ar: [{name: "薛之谦"}]
  }

  const clickPlaying = (e, state) => {
    e.stopPropagation();
    togglePlayingDispatch(state);
  }
  return(
    <div>
      { isEmptyObject(currentSong) ? null : (
        <NormalPlayer
        song={currentSong}
        fullScreen={fullScreen}
        playing={playing}
        toggleFullScreenDispatch={toggleFullScreenDispatch}
        clickPlaying={clickPlaying}
      ></NormalPlayer>
      )}
      { isEmptyObject(currentSong) ? null : (
        <MiniPlayer 
        song={currentSong} 
        fullScreen={fullScreen} 
        playing={playing} 
        clickPlaying={clickPlaying}
        setFullScreen={toggleFullScreenDispatch}
      ></MiniPlayer>
      )}
    </div>
  )
}

// 映射redux全局的state到组件的props上
const mapStateToProps = state => ({
  fullScreen: state.getIn(["player", "fullScreen"]),
  playing: state.getIn(["player", "playing"]),
  currentSong: state.getIn(["player", "currentSong"]),
  showPlayList: state.getIn(["player", "showPlayList"]),
  mode: state.getIn(["player", "mode"]),
  speed: state.getIn(["player", "speed"]),
  currentIndex: state.getIn(["player", "currentIndex"]),
  playList: state.getIn(["player", "playList"]),
  sequencePlayList: state.getIn(["player", "sequencePlayList"])
});

// 映射dispatch到props上
const mapDispatchToProps = dispatch => {
  return {
    togglePlayingDispatch(data) {
      dispatch(changePlayingState(data));
    },
    toggleFullScreenDispatch(data) {
      dispatch(changeFullScreen(data));
    },
    togglePlayListDispatch(data) {
      dispatch(changeShowPlayList(data));
    },
    changeCurrentIndexDispatch(index) {
      dispatch(changeCurrentIndex(index));
    },
    changeCurrentDispatch(data) {
      dispatch(changeCurrentSong(data));
    },
    changeModeDispatch(data) {
      dispatch(changePlayMode(data));
    },
    changePlayListDispatch(data) {
      dispatch(changePlayList(data));
    },
    changeSpeedDispatch(data) {
      dispatch(changeSpeed(data));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Player));