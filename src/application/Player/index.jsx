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
import { isEmptyObject, getSongUrl } from '../../api/utils';
import PlayList from './play-list/index';

function Player(props) {
  // debugger;

  // const currentSong = {
  //   al: { picUrl: "https://p1.music.126.net/JL_id1CFwNJpzgrXwemh4Q==/109951164172892390.jpg" },
  //   name: "木偶人",
  //   ar: [{name: "薛之谦"}]
  // }
  // let currentSong = immutableCurrentSong.toJS();

  // 目前播放时间
  const [ currentTime, setCurrentTime ] = useState(0);
  // 歌曲总时长
  const [ duration, setDuration ] = useState(0);
  const [ currentPlayingLyric, setPlayingLyric ] = useState("");
  const [ modeText, setModeText ] = useState("");
  // 歌曲播放进度
  let percent = isNaN(currentTime / duration) ? 0 : currentTime / duration;

  const { speed, fullScreen, playing, currentIndex, currentSong:immutableCurrentSong, playList:immutablePlayList, mode, sequencePlayList: immutableSequencePlayList } = props;
  const { togglePlayingDispatch, toggleFullScreenDispatch, changeCurrentIndexDispatch, changeCurrentDispatch } = props;

  const playList = immutablePlayList.toJS();
  const sequencePlayList = immutableSequencePlayList.toJS();
  const currentSong = immutableCurrentSong.toJS();
  const [preSong, setPreSong] = useState({});

  const audioRef = useRef();

  const currentLyric = useRef();
  const currentLineNum = useRef(0);
  const songReady = useRef(true);
  
  const clickPlaying = (e, state) => {
    e.stopPropagation();
    togglePlayingDispatch(state);
  }
  // console.log('currentSong :>> ', currentSong);

  useEffect(() => {
    if (
      !playList.length ||
      currentIndex === -1 ||
      !playList[currentIndex] ||
      playList[currentIndex].id === preSong.id ||
      !songReady.current
    )
    return;
    songReady.current = false;
    let current = playList[currentIndex];
    changeCurrentDispatch(current); // 赋值currentSong
    setPreSong(current);
    setPlayingLyric("");
    audioRef.current.src = getSongUrl(current.id);
    audioRef.current.autoplay = true;
    audioRef.current.playbackRate = speed;
    togglePlayingDispatch(true);  // 播放状态
    setCurrentTime(0); // 从头开始播放
    setDuration((current.dt / 1000) | 0);  // 时长
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, playList]);

  // 通过监听playing变量实现播放和暂停
  useEffect(() => {
    playing ? audioRef.current.play() : audioRef.current.pause();
  }, [playing]);
  

  // audio标签在播放过程中会不断的触发onTimeUpdate 在此处需要更新updateTime
  const updateTime = e => {
    setCurrentTime(e.target.currentTime);
  };

  return(
    <div>
      { isEmptyObject(currentSong) ? null : (
        <NormalPlayer
        song={currentSong}
        fullScreen={fullScreen}
        playing={playing}
        duration={duration} // 总时长
        currentTime={currentTime} // 播放时间
        percent={percent} // 进度
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
      <audio ref={audioRef} onTimeUpdate={updateTime}></audio>
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
    // 切换全屏
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