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
import { playMode } from '../../api/config';
import { getLyricRequest } from '../../api/request';
import Lyric from '../../api/lyric-parser';

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
  // 即时歌词
  const [ currentPlayingLyric, setPlayingLyric ] = useState("");
  const [ modeText, setModeText ] = useState("");
  // 歌曲播放进度
  let percent = isNaN(currentTime / duration) ? 0 : currentTime / duration;

  const { 
    speed, 
    fullScreen, 
    playing, 
    currentIndex, 
    currentSong:immutableCurrentSong, 
    playList:immutablePlayList, 
    mode, 
    sequencePlayList: immutableSequencePlayList 
  } = props;
  const { 
    togglePlayingDispatch, 
    togglePlayListDispatch,
    toggleFullScreenDispatch, 
    changeCurrentIndexDispatch, 
    changeCurrentDispatch 
  } = props;

  const playList = immutablePlayList.toJS();
  const sequencePlayList = immutableSequencePlayList.toJS();
  const currentSong = immutableCurrentSong.toJS();
  // console.log('currentSong: ', currentSong);

  const [preSong, setPreSong] = useState({});

  const audioRef = useRef();

  const currentLyric = useRef();
  // 当前行数
  const currentLineNum = useRef(0);
  const songReady = useRef(true);
  
  // 歌曲暂停
  const clickPlaying = (e, state) => {
    e.stopPropagation();
    togglePlayingDispatch(state);
  }
  // console.log('currentSong :>> ', currentSong);

  // 进度条被点击或滑动时改变percent的回调函数，歌曲进度更新
  const onProgressChange = curPercent => {
    const newTime = curPercent * duration;
    setCurrentTime(newTime);
    audioRef.current.currentTime = newTime;
    if(!playing) {
      togglePlayingDispatch(true);
    }
    if(currentLyric.current) {
      currentLyric.current.seek(newTime * 1000);
    }
  };

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
  
  useEffect(() => {
    if (!fullScreen) return;
    if (currentLyric.current && currentLyric.current.lines.length) {
      handleLyric({
        lineNum: currentLineNum.current,
        txt: currentLyric.current.lines[currentLineNum.current].txt
      });
    }
  }, [fullScreen]);

  const handleLyric = ({ lineNum, txt }) => {
    if(!currentLyric.current) return;
    currentLineNum.current = lineNum;
    setPlayingLyric(txt);
  };

  const getLyric = id => {
    let lyric = "";
    if(currentLyric.current) {
      currentLyric.current.stop();
    }
    // 避免songReady恒为false的情况
    setTimeout(() => {
      songReady.current = true;
    }, 3000);
    getLyricRequest(id)
      .then(data => {
        lyric = data.lrc && data.lrc.lyric;
        if(!lyric) {
          currentLyric.current = null;
          return;
        }
        currentLyric.current = new Lyric(lyric, handleLyric, speed);
        currentLyric.current.play();
        currentLineNum.current = 0;
        currentLyric.current.seek(0);
      })
      .catch(() => {
        currentLyric.current = "";
        songReady.current = true;
        audioRef.current.play();
      });
  };

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
        percent={percent} // 进度
        currentTime={currentTime} // 播放时间
        currentLyric={currentLyric.current}
        currentPlayingLyric={currentPlayingLyric}
        currentLineNum={currentLineNum.current}
        onProgressChange={onProgressChange}
        toggleFullScreenDispatch={toggleFullScreenDispatch}
        togglePlayListDispatch={togglePlayListDispatch}
        clickPlaying={clickPlaying}
      ></NormalPlayer>
      )}
      { isEmptyObject(currentSong) ? null : (
        <MiniPlayer 
        song={currentSong} 
        fullScreen={fullScreen} 
        playing={playing} 
        percent={percent}
        clickPlaying={clickPlaying}
        setFullScreen={toggleFullScreenDispatch}
        togglePlayList={togglePlayListDispatch}
      ></MiniPlayer>
      )}
      <PlayList clearPreSong={setPreSong.bind(null, {})}></PlayList>
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