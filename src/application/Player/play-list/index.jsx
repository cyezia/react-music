import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { PlayListWrapper, ListHeader, ListContent, ScrollWrapper } from './style';
import Scroll from '../../../baseUI/scroll/index';
import { getName, playMode } from '../../../api/utils';
import { changeShowPlayList, changePlayMode, deleteSong, changeSequecePlayList } from '../store/actionCreators';
import { connect } from 'react-redux';

function PlayList(props) {

  const { mode, currentSong:immutableCurrentSong, showPlayList } = props;

  const currentSong = immutableCurrentSong.toJS();

  const getCurrentIcon = (item) => {
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
  return (
    <CSSTransition
      classNames="list-fade"
      timeout={300}
    >
      <PlayListWrapper>
        <div className="list_wrapper">
          <ListHeader>
            <h1 className="title">
              { getPlayMode() }
              <span className="iconfont clear">&#xe63d;</span>
            </h1>
          </ListHeader>
            <ScrollWrapper>
              <Scroll>
                <ListContent>
                  {
                    PlayList.map((item, index) => {
                      return (
                        <li className="item" key={item.id}>
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
  showPlayList: state.getIn(['player', 'showPlayList']),
})

const mapDispatchToProps = (dispatch) => {
  return {
    togglePlayListDispatch(data) {
      dispatch(changeShowPlayList(data));
    },
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(React.memo(PlayList));