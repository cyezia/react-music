import React, { useRef, useState, useCallback } from 'react';
import { CSSTransition } from 'react-transition-group';
import { PlayListWrapper, ListHeader, ListContent, ScrollWrapper } from './style';
import Scroll from '../../../baseUI/scroll/index';
import { getName, prefixStyle } from '../../../api/utils';
import { changeShowPlayList, changePlayMode, deleteSong, changeSequencePlayList } from '../store/actionCreators';
import { changeCurrentSong, changeCurrentIndex, changePlayList, changePlayingState } from './../store/actionCreators';
import { connect } from 'react-redux';
import { list, playMode } from '../../../api/config';


function PlayList(props) {

  const { mode, currentIndex, currentSong:immutableCurrentSong, showPlayList, playList:immutablePlayList, sequencePlayList:immutableSequencePlayList } = props;
  const { togglePlayListDispatch, changeCurrentIndexDispatch, changePlayListDispatch, changeModeDispatch, deleteSongDispatch, clearDispatch } = props;

  const { clearPreSong } = props; // 清空PreSong

  const playListRef = useRef();
  const listWrapperRef = useRef();
  const [isShow, setIsShow] = useState(false);
  const confirmRef = useRef();

  const transform = prefixStyle("transform");

  const currentSong = immutableCurrentSong.toJS();

  const handleDeleteSong = (e, song) => {
    e.stopPropagation();
    deleteSongDispatch(song);
  } 

  const handleShowClear = () => {
    confirmRef.current.show();
  }

  const handleChangeCurrentIndex = (index) => {
    if(currentIndex === index) return;
    changeCurrentIndexDispatch(index);
  }

  const getCurrentIcon = (item) => {
    // 是不是当前正在播放的歌曲
    const current = currentSong.id === item.id;
    const className = current ? 'icon-play' : '';
    const content = current ? '&#xe6e3;': '';
    return (
      <i className={`current iconfont ${className}`} dangerouslySetInnerHTML={{__html:content}}></i>
    )
  }

  const getFavoriteIcon = (item) => {
    return (
      <i className="iconfont">&#xe601;</i>
    )
  }

  const getPlayMode = () => {
    let content, text;
    if(mode === playMode.sequence) {
      content =  "&#xe625;";
      text = "顺序播放";
    }else if(mode === playMode.loop) {
      content = "&#xe653;";
      text = "单曲循环";
    }else {
      content = "&#xe61b;";
      text = "随机播放";
    }
    return (
      <div>
        <i className="iconfont" dangerouslySetInnerHTML={{__html: content}}></i>
        <span className="text">{text}</span>
      </div>
    )
  }

  const onEnterCB = useCallback(() => {
    // 让列表显示
    setIsShow(true);
    // 最开始是隐藏在下面
    listWrapperRef.current.style[transform] = `translate3d(0, 100%, 0)`;
  }, [transform]);

  const onEnteringCB = useCallback(() => {
    // 让列表展现
    listWrapperRef.current.style["transition"] = "all 0.3s";
    listWrapperRef.current.style[transform] = `translate3d(0, 0, 0)`;
  }, [transform]);

  const onExitCB = useCallback(() => {

  });

  const onExitingCB = useCallback(() => {
    listWrapperRef.current.style["transition"] = "all 0.3s";
    listWrapperRef.current.style[transform] = `translate3d(0px, 100%, 0px)`;
  }, [transform]);

  const onExitedCB = useCallback(() => {
    setIsShow(false);
    listWrapperRef.current.style[transform] = `translate3d(0px, 100%, 0px)`;
  }, [transform]);

  return (
    <CSSTransition
      in={showPlayList}
      classNames="list-fade"
      timeout={300}
      onEnter={onEnterCB}
      onEntering={onEnteringCB}
      onExit={onExitCB}
      onExiting={onExitingCB}
      onExited={onExitedCB}
    >
      <PlayListWrapper 
        ref={playListRef}
        style={isShow === true ? { display: "block" } : { display: "none" }}
        onClick={() => togglePlayListDispatch(false)}
      >
        <div className="list_wrapper" ref={listWrapperRef} onClick={e => e.stopPropagation()}>
          <ListHeader>
            <h1 className="title">
              { getPlayMode() }
              <span className="iconfont clear" onClick={handleShowClear}>&#xe63d;</span>
            </h1>
          </ListHeader>
            <ScrollWrapper>
              <Scroll>
                <ListContent>
                  {
                    PlayList.map((item, index) => {
                      return (
                        <li className="item" key={item.id} onClick={() => handleChangeCurrentIndex(index)}>
                          { getCurrentIcon(item) }
                          <span className="text">{item.name} - {getName(item.ar)}</span>
                          <span className="like">
                            { getFavoriteIcon(item) }
                          </span>
                          <span className="delete">
                            <i className="iconfont">&#xe63d;</i>
                          </span>
                        </li>
                      )
                    })
                  }
                </ListContent>
              </Scroll>
            </ScrollWrapper>
          
        </div>
      </PlayListWrapper>
    </CSSTransition>
    
  )
}

const mapStateToProps = (state) => ({
  currentIndex: state.getIn(['player', 'currentIndex']),
  currentSong: state.getIn(['player', 'currentSong']),
  playList: state.getIn(['player', 'playList']), // 播放列表
  sequencePlayList: state.getIn(['player', 'sequencePlayList']), // 顺序排列时的播放列表
  showPlayList: state.getIn(['player', 'showPlayList']),
  mode: state.getIn(['player', 'mode'])
});

const mapDispatchToProps = (dispatch) => {
  return {
    togglePlayListDispatch(data) {
      dispatch(changeShowPlayList(data));
    },
    // 修改当前列表的index，也就是切歌
    changeCurrentIndexDispatch(data) {
      dispatch(changeCurrentIndex(data));
    },
    // 修改当前的播放模式
    changeModeDispatch(data) {
      dispatch(changePlayMode(data));
    },
    // 修改当前的播放列表
    changePlayListDispatch(data) {
      dispatch(changePlayList(data));
    },
    deleteSongDispatch(data) {
      dispatch(deleteSong(data));
    },
    clearDispatch() {
      dispatch(changePlayList([]));
      dispatch(changeSequencePlayList([]));
      dispatch(changeCurrentIndex(-1));
      dispatch(changeShowPlayList(false));
      dispatch(changeCurrentSong({}));
      dispatch(changePlayingState(false));
    }
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(React.memo(PlayList));