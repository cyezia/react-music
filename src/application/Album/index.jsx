import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Container } from './style';
import style from '../../assets/global-style';
import { CSSTransition } from 'react-transition-group';
import Header from '../../baseUI/header/index';
import Scroll from '../../baseUI/scroll/index';
import { connect } from 'react-redux';
import { getAlbumList, changePullUpLoading, changeEnterLoading } from './store/actionCreators';
import { isEmptyObject } from '../../api/utils';
import AlbumDetail from '../../components/album-detail/index';
import { EnterLoading } from './../Singers/style';
import Loading from '../../baseUI/loading/index';
import { HEADER_HEIGHT } from '../../api/config';

function Album(props) {
  // console.log('props: ', props);
  // debugger;
  const [ showStatus, setShowStatus ] = useState(true);
  const [ title, setTitle ] = useState("歌单");
  const headerEl = useRef();
  const musicNoteRef = useRef();
  // 从路由中拿到歌单的id
  const id = props.match.params.id;

  const { currentAlbum, enterLoading, pullUpLoading, songsCount } = props;
  const { getAlbumDataDispatch, changePullUpLoadingStateDispatch } = props;

  let currentAlbumJS = currentAlbum.toJS();

  useEffect(() => {
    getAlbumDataDispatch(id);
  }, [getAlbumDataDispatch, id]);

  const handleScroll = useCallback((pos) => {
    let minScrollY = -HEADER_HEIGHT;
    let percent = Math.abs(pos.y/minScrollY);  // math.abs()返回指定数的绝对值
    let headerDom = headerEl.current;
    if(pos.y < minScrollY) {
      headerDom.style.backgroundColor = style["theme-color"];
      headerDom.style.opacity = Math.min(1, (percent-1)/2);
      setTitle(currentAlbumJS&&currentAlbumJS.name);
    }else{
      headerDom.style.backgroundColor = "";
      headerDom.style.opacity = 1;
      setTitle("歌单");
    }
  }, [currentAlbumJS]);

  const handlePullUp = () => {
    changePullUpLoadingStateDispatch(true);
    changePullUpLoadingStateDispatch(false);
  }

  const handleBack = useCallback(() => {
    setShowStatus(false);
  }, []);

  const musicAnimation = (x, y) => {
    musicNoteRef.current.startAnimation({x, y});
  }

  return (
    <CSSTransition 
      in={showStatus} 
      timeout={300} 
      classNames="fly"
      appear={true}
      unmountOnExit
      // 在退出动画执行结束后跳转路由
      onExited={props.history.goBack}
    >
      <Container play={songsCount}>
        <Header ref={headerEl} title={title} handleClick={handleBack}></Header>
        {
          !isEmptyObject(currentAlbumJS) ? (
            <Scroll
              onScroll={handleScroll}
              pullUp={handlePullUp}
              pullUpLoading={pullUpLoading}
              bounceTop={false}
            >
              <AlbumDetail currentAlbum={currentAlbumJS} pullUpLoading={pullUpLoading} musicAnimation={musicAnimation}></AlbumDetail>
            </Scroll>
          ) : null
        }
        { enterLoading ? <EnterLoading><Loading></Loading></EnterLoading> : null }
      </Container>
    </CSSTransition>
  );
}

// 映射redux到全局的state组件的props上
const mapStateToProps = (state) => {
  // console.log('state: ', state);
  // console.log('currentAlbum: ', state.getIn(['album', 'currentAlbum']));
  // console.log('pullUpLoading :>> ', state.getIn(['album', 'pullUpLoading']));
  // console.log('songsCount: ', state.getIn(['player', 'playList']));
  return ({
    currentAlbum: state.getIn(['album', 'currentAlbum']),
    pullUpLoading: state.getIn(['album', 'pullUpLoading']),
    enterLoading: state.getIn(['album', 'enterLoading']),
    startIndex: state.getIn(['album', 'startIndex']),
    totalCount: state.getIn(['album', 'totalCount']),
    // 解决mini播放器出现后底部内容被遮挡，判断playList长度，如果大于0则正在播放，等于0则没有播放
    songsCount: state.getIn(['player', 'playList']).size
  })
};

// 映射dispatch到props上
const mapDispatchToProps = (dispatch) => {
  return {
    getAlbumDataDispatch(id) {
      dispatch(changeEnterLoading(true));
      dispatch(getAlbumList(id));
    },
    changePullUpLoadingStateDispatch(state) {
      dispatch(changePullUpLoading(state));
    }
  } 
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Album));