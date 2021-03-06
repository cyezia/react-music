import React, { useEffect } from 'react';
import { renderRoutes } from "react-router-config";
import { connect } from 'react-redux';
import { getRankList } from './store/index';
import Loading from '../../baseUI/loading';
import { List, ListItem, SongList, Container } from './style';
import Scroll from '../../baseUI/scroll/index';
import { EnterLoading } from './../Singers/style';
import { filterIndex } from '../../api/utils';


// 排行榜组件
function Rank(props) {
//   const { route } = props;

//   return (
//     <div>
//       <div>Rank</div>
//       { renderRoutes (route.routes) }
//     </div>
//   )
// }
  const { rankList:list, loading, songsCount } = props;
  // console.log('props: ', props);
  const { getRankListDataDispatch } = props;


  let rankList = list ? list.toJS() : [];
  // console.log('rankList: ', rankList);
  

  useEffect(() => {
    if(!rankList.length) {
      getRankListDataDispatch();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const enterDetail = (detail) => {
    props.history.push(`/rank/${detail.id}`);
  }

  const renderSongList = (list) => {
    return list.length ? (
      <SongList>
        {
          list.map((item, index) => {
            return <li key={index}>{index + 1}.{item.first} - {item.second}</li>
          })
        }
      </SongList>
    ) : null;
  }

  // 渲染榜单列表函数 传入global区别不同的布局方式
  const renderRankList = (list, global) => {
    return (
      <List globalRank={global}>
        {
          list.map((item, index) => {
            return (
              <ListItem key={`${item.coverImgId}${index}`} tracks={item.tracks} onClick={() => enterDetail(item)}>
                <div className="img_wrapper">
                  <img src={item.coverImgUrl} alt="" />
                  {/* 给图片上的图标和文字提供一个遮罩 因为字体颜色设置的白色，当背景图片也是白色的时候，会看不清，故提供一个阴影来衬托文字 */}
                  <div className="decorate"></div>
                  <span className="update_frequecy">{item.updateFrequency}</span>
                </div>
                { renderSongList(item.tracks) }
              </ListItem>
            )
          })
        }
      </List>
    )
  }


  let globalStartIndex = filterIndex(rankList);
  let officialList = rankList.slice(0, globalStartIndex);
  let globalList = rankList.slice(globalStartIndex);
  // 榜单数据为加载出来之前都隐藏
  let displayStyle = loading ? {"display" : "none"} : {"display" : ""};

  return (
    <Container play={songsCount}>
      <Scroll>
        <div>
          <h1 className="offical" style={displayStyle}>官方榜</h1>
            { renderRankList(officialList) }
          <h1 className="global" style={displayStyle}>全球榜</h1>
            { renderRankList(globalList, true) }
          { loading ? <EnterLoading><Loading></Loading></EnterLoading> : null }
        </div>
      </Scroll>
      { renderRoutes(props.route.routes)}
    </Container>
  );
}
// 映射redux全局的state到组件的props上
const mapStateToProps = (state) => ({
  rankList: state.getIn(['rank', 'rankList']),
  loading: state.getIn(['rank', 'loading']),
  // 解决mini播放器出现后底部内容被遮挡，判断playList长度，如果大于0则正在播放，等于0则没有播放
  songsCount: state.getIn(['player', 'playList']).size
});

// 映射dispatch到props上
const mapDispatchToProps = (dispatch) => {
  return {
    getRankListDataDispatch() {
      dispatch(getRankList());
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Rank));