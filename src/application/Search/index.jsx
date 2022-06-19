import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import { Container, ShortcutWrapper, HotKey } from './style';
import Scroll from '../../baseUI/scroll/index';
import SearchBox from '../../baseUI/search-box/index';
import { getHotKeyWords, changeEnterLoading, getSuggestList } from './store/actionCreators';
import { getSongDetail } from '../Player/store/actionCreators';
import Loading from '../../baseUI/loading/index';
import { EnterLoading, List, ListItem } from '../Singers/style';
import { SongItem } from '../Album/style';
import { getName } from '../../api/utils';


const Search = (props) => {
  // 控制动画
  const [show, setShow] = useState(false);
  const [query, setQuery] = useState('');

  const {
    hotList,
    suggestList: immutableSuggestList, 
    songsList: immutableSongsList,
    enterLoading,
    songsCount
  } = props;

  const suggestList = immutableSuggestList.toJS();
  const songsList = immutableSongsList.toJS();

  const {
    getHotKeyWordsDispatch,
    getSuggestListDispatch,
    changeEnterLoadingDispatch,
    getSongDetailDispatch
  } = props;

  // 组件初次渲染时 发送ajax请求拿到热门列表
  useEffect(() => {
    setShow(true);
    if(!hotList.size)
      getHotKeyWordsDispatch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 当搜索框为空 展示热门搜索列表
  const renderHotKey = () => {
    let list = hotList ? hotList.toJS() : [];
    return (
      <ul>
        {
          list.map(item => {
            return (
              <li className="item" key={item.first} onClick={() => setQuery(item.first)}>
                <span>{item.first}</span>
              </li>
            )
          })
        }
      </ul>
    )
  };

  // 搜索框内有内容时
  const handleQuery = (q) => {
    setQuery(q);
    if(!q) return;
    changeEnterLoadingDispatch(true);
    getSuggestListDispatch(q);
  }

  // 渲染歌手列表
  const renderSingers = () => {
    let singers = suggestList.artists;
    if(!singers || !singers.length) return;
    return (
      <List>
        <h1 className="title">相关歌手</h1>
        {
          singers.map((item, index) => {
            return (
              <ListItem key={item.accountId + "" + index} onClick={() => props.history.push(`/singers/${item.id}`)}>
                <div className="img_wrapper">
                  <div placeholder={<img width="100%" height="100%" src={require('./singer.png')} alt="singer"/>}>
                    <img src={item.picUrl} width="100%" height="100%" alt="music" />
                  </div>
                </div>
                <span className="name">歌手: {item.name}</span>
              </ListItem>
            )
          })
        }
      </List>
    )
  };

  // 渲染歌单列表
  const renderAlbum = () => {
    let albums = suggestList.playlists;
    if(!albums || !albums.length) return;
    return (
      <List>
        <h1 className="title">相关歌单</h1>
        {
          albums.map((item, index) => {
            return (
              <ListItem key={item.accountId + "" + index} onClick={() => props.history.push(`/album/${item.id}`)}>
                <div className="img_wrapper">
                  <div placeholder={<img width="100%" height="100%" src={require('./music.png')} alt="music"/>}>
                    <img src={item.coverImgUrl} width="100%" height="100%" alt="music" />
                  </div>
                </div>
                <span className="name">歌单: {item.name}</span>
              </ListItem>
            )
          })
        }
      </List>
    )
  };

  const selectItem = (e, id) => {
    getSongDetailDispatch(id);
  }

  // 渲染歌曲列表
  const renderSongs = () => {
    return (
      <SongItem style={{paddingLeft: "20px"}}>
        {
          songsList.map((item => {
            return (
              <li key={item.id} onClick={(e) => selectItem(e, item.id)}>
                <div className="info">
                  <span>{item.name}</span>
                  <span>
                    { getName(item.artists) } - { item.album.name }
                  </span>
                </div>
              </li>
            )
          }))
        }
      </SongItem>
    )
  };

  // 由于是传给子组件的方法，用useCallback包裹，以使得在依赖未改变，始终给子组件传递的是相同的引用
  const searchBack = useCallback(() => {
    setShow(false);
  }, []);

  return (
    <CSSTransition
      in={show}
      timeout={300}
      appear={true}
      classNames="fly"
      unmountOnExit
      onExited={() => props.history.goBack()}
    >
      <Container play={songsCount}>
        <div className="search_box_wrapper">
          <SearchBox back={searchBack} newQuery={query} handleQuery={handleQuery}></SearchBox>
        </div>
        {/* 热门搜索列表 */}
        <ShortcutWrapper show={!query}>
          <Scroll>
            <div>
              <HotKey>
                <h1 className="title">热门搜索</h1>
                {renderHotKey()}
              </HotKey>
            </div>
          </Scroll>
        </ShortcutWrapper>
        {/* 搜索结果 */}
        <ShortcutWrapper show={query}>
          <Scroll>
            <div>
              { renderSingers() }
              { renderAlbum() }
              { renderSongs() }
            </div>
          </Scroll>
        </ShortcutWrapper>
        { enterLoading ? <EnterLoading><Loading></Loading></EnterLoading> : null}
      </Container>
    </CSSTransition>
  )
}

// 映射redux全局的state到组件的props上
const mapStateToProps = (state) => ({
  hotList: state.getIn(['search', 'hotList']),
  suggestList: state.getIn(['search', 'suggestList']),
  songsList: state.getIn(['search', 'songsList']),
  enterLoading: state.getIn(['search', 'enterLoading']),
  songsCount: state.getIn(['player', 'playList'])
})

// 映射dispatch到props上
const mapDispatchToProps = dispatch => {
  return {
    getHotKeyWordsDispatch() {
      dispatch(getHotKeyWords());
    },
    getSuggestListDispatch(data) {
      dispatch(getSuggestList(data));
    },
    changeEnterLoadingDispatch(data) {
      dispatch(changeEnterLoading(data))
    },
    getSongDetailDispatch(id) {
      dispatch(getSongDetail(id));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Search));
