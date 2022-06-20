import React, { useRef, useCallback } from 'react';
import { CSSTransition } from 'react-transition-group';
import {getName} from '../../../api/utils';
import { MiniPlayerContainer } from './style';
import ProgressCircle from '../../../baseUI/progress-circle';

function MiniPlayer(props) {
  // debugger;
  const { song, percent, fullScreen, playing } = props;
  // console.log('percent: ', percent);

  const { clickPlaying, setFullScreen, togglePlayList } = props;
  
  const miniPlayerRef = useRef();
  const miniWrapperRef = useRef();
  const miniImageRef = useRef();

  // 全屏播放列表
  const handleTogglePlayList = useCallback((e) => {
    togglePlayList(true);
    e.stopPropagation();
  }, [togglePlayList]);

  return (
    <CSSTransition
      in={!fullScreen} 
      timeout={400} 
      classNames="mini" 
      onEnter={() => { miniPlayerRef.current.style.display = "flex"; }}
      onExited={() => { miniPlayerRef.current.style.display = "none"; }}
    >
      {/* 点击切换全屏 */}
      <MiniPlayerContainer ref={miniPlayerRef} onClick={() => setFullScreen(true)}>
        <div className="icon">
          <div className="imgWrapper" ref={miniWrapperRef}>
            {/* 暂停的时候唱片也停止转动 */}
            <img className={`play ${playing ? "": "pause"}`} ref={miniImageRef} src={song.al.picUrl} width="40" height="40" alt="img" />
          </div>
        </div>
        <div className="text">
          <h2 className="name">{song.name}</h2>
          <p className="desc">{getName(song.ar)}</p>
        </div>
        <div className="control">
          <ProgressCircle radius={32} percent={percent}>
            { playing ? 
              <i className="icon-mini iconfont icon-pause" onClick={e => clickPlaying(e, false)}>&#xe650;</i>
              :
              <i className="icon-mini iconfont icon-play" onClick={e => clickPlaying(e, true)}>&#xe61e;</i>
            }
          </ProgressCircle>
        </div>
        <div className="control" onClick={handleTogglePlayList}>
          <i className="iconfont">&#xe640;</i>
        </div>
      </MiniPlayerContainer>
    </CSSTransition>
  )
}

export default React.memo(MiniPlayer);