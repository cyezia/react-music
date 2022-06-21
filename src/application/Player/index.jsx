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
import { isEmptyObject, getSongUrl, shuffle, findIndex } from '../../api/utils';
import { playMode } from '../../api/config';
import PlayList from './play-list/index';
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
  // console.log('percent: ', percent);


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
    changeCurrentDispatch,
    changePlayListDispatch,
    changeModeDispatch,
    changeSpeedDispatch
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
    getLyric(current.id);
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

  // 歌曲暂停
  const clickPlaying = (e, state) => {
    e.stopPropagation();
    togglePlayingDispatch(state);
  }


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

  // audio标签在播放过程中会不断的触发onTimeUpdate 在此处需要更新updateTime
  const updateTime = e => {
    setCurrentTime(e.target.currentTime);
  };

  const handleLoop = () => {
    audioRef.current.currentTime = 0;
    togglePlayingDispatch(true);
    audioRef.current.play();
    if(currentLyric.current) {
      currentLyric.current.seek(0);
    }
  };

  const handlePrev = () => {
    if(playList.length === 1) {
      handleLoop();
      return;
    }
    let index = currentIndex - 1;
    if(index === 0) index = playList.length - 1;
    if(!playing) togglePlayingDispatch(true);
    changeCurrentIndexDispatch(index);
  };

  const handleNext = () => {
    if(playList.length === 1) {
      handleLoop();
      return;
    }
    let index = currentIndex + 1;
    if(index === playList.length) index = 0;
    if(!playing) togglePlayingDispatch(true);
    changeCurrentIndexDispatch(index);
  };

  const handleEnd = () => {
    if(mode === playMode.loop) {
      handleLoop();
    }else {
      handleNext();
    }
  };

  // 改变播放模式
  const changeMode = () => {
    let newMode = (mode + 1) % 3;
    if(newMode === 0) {
      //顺序模式
      changePlayListDispatch(sequencePlayList);
      let index = findIndex(currentSong, sequencePlayList);
      changeCurrentIndexDispatch(index);
      setModeText("顺序循环");
    }else if(newMode === 1) {
      //单曲循环
      changePlayListDispatch(sequencePlayList);
      setModeText("单曲循环");
    }else if(newMode === 2) {
      //随机播放
      let newList = shuffle(sequencePlayList);
      let index = findIndex(currentSong, newList);
      changePlayListDispatch(newList);
      changeCurrentIndexDispatch(index);
      setModeText("随机播放");
    }
    changeModeDispatch(newMode);
  };

  // 播放出错
  const handleError = () => {
    songReady.current = true;
    handleNext();
    alert("播放出错");
  };

  const clickSpeed = (newSpeed) => {
    changeSpeedDispatch(newSpeed);
    audioRef.current.playbackRate = newSpeed;
    currentLyric.current.changeSpeed(newSpeed);
    currentLyric.current.seek(currentTime * 1000);
  }

  return(
    <div>
      { isEmptyObject(currentSong) ? null : (
        <NormalPlayer
          song={currentSong}
          fullScreen={fullScreen}
          playing={playing}
          mode={mode}
          modeText={modeText}
          duration={duration} // 总时长
          percent={percent} // 进度
          currentTime={currentTime} // 播放时间
          currentLyric={currentLyric.current}
          currentPlayingLyric={currentPlayingLyric}
          speed={speed}
          changeMode={changeMode}
          handlePrev={handlePrev}
          handleNext={handleNext}
          currentLineNum={currentLineNum.current}
          onProgressChange={onProgressChange}
          toggleFullScreenDispatch={toggleFullScreenDispatch}
          togglePlayListDispatch={togglePlayListDispatch}
          clickPlaying={clickPlaying}
          clickSpeed={clickSpeed}
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
      <audio 
        ref={audioRef} 
        onTimeUpdate={updateTime} 
        onEnded={handleEnd}
        onError={handleError}
      ></audio>
    </div>
  );
}

// 映射redux全局的state到组件的props上
const mapStateToProps = state => {
  // console.log('player: ', state.getIn(["player", "currentSong"]));
  return({
    fullScreen: state.getIn(["player", "fullScreen"]),
    playing: state.getIn(["player", "playing"]),
    currentSong: state.getIn(["player", "currentSong"]),
    showPlayList: state.getIn(["player", "showPlayList"]),
    mode: state.getIn(["player", "mode"]),
    speed: state.getIn(["player", "speed"]),
    currentIndex: state.getIn(["player", "currentIndex"]),
    playList: state.getIn(["player", "playList"]),
    sequencePlayList: state.getIn(["player", "sequencePlayList"])
  })
};

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