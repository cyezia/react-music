import React, { useState, useRef, useCallback, useEffect } from 'react';
import { CSSTransition } from "react-transition-group";
import Header from '../../baseUI/header/index';
import { Container, ImgWrapper, CollectButton, BgLayer, SongListWrapper } from './style';
import Scroll from '../../baseUI/scroll/index';
import SongsList from '../SongList';
import { HEADER_HEIGHT } from "./../../api/config";
import { changeEnterLoading, getSingerInfo } from './store/actionCreators';
import { connect } from 'react-redux';
import Loading from '../../baseUI/loading/index';
import { EnterLoading } from '../Singers/style';

function Singer(props) {
  // debugger;
  
  // mock数据
  // const artist = {
  //   picUrl: "https://p2.music.126.net/W__FCWFiyq0JdPtuLJoZVQ==/109951163765026271.jpg",
  //   name: "薛之谦",
  //   hotSongs: [
  //     {
  //       name: "我好像在哪见过你",
  //       ar: [{name: "薛之谦"}],
  //       al: {
  //         name: "薛之谦专辑"
  //       }
  //     },
  //     {
  //       name: "我好像在哪见过你",
  //       ar: [{name: "薛之谦"}],
  //       al: {
  //         name: "薛之谦专辑"
  //       }
  //     },
  //   ]
  // }

  // 图片初始高度
  const initialHeight = useRef(0);
  const [showStatus, setShowStatus] = useState(true);
  // 往上偏移的尺寸，漏出圆角
  const OFFSET = 5;
  const { 
    artist: immutableArtist, 
    songs: immutableSongs, 
    loading, 
    songsCount 
  } = props;
  // console.log('immutableArtist: ', immutableArtist);
  // console.log('immutableSongs: ', immutableSongs);
  const { getSingerDataDispatch } = props;

  const artist = immutableArtist.toJS();
  // console.log('artist: ', artist);
  const songs = immutableSongs.toJS();
  // console.log('songs: ', songs);

  const collectButton = useRef();
  const imageWrapper = useRef();
  const songScrollWrapper = useRef();
  const songScroll = useRef();
  const header = useRef();
  const layer = useRef();
  
  useEffect(() => {
    // debugger;
    const id = props.match.params.id;
    getSingerDataDispatch(id);
    let h = imageWrapper.current.offsetHeight;
    initialHeight.current = h;
    songScrollWrapper.current.style.top = `${h - OFFSET}px`;
    //把遮罩先放在下面，以裹住歌曲列表
    layer.current.style.top = `${h - OFFSET}px`;
    songScroll.current.refresh();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleScroll = pos => {
    let height = initialHeight.current;
    const newY = pos.y;
    const imageDOM = imageWrapper.current;
    const buttonDOM = collectButton.current;
    const headerDOM = header.current;
    const layerDOM = layer.current;
    const minScrollY = -(height - OFFSET) + HEADER_HEIGHT;
    // 滑动距离占图片高度的百分比
    const percent = Math.abs(newY / height);
    // 在歌手页布局中。歌单列表是没有自己的背景的，layerDOM起一个遮罩的作用，给歌单提供白色背景
    // 处理时随着内容的滚动，遮罩也要跟着移动

    // 处理下拉的情况，效果：图片放大，按钮跟着偏移
    if(newY > 0) {
      imageDOM.style["transform"] = `scale(${1 + percent})`;
      buttonDOM.style["transform"] = `translate3d(0, ${newY}px, 0)`;
      layerDOM.style.top = `${height - OFFSET + newY}px`;
    }else if(newY >= minScrollY) {
      // 往上滑动，但是还没超过Header部分
      layerDOM.style.top = `${height - OFFSET - Math.abs(newY)}px`;
      layerDOM.style.zIndex = 1;
      imageDOM.style.paddingTop = "75%";
      imageDOM.style.height = 0;
      imageDOM.style.zIndex = -1;
      // 按钮跟着移动且渐渐变透明
      buttonDOM.style["transform"] = `translate3d(0, ${newY}px, 0)`;
      buttonDOM.style["opacity"] = `${1 - percent * 2}`;
    }else if(newY < minScrollY) {
      // 往上滑动，但是超过了Header部分
      layerDOM.style.top = `${HEADER_HEIGHT - OFFSET}px`;
      // 保证遮罩层的优先级比图片高，不至于被图片遮挡住
      layerDOM.style.zIndex = 1;
      // 防止溢出的歌单内容遮住Header
      headerDOM.style.zIndex = 100;
      // 此时图片高度与Header一致
      imageDOM.style.height = `${HEADER_HEIGHT}px`;
      imageDOM.style.paddingTop = 0;
      imageDOM.style.zIndex = 99;
    }
  };


  const setShowStatusFalse = useCallback(() => {
    setShowStatus(false);
  }, []);

  return (
    <CSSTransition
      in={showStatus}
      timeout={300}
      classNames="fly"
      appear={true}
      unmountOnExit
      onExited={() => props.history.goBack()}
    >
      <Container>
        <Header title={artist.name} handleClick={setShowStatusFalse} ref={header}></Header>
        <ImgWrapper ref={imageWrapper} bgUrl={artist.picUrl}>
          <div className="filter"></div>
        </ImgWrapper>
        <CollectButton ref={collectButton}>
          <i className="iconfont">&#xe62d;</i>
          <span className="text">收藏</span>
        </CollectButton>
        <BgLayer ref={layer}></BgLayer>
        <SongListWrapper ref={songScrollWrapper} play={songsCount}>
          <Scroll onScroll={handleScroll} ref={songScroll}>
            <SongsList
              songs={songs}
              showCollect={false}
              usePageSplit={false}
            ></SongsList>
          </Scroll>
        </SongListWrapper>
        { loading ? (
          <EnterLoading style={{ zIndex: 100 }}>
            <Loading></Loading>
          </EnterLoading>
        ) : null}
      </Container>
    </CSSTransition>
  )
}

// 映射redux全局的state到组件的props上
const mapStateToProps = state => ({
  artist: state.getIn(["singerInfo", "artist"]),
  songs: state.getIn(["singerInfo", "songsOfArtist"]),
  loading: state.getIn(["singerInfo", "loading"]),
  songsCount: state.getIn(["player", "playList"])
});

// 映射dispatch到props上
const mapDispatchToProps = dispatch => {
  return {
    getSingerDataDispatch(id) {
      dispatch(changeEnterLoading(true));
      dispatch(getSingerInfo(id));
    }
  };
};

// 将UI组件包装成容器组件
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Singer));