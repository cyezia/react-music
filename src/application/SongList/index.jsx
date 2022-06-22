import React, { useState, useEffect } from 'react';
import { SongList, SongItem } from "./style";
import { getName } from '../../api/utils';
import { changePlayList, changeCurrentIndex, changeSequencePlayList } from './../../application/Player/store/actionCreators';
import { connect } from 'react-redux'
import { ONE_PAGE_COUNT } from '../../api/config';

// 函数式组件天生不具备被上层组件直接调用ref的条件 用forwardRef包裹来处理
const SongsList = React.forwardRef((props, refs)=> {
  // debugger;
  const [startIndex, setStartIndex] = useState(0);
  const { collectCount, showCollect, songs, loading=false, usePageSplit } = props;
  const { changePlayListDispatch, changeCurrentIndexDispatch, changeSequencePlayListDispatch } = props;
  const { musicAnimation } = props;
  const totalCount = songs.length;

  useEffect(() => {
    if(!loading) return;
    if(startIndex + 1 + ONE_PAGE_COUNT >= totalCount) return;
    setStartIndex(startIndex + ONE_PAGE_COUNT);
  }, [loading, startIndex, totalCount]);

  const selectItem = (e, index) => {
    // console.log(index);
    changePlayListDispatch(songs);
    changeSequencePlayListDispatch(songs);
    changeCurrentIndexDispatch(index);
    musicAnimation(e.nativeEvent.clientX, e.nativeEvent.clientY);
  }

  let songList = (list) => {
    let res = [];
    // 判断页数是否超过总数
    let end = usePageSplit ? startIndex + ONE_PAGE_COUNT : list.length;
    for (let i = 0; i < end; i++) {
      if(i >= list.length) break;
      let item = list[i];
      res.push (
        <li key={item.id} onClick={(e) => selectItem(e, i)}>
          <span className="index">{i + 1}</span>
          <div className="info">
            <span>{item.name}</span>
            <span>
              { item.ar ? getName(item.ar) : getName(item.artists) } - { item.al ? item.al.name : item.album.name}
            </span>
          </div>
        </li>
      )
    }
    return res;
  };

  const collect = (count) => {
    return  (
      <div className="add_list">
        <i className="iconfont">&#xe62d;</i>
        <span > 收藏 ({Math.floor (count/1000)/10} 万)</span>
      </div>
    )
  };
  return (
    <SongList ref={refs} showBackground={props.showBackground}>
      <div className="first_line">
        <div className="play_all" onClick={(e) => selectItem(e, 0)}>
          <i className="iconfont">&#xe6e3;</i>
          <span> 播放全部 <span className="sum">(共 {totalCount} 首)</span></span>
        </div>
        { showCollect ? collect(collectCount) : null}
      </div>
      <SongItem>
        { songList(songs) }
      </SongItem>
    </SongList>
  )
});

const mapStateToProps = (state) => ({
  fullScreen: state.getIn(['player', 'fullScreen']),
  playing: state.getIn(['player', 'playing']),
  currentSong: state.getIn(['player', 'currentSong']),
  scrollY: state.getIn(['album', 'scrollY'])  
});

const mapDispatchToProps = (dispatch) => {
  return {
    changePlayListDispatch(data){
      dispatch(changePlayList(data));
    },
    changeCurrentIndexDispatch(data) {
      dispatch(changeCurrentIndex(data));
    },
    changeSequencePlayListDispatch(data) {
      dispatch(changeSequencePlayList(data))
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(SongsList));