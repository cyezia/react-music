import React from 'react';
import { ListWrapper, List, ListItem } from './style';
import { getCount } from '../../api/utils';
import { withRouter } from 'react-router-dom';

// 推荐列表
function RecommendList(props) {
  const enterDetail = (id) => {
    props.history.push(`/recommend/${id}`);
  }

  return (
    <ListWrapper>
      <h1 className="title">推荐歌单</h1>
      <List>
        {
          props.recommendList.map(item => {
            return (
              <ListItem key={item.id} onClick={() => enterDetail(item.id)}>
                <div className="img_wrapper">
                  {/* 给图片上的图标和文字提供一个遮罩 因为字体颜色设置的白色，当背景图片也是白色的时候，会看不清，故提供一个阴影来衬托文字 */}
                  <div className="decorate"></div>
                  {/* 减小请求的图片资源大小 */}
                  <img src={item.picUrl + "?param=300x300"} width="100%" height="100%" alt="music" />
                  <div className="play_count">
                    <i className="iconfont play">&#xe885;</i>
                    <span className="count">{getCount(item.playCount)}</span>
                  </div>
                </div>
                <div className="desc">{item.name}</div>
              </ListItem>
            )
          })
        }
      </List>
    </ListWrapper>
  );
}
// List组件是Recommend组件的子组件，无法从props中拿到history变量，此处使用withRouter包裹解决这个问题
export default withRouter(React.memo(RecommendList));